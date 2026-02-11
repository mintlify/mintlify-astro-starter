/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    code: "code",
    li: "li",
    ol: "ol",
    p: "p",
    ..._provideComponents(),
    ...props.components
  }, {Accordion, AccordionGroup} = _components;
  if (!Accordion) _missingMdxReference("Accordion", true);
  if (!AccordionGroup) _missingMdxReference("AccordionGroup", true);
  return <AccordionGroup><Accordion title="Error: Could not load the &quot;sharp&quot; module using the darwin-arm64 runtime"><_components.p>{"This may be due to an outdated version of node. Try the following:"}</_components.p><_components.ol>{"\n"}<_components.li>{"Remove the currently-installed version of the CLI: "}<_components.code>{"npm remove -g mint"}</_components.code></_components.li>{"\n"}<_components.li>{"Upgrade to Node v19 or higher."}</_components.li>{"\n"}<_components.li>{"Reinstall the CLI: "}<_components.code>{"npm i -g mint"}</_components.code></_components.li>{"\n"}</_components.ol></Accordion><Accordion title="Issue: Encountering an unknown error"><_components.p>{"Solution: Go to the root of your device and delete the "}<_components.code>{"~/.mintlify"}</_components.code>{" folder. Then run "}<_components.code>{"mint dev"}</_components.code>{" again."}</_components.p></Accordion></AccordionGroup>;
}
export function AccordionGroup_1(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
