/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    li: "li",
    ol: "ol",
    ..._provideComponents(),
    ...props.components
  }, {Accordion} = _components;
  if (!Accordion) _missingMdxReference("Accordion", true);
  return <Accordion icon="rocket" title="Publish your docs"><_components.ol>{"\n"}<_components.li>{"Commit and push your changes. 2. Your docs will update and be live in\nmoments!"}</_components.li>{"\n"}</_components.ol></Accordion>;
}
export function Accordion_1(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
