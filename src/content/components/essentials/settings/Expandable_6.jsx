/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    p: "p",
    ..._provideComponents(),
    ...props.components
  }, {Expandable, ResponseField} = _components;
  if (!Expandable) _missingMdxReference("Expandable", true);
  if (!ResponseField) _missingMdxReference("ResponseField", true);
  return <Expandable title="Anchor"><ResponseField name="icon" type="string"><_components.p>{"The "}<_components.a href="https://fontawesome.com/search?q=heart">{"Font Awesome"}</_components.a>{" icon used to feature the anchor."}</_components.p><_components.p>{"Example: "}<_components.code>{"comments"}</_components.code></_components.p></ResponseField><ResponseField name="name" type="string"><_components.p>{"The name of the anchor label."}</_components.p><_components.p>{"Example: "}<_components.code>{"Community"}</_components.code></_components.p></ResponseField><ResponseField name="url" type="string"><_components.p>{"The start of the URL that marks what pages go in the anchor. Generally, this is the name of the folder you put your pages in."}</_components.p></ResponseField><ResponseField name="color" type="string"><_components.p>{"The hex color of the anchor icon background. Can also be a gradient if you pass an object with the properties "}<_components.code>{"from"}</_components.code>{" and "}<_components.code>{"to"}</_components.code>{" that are each a hex color."}</_components.p></ResponseField><ResponseField name="version" type="string"><_components.p>{"Used if you want to hide an anchor until the correct docs version is selected."}</_components.p></ResponseField><ResponseField name="isDefaultHidden" type="boolean" default="false"><_components.p>{"Pass "}<_components.code>{"true"}</_components.code>{" if you want to hide the anchor until you directly link someone to docs inside it."}</_components.p></ResponseField><ResponseField name="iconType" default="duotone" type="string"><_components.p>{"One of: \"brands\", \"duotone\", \"light\", \"sharp-solid\", \"solid\", or \"thin\""}</_components.p></ResponseField></Expandable>;
}
export function Expandable_6(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
