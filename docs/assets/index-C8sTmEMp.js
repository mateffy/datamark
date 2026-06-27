import{P as e,b as s,a as i}from"./main-BMgR5NfB.js";let d=`

import { Card, Cards } from 'fumadocs-ui/components/card';

Deep dives into datamark's architecture, design decisions, and internals. These pages explain why things work the way they do — useful when you want to understand the system beyond just using it.

<Cards>
  <Card title="The AST" description="Typed tree structure: Document, SectionNode, BlockNode, InlineNode, and how the section tree is built" href="/docs/explanation/ast" />

  <Card title="Validation" description="Standard Schema v1 support, how validation integrates with the parse pipeline, and supported validators" href="/docs/explanation/validation" />
</Cards>

Design principles [#design-principles]

* **Zero bundled dependencies** — You bring your own validator (Zod, Valibot, etc.). No lock-in.
* **Unified node type** — \`Node\` is the base for everything. Sections, blocks, and inlines share the same traversal API.
* **Native section tree** — Headings are section boundaries in the AST, not just block nodes. This makes document navigation natural.
* **Type inference from schemas** — Both \`frontmatterSchema\` and \`schema\` infer their output types via the Standard Schema interface. No manual type annotations needed.
* **Validation before execution** — Frontmatter is validated before \`parse()\` runs. Output is validated after. Your functions never see invalid data.
`,r={title:"Explanation"},c={contents:[{heading:void 0,content:"Deep dives into datamark's architecture, design decisions, and internals. These pages explain why things work the way they do — useful when you want to understand the system beyond just using it."},{heading:void 0,content:'<Card title="The AST" description="Typed tree structure: Document, SectionNode, BlockNode, InlineNode, and how the section tree is built" href="/docs/explanation/ast" />'},{heading:void 0,content:'<Card title="Validation" description="Standard Schema v1 support, how validation integrates with the parse pipeline, and supported validators" href="/docs/explanation/validation" />'},{heading:"design-principles",content:"**Zero bundled dependencies** — You bring your own validator (Zod, Valibot, etc.). No lock-in."},{heading:"design-principles",content:"**Unified node type** — `Node` is the base for everything. Sections, blocks, and inlines share the same traversal API."},{heading:"design-principles",content:"**Native section tree** — Headings are section boundaries in the AST, not just block nodes. This makes document navigation natural."},{heading:"design-principles",content:"**Type inference from schemas** — Both `frontmatterSchema` and `schema` infer their output types via the Standard Schema interface. No manual type annotations needed."},{heading:"design-principles",content:"**Validation before execution** — Frontmatter is validated before `parse()` runs. Output is validated after. Your functions never see invalid data."}],headings:[{id:"design-principles",content:"Design principles"}]};const l=[{depth:2,url:"#design-principles",title:e.jsx(e.Fragment,{children:"Design principles"})}];function a(t){const n={code:"code",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"Deep dives into datamark's architecture, design decisions, and internals. These pages explain why things work the way they do — useful when you want to understand the system beyond just using it."}),`
`,e.jsxs(s,{children:[e.jsx(i,{title:"The AST",description:"Typed tree structure: Document, SectionNode, BlockNode, InlineNode, and how the section tree is built",href:"/docs/explanation/ast"}),e.jsx(i,{title:"Validation",description:"Standard Schema v1 support, how validation integrates with the parse pipeline, and supported validators",href:"/docs/explanation/validation"})]}),`
`,e.jsx(n.h2,{id:"design-principles",children:"Design principles"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Zero bundled dependencies"})," — You bring your own validator (Zod, Valibot, etc.). No lock-in."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Unified node type"})," — ",e.jsx(n.code,{children:"Node"})," is the base for everything. Sections, blocks, and inlines share the same traversal API."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Native section tree"})," — Headings are section boundaries in the AST, not just block nodes. This makes document navigation natural."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Type inference from schemas"})," — Both ",e.jsx(n.code,{children:"frontmatterSchema"})," and ",e.jsx(n.code,{children:"schema"})," infer their output types via the Standard Schema interface. No manual type annotations needed."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Validation before execution"})," — Frontmatter is validated before ",e.jsx(n.code,{children:"parse()"})," runs. Output is validated after. Your functions never see invalid data."]}),`
`]})]})}function h(t={}){const{wrapper:n}=t.components||{};return n?e.jsx(n,{...t,children:e.jsx(a,{...t})}):a(t)}export{d as _markdown,h as default,r as frontmatter,c as structuredData,l as toc};
