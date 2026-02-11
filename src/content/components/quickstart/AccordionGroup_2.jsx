/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    li: "li",
    ol: "ol",
    p: "p",
    ..._provideComponents(),
    ...props.components
  }, {Accordion, AccordionGroup, Tip} = _components;
  if (!Accordion) _missingMdxReference("Accordion", true);
  if (!AccordionGroup) _missingMdxReference("AccordionGroup", true);
  if (!Tip) _missingMdxReference("Tip", true);
  return <AccordionGroup><Accordion icon="github" title="Install our GitHub app"><_components.p>{"Install the Mintlify GitHub app from your "}<_components.a href="https://dashboard.mintlify.com/settings/organization/github-app">{"dashboard"}</_components.a>{"."}</_components.p><_components.p>{"Our GitHub app automatically deploys your changes to your docs site, so you don't need to manage deployments yourself."}</_components.p></Accordion><Accordion icon="palette" title="Update your site name and colors"><_components.p>{"For a first change, let's update the name and colors of your docs site."}</_components.p><_components.ol>{"\n"}<_components.li>{"Open "}<_components.code>{"docs.json"}</_components.code>{" in your editor."}</_components.li>{"\n"}<_components.li>{"Change the "}<_components.code>{"\"name\""}</_components.code>{" field to your project name."}</_components.li>{"\n"}<_components.li>{"Update the "}<_components.code>{"\"colors\""}</_components.code>{" to match your brand."}</_components.li>{"\n"}<_components.li>{"Save and see your changes instantly at "}<_components.code>{"http://localhost:3000"}</_components.code>{"."}</_components.li>{"\n"}</_components.ol><Tip>{"Try changing the primary color to see an immediate difference!"}</Tip></Accordion></AccordionGroup>;
}
export function AccordionGroup_2(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
