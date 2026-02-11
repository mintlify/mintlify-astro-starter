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
  return <Expandable title="TopbarLink"><ResponseField name="name" type="string"><_components.p>{"The name of the button."}</_components.p><_components.p>{"Example: "}<_components.code>{"Contact us"}</_components.code></_components.p></ResponseField><ResponseField name="url" type="string"><_components.p>{"The url once you click on the button. Example: "}<_components.code>{"https://mintlify.com/docs"}</_components.code></_components.p></ResponseField></Expandable>;
}
export function Expandable_4(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
