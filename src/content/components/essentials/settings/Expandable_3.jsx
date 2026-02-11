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
  return <Expandable title="Colors"><ResponseField name="primary" type="string" required><_components.p>{"The primary color. Used for most often for highlighted content, section\nheaders, accents, in light mode"}</_components.p></ResponseField><ResponseField name="light" type="string"><_components.p>{"The primary color for dark mode. Used for most often for highlighted\ncontent, section headers, accents, in dark mode"}</_components.p></ResponseField><ResponseField name="dark" type="string"><_components.p>{"The primary color for important buttons"}</_components.p></ResponseField><ResponseField name="background" type="object"><_components.p>{"The color of the background in both light and dark mode"}</_components.p><Expandable title="Object"><ResponseField name="light" type="string" required><_components.p>{"The hex color code of the background in light mode"}</_components.p></ResponseField><ResponseField name="dark" type="string" required><_components.p>{"The hex color code of the background in dark mode"}</_components.p></ResponseField></Expandable></ResponseField></Expandable>;
}
export function Expandable_3(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
