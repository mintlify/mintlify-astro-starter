/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    code: "code",
    pre: "pre",
    ..._provideComponents(),
    ...props.components
  }, {CodeGroup} = _components;
  if (!CodeGroup) _missingMdxReference("CodeGroup", true);
  return <CodeGroup><_components.pre><_components.code className="language-json">{"\"navigation\": {\n  \"tabs\": [\n    {\n      \"tab\": \"Docs\",\n      \"groups\": [\n        {\n          \"group\": \"Getting Started\",\n          \"pages\": [\"quickstart\"]\n        }\n      ]\n    }\n  ]\n}\n"}</_components.code></_components.pre><_components.pre><_components.code className="language-json">{"\"navigation\": {\n  \"tabs\": [\n    {\n      \"tab\": \"Docs\",\n      \"groups\": [\n        {\n          \"group\": \"Getting Started\",\n          \"pages\": [\n            \"quickstart\",\n            {\n              \"group\": \"Nested Reference Pages\",\n              \"pages\": [\"nested-reference-page\"]\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}\n"}</_components.code></_components.pre></CodeGroup>;
}
export function CodeGroup_1(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
