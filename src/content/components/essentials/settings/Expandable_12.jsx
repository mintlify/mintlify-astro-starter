/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    code: "code",
    p: "p",
    pre: "pre",
    ..._provideComponents(),
    ...props.components
  }, {CodeGroup, Expandable, ResponseField} = _components;
  if (!CodeGroup) _missingMdxReference("CodeGroup", true);
  if (!Expandable) _missingMdxReference("Expandable", true);
  if (!ResponseField) _missingMdxReference("ResponseField", true);
  return <Expandable title="ModeToggle"><ResponseField name="default" type={'"light" or "dark"'}><_components.p>{"Set if you always want to show light or dark mode for new users. When not\nset, we default to the same mode as the user's operating system."}</_components.p></ResponseField><ResponseField name="isHidden" type="boolean" default="false"><_components.p>{"Set to true to hide the dark/light mode toggle. You can combine "}<_components.code>{"isHidden"}</_components.code>{" with "}<_components.code>{"default"}</_components.code>{" to force your docs to only use light or dark mode. For example:"}</_components.p><CodeGroup><_components.pre><_components.code className="language-json">{"\"modeToggle\": {\n  \"default\": \"dark\",\n  \"isHidden\": true\n}\n"}</_components.code></_components.pre><_components.pre><_components.code className="language-json">{"\"modeToggle\": {\n  \"default\": \"light\",\n  \"isHidden\": true\n}\n"}</_components.code></_components.pre></CodeGroup></ResponseField></Expandable>;
}
export function Expandable_12(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
