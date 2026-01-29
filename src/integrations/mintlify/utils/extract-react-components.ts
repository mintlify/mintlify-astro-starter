import { compile } from "@mdx-js/mdx";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";
import { visit, SKIP } from "unist-util-visit";
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
import type { AstroIntegrationLogger } from "astro";

const COMPOUND_COMPONENTS = new Set([
  "Accordion",
  "AccordionGroup",
  "Card",
  "CardGroup",
  "CodeGroup",
  "Expandable",
  "Steps",
  "Tabs",
  "Tooltip",
]);

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

const MDX_COMPONENTS_PATH =
  "/src/integrations/mintlify/utils/mintlify-components.tsx";

interface ExtractedCompound {
  componentName: string;
  wrapperName: string;
  mdxSource: string;
}

interface ExtractedComponent {
  name: string;
  code: string;
  usedHooks: string[];
}

type JsxNode = MdxJsxFlowElement | MdxJsxTextElement;

function visitJsxNodes(
  tree: Root,
  visitor: (node: JsxNode, index?: number, parent?: any) => any,
) {
  visit(tree, "mdxJsxFlowElement", visitor);
  visit(tree, "mdxJsxTextElement", visitor);
}

interface CompoundContext {
  compounds: ExtractedCompound[];
  nodeReplacements: Map<JsxNode, string>;
  counters: Map<string, number>;
  mdxContent: string;
  logger?: AstroIntegrationLogger;
}

function detectUsedHooks(estree: EstreeNode): string[] {
  const usedHooks = new Set<string>();

  walk(estree, {
    enter(node) {
      const callee = (node as any).callee;
      if (
        node.type === "CallExpression" &&
        callee?.type === "Identifier" &&
        SUPPORTED_HOOKS.has(callee.name)
      ) {
        usedHooks.add(callee.name);
      }
    },
  });

  return Array.from(usedHooks);
}

function getExportedComponentInfo(node: MdxjsEsm): {
  names: string[];
  usedHooks: string[];
} {
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

  return {
    names,
    usedHooks: names.length > 0 ? detectUsedHooks(estree) : [],
  };
}

function createImportNode(name: string, path: string): MdxjsEsm {
  return {
    type: "mdxjsEsm",
    value: `import { ${name} } from "${path}";`,
  } as MdxjsEsm;
}

