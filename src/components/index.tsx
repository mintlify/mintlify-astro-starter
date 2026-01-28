import type { ReactNode } from "react";
import {
  Callout,
  Check,
  Columns,
  Frame,
  Icon,
  Info,
  Note,
  Tip,
  Warning,
} from "@mintlify/components";

interface StubProps {
  children?: ReactNode;
  [key: string]: unknown; // any other props that Mintlify components might receive (e.g., title, icon, href)
}

const stub = (name: string) => {
  return ({ children }: StubProps) => (
    <div
      style={{
        border: "1px dashed #ccc",
        padding: "0.5rem",
        margin: "0.5rem 0",
      }}
    >
      <small style={{ color: "#888" }}>[{name}]</small>
      {children}
    </div>
  );
};

const Tabs = stub("Tabs");
const Tab = stub("Tab");
const Steps = stub("Steps");
const Step = stub("Step");
const Accordion = stub("Accordion");
const AccordionGroup = stub("AccordionGroup");
const CodeGroup = stub("CodeGroup");
const Expandable = stub("Expandable");
const Tooltip = stub("Tooltip");
const Card = stub("Card");
const CardGroup = stub("CardGroup");
const Column = stub("Column");
const Snippet = stub("Snippet");
const ResponseField = stub("ResponseField");
const ParamField = stub("ParamField");
const Latex = stub("Latex");

export const components = {
  // Static components
  Callout,
  Check,
  Columns,
  Frame,
  Icon,
  Info,
  Note,
  Tip,
  Warning,
  // Stubs
  Accordion,
  AccordionGroup,
  Card,
  CardGroup,
  CodeGroup,
  Column,
  Expandable,
  Latex,
  ParamField,
  ResponseField,
  Snippet,
  Step,
  Steps,
  Tab,
  Tabs,
  Tooltip,
};
