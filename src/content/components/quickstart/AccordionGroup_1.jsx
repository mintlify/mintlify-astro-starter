/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import {useMDXComponents as _provideComponents} from "@mintlify/astro/components";
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    li: "li",
    ol: "ol",
    p: "p",
    ..._provideComponents(),
    ...props.components
  }, {Accordion, AccordionGroup, Tip} = _components;
  if (!Accordion) _missingMdxReference("Accordion", true);
  if (!AccordionGroup) _missingMdxReference("AccordionGroup", true);
  if (!Tip) _missingMdxReference("Tip", true);
  return <AccordionGroup><Accordion icon="copy" title="Clone your docs locally"><_components.p>{"During the onboarding process, you created a GitHub repository with your\ndocs content if you didn't already have one. You can find a link to this\nrepository in your "}<_components.a href="https://dashboard.mintlify.com">{"dashboard"}</_components.a>{". To clone the\nrepository locally so that you can make and preview changes to your docs,\nfollow the "}<_components.a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository">{"Cloning a\nrepository"}</_components.a>{"\nguide in the GitHub docs."}</_components.p></Accordion><Accordion icon="rectangle-terminal" title="Start the preview server"><_components.ol>{"\n"}<_components.li>{"Install the Mintlify CLI: "}<_components.code>{"npm i -g mint"}</_components.code>{" 2. Navigate to your docs\ndirectory and run: "}<_components.code>{"mint dev"}</_components.code>{" 3. Open "}<_components.code>{"http://localhost:3000"}</_components.code>{" to see your\ndocs live!\n"}<Tip>{"Your preview updates automatically as you edit files."}</Tip></_components.li>{"\n"}</_components.ol></Accordion></AccordionGroup>;
}
export function AccordionGroup_1(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
