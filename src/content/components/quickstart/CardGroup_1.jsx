/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    p: "p",
    ..._provideComponents(),
    ...props.components
  }, {Card, CardGroup} = _components;
  if (!Card) _missingMdxReference("Card", true);
  if (!CardGroup) _missingMdxReference("CardGroup", true);
  return <CardGroup cols={2}><Card title="Write Content" icon="pen-to-square" href="/essentials/markdown"><_components.p>{"Learn MDX syntax and start writing your documentation."}</_components.p></Card><Card title="Customize style" icon="palette" href="/essentials/settings"><_components.p>{"Make your docs match your brand perfectly."}</_components.p></Card><Card title="Add code examples" icon="square-code" href="/essentials/code"><_components.p>{"Include syntax-highlighted code blocks."}</_components.p></Card><Card title="API documentation" icon="code" href="/api-reference/introduction"><_components.p>{"Auto-generate API docs from OpenAPI specs."}</_components.p></Card></CardGroup>;
}
export function CardGroup_1(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
