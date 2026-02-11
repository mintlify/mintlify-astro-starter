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
  return <Expandable title="Logo"><ResponseField name="light" type="string"><_components.p>{"Path to the logo in light mode"}</_components.p></ResponseField><ResponseField name="dark" type="string"><_components.p>{"Path to the logo in dark mode"}</_components.p></ResponseField><ResponseField name="href" type="string" default="/"><_components.p>{"Where clicking on the logo links you to"}</_components.p></ResponseField></Expandable>;
}
export function Expandable_2(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
