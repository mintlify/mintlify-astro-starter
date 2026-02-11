/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    p: "p",
    ..._provideComponents(),
    ...props.components
  }, {Card} = _components;
  if (!Card) _missingMdxReference("Card", true);
  return <Card title="Write with MDX" icon="pen-fancy" href="/essentials/markdown"><_components.p>{"Use MDX to style your docs pages."}</_components.p></Card>;
}
export function Card_6(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
