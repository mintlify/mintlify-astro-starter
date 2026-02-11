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
  }, {Expandable, ResponseField, Warning} = _components;
  if (!Expandable) _missingMdxReference("Expandable", true);
  if (!ResponseField) _missingMdxReference("ResponseField", true);
  if (!Warning) _missingMdxReference("Warning", true);
  return <Expandable title="API"><ResponseField name="baseUrl" type="string"><_components.p>{"The base url for all API endpoints. If "}<_components.code>{"baseUrl"}</_components.code>{" is an array, it will enable for multiple base url\noptions that the user can toggle."}</_components.p></ResponseField><ResponseField name="auth" type="Auth"><Expandable title="Auth"><ResponseField name="method" type="&quot;bearer&quot; | &quot;basic&quot; | &quot;key&quot;"><_components.p>{"The authentication strategy used for all API endpoints."}</_components.p></ResponseField><ResponseField name="name" type="string"><_components.p>{"The name of the authentication parameter used in the API playground."}</_components.p><_components.p>{"If method is "}<_components.code>{"basic"}</_components.code>{", the format should be "}<_components.code>{"[usernameName]:[passwordName]"}</_components.code></_components.p></ResponseField><ResponseField name="inputPrefix" type="string"><_components.p>{"The default value that's designed to be a prefix for the authentication input field."}</_components.p><_components.p>{"E.g. If an "}<_components.code>{"inputPrefix"}</_components.code>{" of "}<_components.code>{"AuthKey"}</_components.code>{" would inherit the default input result of the authentication field as "}<_components.code>{"AuthKey"}</_components.code>{"."}</_components.p></ResponseField></Expandable></ResponseField><ResponseField name="playground" type="Playground"><_components.p>{"Configurations for the API playground"}</_components.p><Expandable title="Playground"><ResponseField name="mode" default="show" type="&quot;show&quot; | &quot;simple&quot; | &quot;hide&quot;"><_components.p>{"Whether the playground is showing, hidden, or only displaying the endpoint with no added user interactivity "}<_components.code>{"simple"}</_components.code></_components.p><_components.p>{"Learn more at the "}<_components.a href="/api-playground/demo">{"playground guides"}</_components.a></_components.p></ResponseField></Expandable></ResponseField><ResponseField name="maintainOrder" type="boolean"><_components.p>{"Enabling this flag ensures that key ordering in OpenAPI pages matches the key ordering defined in the OpenAPI file."}</_components.p><Warning>{"This behavior will soon be enabled by default, at which point this field will be deprecated."}</Warning></ResponseField></Expandable>;
}
export function Expandable_9(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