function addClientDirective(node: MdxJsxFlowElement | MdxJsxTextElement): void {
  node.attributes ??= [];

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
  if (usedHooks.length === 0) return code + "\n";
  return `import { ${usedHooks.join(", ")} } from "react";\n\n${code}\n`;
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

function processCompoundNode(node: JsxNode, ctx: CompoundContext) {
  if (!node.name || !COMPOUND_COMPONENTS.has(node.name)) return;
  if (!node.position?.start?.offset || !node.position?.end?.offset) {
    ctx.logger?.warn(`Skipping ${node.name}: missing position info`);
    return;
  }

  const count = (ctx.counters.get(node.name) || 0) + 1;
  ctx.counters.set(node.name, count);
  const wrapperName = `${node.name}_${count}`;

  ctx.compounds.push({
    componentName: node.name,
    wrapperName,
    mdxSource: ctx.mdxContent.slice(
      node.position.start.offset,
      node.position.end.offset,
    ),
  });

  ctx.nodeReplacements.set(node, wrapperName);
  return SKIP; // skips the children of the compound component because we will replace them with the wrapper component
}

function findCompoundComponents(
  tree: Root,
  mdxContent: string,
  logger?: AstroIntegrationLogger,
): {
  compounds: ExtractedCompound[];
  nodeReplacements: Map<JsxNode, string>;
} {
  const ctx: CompoundContext = {
    compounds: [],
    nodeReplacements: new Map(),
    counters: new Map(),
    mdxContent,
    logger,
  };

  visitJsxNodes(tree, (node) => processCompoundNode(node, ctx));

  return { compounds: ctx.compounds, nodeReplacements: ctx.nodeReplacements };
}

async function writeComponentFiles(
  components: ExtractedComponent[],
  componentsDir: string,
  pageSlug: string,
): Promise<void> {
  const pageComponentsDir = join(componentsDir, pageSlug);
  await mkdir(pageComponentsDir, { recursive: true });

  await Promise.all(
    components.map(({ name, code, usedHooks }) =>
      writeFile(
        join(pageComponentsDir, `${name}.jsx`),
        generateComponentFile(code, usedHooks),
        "utf-8",
      ),
    ),
  );
}

async function compileCompoundComponent(
  wrapperName: string,
  mdxSource: string,
): Promise<string> {
  const compiled = await compile(mdxSource, {
    jsx: true,
    outputFormat: "program",
    development: false,
    providerImportSource: MDX_COMPONENTS_PATH,
  });

  const compiledStr = String(compiled)
    .replace(
      /export default function MDXContent/g,
      `export function ${wrapperName}`,
    )
    .replace(/export \{ MDXContent as default \};?/g, "");

  return compiledStr;
}

async function writeCompoundComponentFiles(
  compounds: ExtractedCompound[],
  componentsDir: string,
  pageSlug: string,
): Promise<void> {
  if (compounds.length === 0) return;

  const pageComponentsDir = join(componentsDir, pageSlug);
  await mkdir(pageComponentsDir, { recursive: true });

  await Promise.all(
    compounds.map(async ({ wrapperName, mdxSource }) => {
      const code = await compileCompoundComponent(wrapperName, mdxSource);
      await writeFile(
        join(pageComponentsDir, `${wrapperName}.jsx`),
        code,
        "utf-8",
      );
    }),
  );
}

function getInsertIndex(tree: Root, skipEsm = false): number {
  let index = 0;

  for (const child of tree.children) {
    if (child.type === "yaml" || (skipEsm && child.type === "mdxjsEsm")) {
      index++;
    } else {
      break;
    }
  }

  return index;
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

  const importNodes = components.map((c) =>
    createImportNode(
      c.name,
      posix.join(relativeComponentsDir, `${c.name}.jsx`),
    ),
  );
  tree.children.splice(
    getInsertIndex(tree),
    0,
    ...(importNodes as RootContent[]),
  );

  const componentNames = new Set(components.map((c) => c.name));

  visitJsxNodes(tree, (node) => {
    if (node.name && componentNames.has(node.name)) {
      addClientDirective(node);
    }
  });
}

function createReplacementNode(
  type: "mdxJsxFlowElement" | "mdxJsxTextElement",
  wrapperName: string,
): JsxNode {
  return {
    type,
    name: wrapperName,
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "client:load",
        value: null,
      } as MdxJsxAttribute,
    ],
    children: [],
  } as JsxNode;
}

function transformTreeWithCompounds(
  tree: Root,
  compounds: ExtractedCompound[],
  nodeReplacements: Map<JsxNode, string>,
  relativeComponentsDir: string,
): void {
  if (compounds.length === 0) return;

  const importNodes = compounds.map((c) =>
    createImportNode(
      c.wrapperName,
      posix.join(relativeComponentsDir, `${c.wrapperName}.jsx`),
    ),
  );
  tree.children.splice(
    getInsertIndex(tree, true),
    0,
    ...(importNodes as RootContent[]),
  );

  visitJsxNodes(tree, (node, index, parent) => {
    const wrapperName = nodeReplacements.get(node);
    if (!wrapperName || index === undefined || !parent) return;

    (parent.children as JsxNode[])[index] = createReplacementNode(
      node.type,
      wrapperName,
    );
    return SKIP;
  });
}

export async function extractReactComponents(
  mdxContent: string,
  mdxFilePath: string,
  componentsDir: string,
  pageSlug: string,
  logger?: AstroIntegrationLogger,
): Promise<string> {
  const tree = remark()
    .use(remarkFrontmatter)
    .use(remarkMdx)
    .parse(mdxContent) as Root;

  const { components, nodesToRemove } = findExportedComponents(tree);
  const { compounds, nodeReplacements } = findCompoundComponents(
    tree,
    mdxContent,
    logger,
  );

  if (components.length === 0 && compounds.length === 0) {
    return mdxContent;
  }

  const mdxDir = dirname(mdxFilePath);
  const pageComponentsDir = join(componentsDir, pageSlug);
  const relativeComponentsDir = relative(mdxDir, pageComponentsDir)
    .split(sep)
    .join(posix.sep);

  if (components.length > 0) {
    await writeComponentFiles(components, componentsDir, pageSlug);
    transformTree(tree, components, nodesToRemove, relativeComponentsDir);
  }

  if (compounds.length > 0) {
    await writeCompoundComponentFiles(compounds, componentsDir, pageSlug);
    transformTreeWithCompounds(
      tree,
      compounds,
      nodeReplacements,
      relativeComponentsDir,
    );
  }

  return remark()
    .use(remarkFrontmatter)
    .use(remarkMdx)
    .use(remarkStringify)
    .stringify(tree);
}
