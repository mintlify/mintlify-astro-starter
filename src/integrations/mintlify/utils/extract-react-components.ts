import { compile } from '@mdx-js/mdx';
import { visit, SKIP } from 'unist-util-visit';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname, relative, posix, sep } from 'node:path';
import type { Root, RootContent } from 'mdast';
import type {
  MdxjsEsm,
  MdxJsxFlowElement,
  MdxJsxTextElement,
} from 'mdast-util-mdx';
import {
  getAST,
  stringifyTree,
  findExportedNodes,
  getExportMapFromTree,
  isMdxJsxAttribute,
  createMdxJsxAttribute,
  allowedComponents,
} from '@mintlify/common';
import { getLogger } from './logger';

const COMPOUND_COMPONENTS = new Set([
  'Accordion',
  'AccordionGroup',
  'Card',
  'CardGroup',
  'CodeGroup',
  'Expandable',
  'Steps',
  'Tabs',
  'Tooltip',
]);

const SUPPORTED_HOOKS = new Set([
  'useState',
  'useEffect',
  'useRef',
  'useCallback',
  'useMemo',
  'useReducer',
  'useContext',
  'useLayoutEffect',
  'useImperativeHandle',
  'useDebugValue',
  'useDeferredValue',
  'useTransition',
  'useId',
  'useSyncExternalStore',
  'useInsertionEffect',
]);

// TODO: Change to "@mintlify/astro/mdx-provider" when we extract this to a separate package
const MDX_COMPONENTS_PATH =
  '/src/integrations/mintlify/utils/mintlify-components.tsx';

interface ExtractedCompoundComponent {
  wrapperName: string;
  mdxSource: string;
}

interface ExtractedComponent {
  name: string;
  code: string;
  usedHooks: string[];
}

type JsxNode = MdxJsxFlowElement | MdxJsxTextElement;

function isJsxNode(node: unknown): node is JsxNode {
  const n = node as { type?: string };
  return n?.type === 'mdxJsxFlowElement' || n?.type === 'mdxJsxTextElement';
}

function visitJsxNodes(
  tree: Root,
  visitor: (node: JsxNode, index?: number, parent?: any) => any,
) {
  visit(tree, (node, index, parent) => {
    if (isJsxNode(node)) {
      return visitor(node, index, parent);
    }
  });
}

interface CompoundContext {
  compounds: ExtractedCompoundComponent[];
  nodeReplacements: Map<JsxNode, string>;
  counters: Map<string, number>;
  mdxContent: string;
}

const detectHooksInCode = (code: string): string[] =>
  [...SUPPORTED_HOOKS].filter((hook) => code.includes(hook));

function createImportNode(name: string, path: string): MdxjsEsm {
  return {
    type: 'mdxjsEsm',
    value: `import { ${name} } from "${path}";`,
  } as MdxjsEsm;
}

function addClientDirective(node: JsxNode): void {
  node.attributes ??= [];

  const hasClientDirective = node.attributes.some(
    (attr) =>
      isMdxJsxAttribute(attr) &&
      typeof attr.name === 'string' &&
      attr.name.startsWith('client:'),
  );

  if (!hasClientDirective) {
    node.attributes.push(createMdxJsxAttribute('client:load', null));
  }
}

function generateComponentFile(code: string, usedHooks: string[]): string {
  const validComponents = allowedComponents.filter(
    (c) => !c.includes('.') && !c.includes('-') && /^[A-Z]/.test(c),
  );

  const imports = [
    `import * as Mintlify from "@mintlify/components";`,
    `const { ${validComponents.join(', ')} } = Mintlify;`,
  ];

  if (usedHooks.length > 0) {
    imports.unshift(`import { ${usedHooks.join(', ')} } from "react";`);
  }

  return imports.join('\n') + '\n\n' + code + '\n';
}

