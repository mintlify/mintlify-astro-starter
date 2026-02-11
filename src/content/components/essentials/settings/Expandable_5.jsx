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
  return <Expandable title="Topbar Call to Action"><ResponseField name="type" type={'"link" or "github"'} default="link"><_components.p>{"Link shows a button. GitHub shows the repo information at the url provided including the number of GitHub stars."}</_components.p></ResponseField><ResponseField name="url" type="string"><_components.p>{"If "}<_components.code>{"link"}</_components.code>{": What the button links to."}</_components.p><_components.p>{"If "}<_components.code>{"github"}</_components.code>{": Link to the repository to load GitHub information from."}</_components.p></ResponseField><ResponseField name="name" type="string"><_components.p>{"Text inside the button. Only required if "}<_components.code>{"type"}</_components.code>{" is a "}<_components.code>{"link"}</_components.code>{"."}</_components.p></ResponseField></Expandable>;
}
export function Expandable_5(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
