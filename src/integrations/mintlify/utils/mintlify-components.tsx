import type { ReactNode } from "react";
import * as Mintlify from "@mintlify/components";
import type { MDXComponents } from "mdx/types";

const Wrapper = ({ children }: { children?: ReactNode }) => (
  <div>{children}</div>
);

const MintlifyComponents = {
  Accordion: Mintlify.Accordion,
  Badge: Mintlify.Badge,
  Callout: Mintlify.Callout,
  Card: Mintlify.Card,
  Check: Mintlify.Check,
  CodeBlock: Mintlify.CodeBlock,
  CodeGroup: Mintlify.CodeGroup,
  Color: Mintlify.Color,
  Columns: Mintlify.Columns,
  Danger: Mintlify.Danger,
  Expandable: Mintlify.Expandable,
  Frame: Mintlify.Frame,
  Icon: Mintlify.Icon,
  Info: Mintlify.Info,
  Mermaid: Mintlify.Mermaid,
  Note: Mintlify.Note,
  Panel: Mintlify.Panel,
  Property: Mintlify.Property,
  Steps: Mintlify.Steps,
  Tabs: Mintlify.Tabs,
  Tile: Mintlify.Tile,
  Tip: Mintlify.Tip,
  Tooltip: Mintlify.Tooltip,
  Tree: Mintlify.Tree,
  Update: Mintlify.Update,
  Warning: Mintlify.Warning,
};

const placeholderComponents: Record<string, typeof Wrapper> = {
  AccordionGroup: Wrapper,
  ApiPlayground: Wrapper,
  CardGroup: Wrapper,
  Column: Wrapper,
  CustomCode: Wrapper,
  CustomComponent: Wrapper,
  DynamicCustomComponent: Wrapper,
  Heading: Wrapper,
  Latex: Wrapper,
  Link: Wrapper,
  Loom: Wrapper,
  MDXContentController: Wrapper,
  Param: Wrapper,
  ParamField: Wrapper,
  PreviewButton: Wrapper,
  RequestExample: Wrapper,
  ResponseExample: Wrapper,
  ResponseField: Wrapper,
  Snippet: Wrapper,
  SnippetGroup: Wrapper,
  View: Wrapper,
  Vimeo: Wrapper,
  YouTube: Wrapper,
  ZoomImage: Wrapper,
};

export const components = {
  ...MintlifyComponents,
  ...placeholderComponents,
};

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    Step: Mintlify.Steps.Item,
    Tab: Mintlify.Tabs.Item,
  };
}
