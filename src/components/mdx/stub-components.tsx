import type { ReactNode } from "react";

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

export const Card = stub("Card");
export const CardGroup = stub("CardGroup");
export const Tabs = stub("Tabs");
export const Tab = stub("Tab");
export const CodeGroup = stub("CodeGroup");
export const Accordion = stub("Accordion");
export const AccordionGroup = stub("AccordionGroup");
export const Callout = stub("Callout");
export const Note = stub("Note");
export const Warning = stub("Warning");
export const Info = stub("Info");
export const Tip = stub("Tip");
export const Check = stub("Check");
export const Steps = stub("Steps");
export const Step = stub("Step");
export const Frame = stub("Frame");
export const Icon = stub("Icon");
export const Snippet = stub("Snippet");
export const ResponseField = stub("ResponseField");
export const ParamField = stub("ParamField");
export const Expandable = stub("Expandable");
export const Latex = stub("Latex");
export const Columns = stub("Columns");
export const Column = stub("Column");

export const stubComponents = {
  Card,
  CardGroup,
  Tabs,
  Tab,
  CodeGroup,
  Accordion,
  AccordionGroup,
  Callout,
  Note,
  Warning,
  Info,
  Tip,
  Check,
  Steps,
  Step,
  Frame,
  Icon,
  Snippet,
  ResponseField,
  ParamField,
  Expandable,
  Latex,
  Columns,
  Column,
};
