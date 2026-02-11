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
  return <Expandable title="FooterSocials"><ResponseField name="[key]" type="string"><_components.p>{"One of the following values "}<_components.code>{"website"}</_components.code>{", "}<_components.code>{"facebook"}</_components.code>{", "}<_components.code>{"x"}</_components.code>{", "}<_components.code>{"discord"}</_components.code>{", "}<_components.code>{"slack"}</_components.code>{", "}<_components.code>{"github"}</_components.code>{", "}<_components.code>{"linkedin"}</_components.code>{", "}<_components.code>{"instagram"}</_components.code>{", "}<_components.code>{"hacker-news"}</_components.code></_components.p><_components.p>{"Example: "}<_components.code>{"x"}</_components.code></_components.p></ResponseField><ResponseField name="property" type="string"><_components.p>{"The URL to the social platform."}</_components.p><_components.p>{"Example: "}<_components.code>{"https://x.com/mintlify"}</_components.code></_components.p></ResponseField></Expandable>;
}
export function Expandable_10(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
