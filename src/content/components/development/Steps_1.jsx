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
  }, {Step, Steps} = _components;
  if (!Step) _missingMdxReference("Step", true);
  if (!Steps) _missingMdxReference("Steps", true);
  return <Steps><Step title="Install the Mintlify CLI"><_components.pre><_components.code className="language-bash">{"npm i -g mint\n"}</_components.code></_components.pre></Step><Step title="Preview locally"><_components.p>{"Navigate to your docs directory where your "}<_components.code>{"docs.json"}</_components.code>{" file is located, and run the following command:"}</_components.p><_components.pre><_components.code className="language-bash">{"mint dev\n"}</_components.code></_components.pre><_components.p>{"A local preview of your documentation will be available at "}<_components.code>{"http://localhost:3000"}</_components.code>{"."}</_components.p></Step></Steps>;
}
export function Steps_1(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
