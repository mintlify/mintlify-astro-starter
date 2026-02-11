/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    p: "p",
    ..._provideComponents(),
    ...props.components
  }, {Expandable, ResponseField} = _components;
  if (!Expandable) _missingMdxReference("Expandable", true);
  if (!ResponseField) _missingMdxReference("ResponseField", true);
  return <Expandable title="Object"><ResponseField name="name" default="Documentation" type="string"><_components.p>{"The name of the top-most anchor"}</_components.p></ResponseField><ResponseField name="icon" default="book-open" type="string"><_components.p>{"Font Awesome icon."}</_components.p></ResponseField><ResponseField name="iconType" default="duotone" type="string"><_components.p>{"One of: \"brands\", \"duotone\", \"light\", \"sharp-solid\", \"solid\", or \"thin\""}</_components.p></ResponseField></Expandable>;
}
export function Expandable_7(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
