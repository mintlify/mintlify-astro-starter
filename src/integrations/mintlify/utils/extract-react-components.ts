import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";
import { walk } from "estree-walker";
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname, relative, posix, sep } from "node:path";
import type { Root, RootContent } from "mdast";
import type {
  MdxjsEsm,
  MdxJsxFlowElement,
  MdxJsxTextElement,
  MdxJsxAttribute,
} from "mdast-util-mdx";
import type { Node as EstreeNode } from "estree";

const SUPPORTED_HOOKS = new Set([
  "useState",
  "useEffect",
  "useRef",
  "useCallback",
  "useMemo",
  "useReducer",
  "useContext",
  "useLayoutEffect",
  "useImperativeHandle",
  "useDebugValue",
  "useDeferredValue",
  "useTransition",
  "useId",
  "useSyncExternalStore",
  "useInsertionEffect",
]);

interface ExtractedComponent {
  name: string;
  code: string;
  usedHooks: string[];
}

function detectUsedHooks(estree: EstreeNode): string[] {
  const usedHooks = new Set<string>();

  walk(estree, {
    enter(node) {
      if (
        node.type === "CallExpression" &&
        "callee" in node &&
        node.callee &&
        typeof node.callee === "object" &&
        "type" in node.callee &&
        node.callee.type === "Identifier" &&
        "name" in node.callee &&
        typeof node.callee.name === "string" &&
        SUPPORTED_HOOKS.has(node.callee.name)
      ) {
        usedHooks.add(node.callee.name);
      }
    },
  });

  return Array.from(usedHooks);
}

interface ExportedComponentInfo {
  names: string[];
  usedHooks: string[];
}

function getExportedComponentInfo(node: MdxjsEsm): ExportedComponentInfo {
  const estree = node.data?.estree;
  if (!estree) return { names: [], usedHooks: [] };

  const names: string[] = [];

  for (const statement of estree.body) {
    if (
      statement.type === "ExportNamedDeclaration" &&
      statement.declaration?.type === "VariableDeclaration"
    ) {
      for (const declarator of statement.declaration.declarations) {
        if (
          declarator.id.type === "Identifier" &&
          (declarator.init?.type === "ArrowFunctionExpression" ||
            declarator.init?.type === "FunctionExpression")
        ) {
          names.push(declarator.id.name);
        }
      }
    }
  }

  const usedHooks = names.length > 0 ? detectUsedHooks(estree) : [];

  return { names, usedHooks };
}

function createImportNode(componentName: string, importPath: string): MdxjsEsm {
  return {
    type: "mdxjsEsm",
    value: `import { ${componentName} } from "${importPath}";`,
  } as MdxjsEsm;
}

function addClientDirective(node: MdxJsxFlowElement | MdxJsxTextElement): void {
  if (!node.attributes) {
    node.attributes = [];
  }

  const hasClientDirective = node.attributes.some(
    (attr) =>
      attr.type === "mdxJsxAttribute" &&
      typeof attr.name === "string" &&
      attr.name.startsWith("client:"),
  );

  if (!hasClientDirective) {
    node.attributes.push({
      type: "mdxJsxAttribute",
      name: "client:load",
      value: null,
    } as MdxJsxAttribute);
  }
}

function generateComponentFile(code: string, usedHooks: string[]): string {
  if (usedHooks.length === 0) {
    return code + "\n";
  }
  const imports = `import { ${usedHooks.join(", ")} } from "react";\n\n`;
  return imports + code + "\n";
}

function findExportedComponents(tree: Root): {
  components: ExtractedComponent[];
  nodesToRemove: Set<MdxjsEsm>;
} {
  const components: ExtractedComponent[] = [];
  const nodesToRemove = new Set<MdxjsEsm>();
  const seenCode = new Set<string>();

  visit(tree, "mdxjsEsm", (node: MdxjsEsm) => {
    const { names, usedHooks } = getExportedComponentInfo(node);
    if (names.length > 0 && !seenCode.has(node.value)) {
      seenCode.add(node.value);
      for (const name of names) {
        components.push({ name, code: node.value, usedHooks });
      }
      nodesToRemove.add(node);
    }
  });

  return { components, nodesToRemove };
}

async function writeComponentFiles(
  components: ExtractedComponent[],
  componentsDir: string,
  pageSlug: string,
): Promise<void> {
  const pageComponentsDir = join(componentsDir, pageSlug);
  await mkdir(pageComponentsDir, { recursive: true });

  const codeToInfo = new Map<
    string,
    { names: string[]; usedHooks: string[] }
  >();
  for (const { name, code, usedHooks } of components) {
    const existing = codeToInfo.get(code);
    if (existing) {
      existing.names.push(name);
    } else {
      codeToInfo.set(code, { names: [name], usedHooks });
    }
  }

  for (const [code, { names, usedHooks }] of codeToInfo) {
    for (const name of names) {
      const filePath = join(pageComponentsDir, `${name}.jsx`);
      await writeFile(
        filePath,
        generateComponentFile(code, usedHooks),
        "utf-8",
      );
    }
  }
}

function transformTree(
  tree: Root,
  components: ExtractedComponent[],
  nodesToRemove: Set<MdxjsEsm>,
  relativeComponentsDir: string,
): void {
  tree.children = tree.children.filter(
    (child) => !nodesToRemove.has(child as MdxjsEsm),
  );

  let insertIndex = 0;
  if (tree.children[0]?.type === "yaml") {
    insertIndex = 1;
  }

  const importNodes = components.map((c) => {
    const importPath = posix.join(relativeComponentsDir, `${c.name}.jsx`);
    return createImportNode(c.name, importPath);
  });
  tree.children.splice(insertIndex, 0, ...(importNodes as RootContent[]));

  const componentNames = new Set(components.map((c) => c.name));

  visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElement) => {
    if (node.name && componentNames.has(node.name)) {
      addClientDirective(node);
    }
  });

  visit(tree, "mdxJsxTextElement", (node: MdxJsxTextElement) => {
    if (node.name && componentNames.has(node.name)) {
      addClientDirective(node);
    }
  });
}

export async function extractReactComponents(
  mdxContent: string,
  mdxFilePath: string,
  componentsDir: string,
  pageSlug: string,
): Promise<string> {
  const tree = remark()
    .use(remarkFrontmatter)
    .use(remarkMdx)
    .parse(mdxContent) as Root;

  const { components, nodesToRemove } = findExportedComponents(tree);

  if (components.length === 0) {
    return mdxContent;
  }

  await writeComponentFiles(components, componentsDir, pageSlug);

  const mdxDir = dirname(mdxFilePath);
  const pageComponentsDir = join(componentsDir, pageSlug);
  const relativeComponentsDir = relative(mdxDir, pageComponentsDir)
    .split(sep)
    .join(posix.sep);

  transformTree(tree, components, nodesToRemove, relativeComponentsDir);

  const processor = remark()
    .use(remarkFrontmatter)
    .use(remarkMdx)
    .use(remarkStringify);

  return processor.stringify(tree);
}
