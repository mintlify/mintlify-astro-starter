/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    code: "code",
    p: "p",
    ..._provideComponents(),
    ...props.components
  }, {Expandable, ResponseField} = _components;
  if (!Expandable) _missingMdxReference("Expandable", true);
  if (!ResponseField) _missingMdxReference("ResponseField", true);
  return <Expandable title="Navigation"><ResponseField name="group" type="string"><_components.p>{"The name of the group."}</_components.p><_components.p>{"Example: "}<_components.code>{"Settings"}</_components.code></_components.p></ResponseField><ResponseField name="pages" type="string[]"><_components.p>{"The relative paths to the markdown files that will serve as pages."}</_components.p><_components.p>{"Example: "}<_components.code>{"[\"customization\", \"page\"]"}</_components.code></_components.p></ResponseField></Expandable>;
}
export function Expandable_1(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