function findExportedComponents(tree: Root): {
  components: ExtractedComponent[];
  nodesToRemove: Set<MdxjsEsm>;
} {
  const exportedNames = findExportedNodes(
    tree,
    'ArrowFunctionExpression',
    'FunctionExpression',
  );

  if (exportedNames.length === 0) {
    return { components: [], nodesToRemove: new Set() };
  }

  const exportMap = getExportMapFromTree(tree);
  const nodesToRemove = new Set<MdxjsEsm>();

  visit(tree, 'mdxjsEsm', (node: MdxjsEsm) => {
    if (exportedNames.some((name) => node.value?.includes(name))) {
      nodesToRemove.add(node);
    }
  });

  const components = exportedNames
    .filter((name) => exportMap[name])
    .map((name) => ({
      name,
      code: exportMap[name],
      usedHooks: detectHooksInCode(exportMap[name]),
    }));

  return { components, nodesToRemove };
}

function processCompoundNode(node: JsxNode, ctx: CompoundContext) {
  if (!node.name || !COMPOUND_COMPONENTS.has(node.name)) return;
  if (!node.position?.start?.offset || !node.position?.end?.offset) {
    getLogger()?.warn(`Skipping ${node.name}: missing position info`);
    return;
  }

  const count = (ctx.counters.get(node.name) || 0) + 1;
  ctx.counters.set(node.name, count);
  const wrapperName = `${node.name}_${count}`;

  ctx.compounds.push({
    wrapperName,
    mdxSource: ctx.mdxContent.slice(
      node.position.start.offset,
      node.position.end.offset,
    ),
  });

  ctx.nodeReplacements.set(node, wrapperName);
  return SKIP;
}

function findCompoundComponents(
  tree: Root,
  mdxContent: string,
): {
  compounds: ExtractedCompoundComponent[];
  nodeReplacements: Map<JsxNode, string>;
} {
  const ctx: CompoundContext = {
    compounds: [],
    nodeReplacements: new Map(),
    counters: new Map(),
    mdxContent,
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
        'utf-8',
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
    outputFormat: 'program',
    development: false,
    providerImportSource: MDX_COMPONENTS_PATH,
  });

  const compiledStr = String(compiled)
    .replace(
      /export default function MDXContent/g,
      `export function ${wrapperName}`,
    )
    .replace(/export \{ MDXContent as default \};?/g, '');

  return compiledStr;
}

async function writeCompoundComponentFiles(
  compounds: ExtractedCompoundComponent[],
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
        'utf-8',
      );
    }),
  );
}

function getInsertIndex(tree: Root, skipEsm = false): number {
  const skipTypes = skipEsm ? ['yaml', 'mdxjsEsm'] : ['yaml'];
  const index = tree.children.findIndex((c) => !skipTypes.includes(c.type));
  return index === -1 ? tree.children.length : index;
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
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement',
  wrapperName: string,
): JsxNode {
  return {
    type,
    name: wrapperName,
    attributes: [createMdxJsxAttribute('client:load', null)],
    children: [],
  } as JsxNode;
}

function transformTreeWithCompounds(
  tree: Root,
  compounds: ExtractedCompoundComponent[],
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

function addClientDirectivesToUserComponents(
  tree: Root,
  userComponents: Set<string>,
): void {
  if (userComponents.size === 0) return;

  visitJsxNodes(tree, (node) => {
    if (node.name && userComponents.has(node.name)) {
      addClientDirective(node);
    }
  });
}

export async function extractReactComponents(
  mdxContent: string,
  mdxFilePath: string,
  componentsDir: string,
  pageSlug: string,
  userComponents: Set<string>,
): Promise<string> {
  const tree = getAST(mdxContent, mdxFilePath) as Root;

  const { components, nodesToRemove } = findExportedComponents(tree);
  const { compounds, nodeReplacements } = findCompoundComponents(
    tree,
    mdxContent,
  );

  if (
    components.length === 0 &&
    compounds.length === 0 &&
    userComponents.size === 0
  ) {
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

  addClientDirectivesToUserComponents(tree, userComponents);

  if (compounds.length > 0) {
    await writeCompoundComponentFiles(compounds, componentsDir, pageSlug);
    transformTreeWithCompounds(
      tree,
      compounds,
      nodeReplacements,
      relativeComponentsDir,
    );
  }

  return stringifyTree(tree);
}
