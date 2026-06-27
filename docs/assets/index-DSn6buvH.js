import{P as i,b as r,a as n}from"./main-BMgR5NfB.js";let d=`

import { Card, Cards } from 'fumadocs-ui/components/card';

The Stringify SDK turns typed data and AST nodes back into Markdown strings. It is the inverse of the [Parse SDK](/docs/parse): where \`parse()\` consumes Markdown, the Stringify SDK produces it.

Use it directly when you need to build Markdown output from structured data, or as the serialization layer inside a [Format SDK](/docs/template) format definition.

<Cards>
  <Card title="Builder Primitives" description="heading(), list(), codeBlock(), frontmatter(), strong(), link(), and more" href="/docs/stringify/builders" />

  <Card title="Document Serialization" description="stringify(), toMarkdown(), and round-trip guarantees" href="/docs/stringify/document-serialization" />
</Cards>

What the Stringify SDK provides [#what-the-stringify-sdk-provides]

| Capability                 | Functions                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Block builders**         | \`frontmatter()\`, \`heading()\`, \`paragraph()\`, \`codeBlock()\`, \`list()\`, \`blockquote()\`, \`horizontalRule()\` |
| **Inline builders**        | \`strong()\`, \`em()\`, \`codeSpan()\`, \`link()\`, \`image()\`, \`strikethrough()\`                                 |
| **Document serialization** | \`stringify()\`, \`toMarkdown()\`                                                                            |
| **YAML helpers**           | \`stringifyYaml()\`                                                                                        |

Two ways to use it [#two-ways-to-use-it]

1. Builder primitives [#1-builder-primitives]

Compose Markdown strings from data without raw string concatenation:

\`\`\`typescript
import { frontmatter, heading, paragraph, list, codeBlock } from "datamark/stringify";

const markdown = [
  frontmatter({ title: "API Guide" }),
  heading("Authentication", 2),
  paragraph("Use Bearer tokens for all requests."),
  codeBlock("fetch('/api', { headers: { Authorization: 'Bearer ...' } });", "javascript"),
].join("\\n\\n");
\`\`\`

2. Document serialization [#2-document-serialization]

Serialize a full \`Document\` AST back to Markdown:

\`\`\`typescript
import { stringify } from "datamark";

const output = stringify(doc);
// Clean Markdown with frontmatter, headings, and all content restored
\`\`\`

How the layers fit together [#how-the-layers-fit-together]

\`\`\`
    Parse SDK      →  parse(), findAll(), textContent(), isCodeBlock() …
        ↑
   Format SDK      →  datamark({ schema, parse, stringify, examples })
        ↑
    Stringify SDK  →  heading(), list(), codeBlock(), frontmatter() …
\`\`\`

The Format SDK sits between the two: it uses the Parse SDK to turn Markdown into data, and the Stringify SDK to turn data back into Markdown.

When to use the Stringify SDK directly [#when-to-use-the-stringify-sdk-directly]

* You need to generate Markdown output from structured data
* You want type-safe builder functions instead of template strings
* You need to serialize individual AST nodes, not full documents
* You're building custom tooling that produces Markdown

For round-trip format definitions with validation, the [Format SDK](/docs/template) is the better starting point.
`,h={title:"Stringify SDK"},o={contents:[{heading:void 0,content:"The Stringify SDK turns typed data and AST nodes back into Markdown strings. It is the inverse of the Parse SDK: where `parse()` consumes Markdown, the Stringify SDK produces it."},{heading:void 0,content:"Use it directly when you need to build Markdown output from structured data, or as the serialization layer inside a Format SDK format definition."},{heading:void 0,content:'<Card title="Builder Primitives" description="heading(), list(), codeBlock(), frontmatter(), strong(), link(), and more" href="/docs/stringify/builders" />'},{heading:void 0,content:'<Card title="Document Serialization" description="stringify(), toMarkdown(), and round-trip guarantees" href="/docs/stringify/document-serialization" />'},{heading:"what-the-stringify-sdk-provides",content:"Capability"},{heading:"what-the-stringify-sdk-provides",content:"Functions"},{heading:"what-the-stringify-sdk-provides",content:"**Block builders**"},{heading:"what-the-stringify-sdk-provides",content:"`frontmatter()`, `heading()`, `paragraph()`, `codeBlock()`, `list()`, `blockquote()`, `horizontalRule()`"},{heading:"what-the-stringify-sdk-provides",content:"**Inline builders**"},{heading:"what-the-stringify-sdk-provides",content:"`strong()`, `em()`, `codeSpan()`, `link()`, `image()`, `strikethrough()`"},{heading:"what-the-stringify-sdk-provides",content:"**Document serialization**"},{heading:"what-the-stringify-sdk-provides",content:"`stringify()`, `toMarkdown()`"},{heading:"what-the-stringify-sdk-provides",content:"**YAML helpers**"},{heading:"what-the-stringify-sdk-provides",content:"`stringifyYaml()`"},{heading:"1-builder-primitives",content:"Compose Markdown strings from data without raw string concatenation:"},{heading:"2-document-serialization",content:"Serialize a full `Document` AST back to Markdown:"},{heading:"how-the-layers-fit-together",content:"The Format SDK sits between the two: it uses the Parse SDK to turn Markdown into data, and the Stringify SDK to turn data back into Markdown."},{heading:"when-to-use-the-stringify-sdk-directly",content:"You need to generate Markdown output from structured data"},{heading:"when-to-use-the-stringify-sdk-directly",content:"You want type-safe builder functions instead of template strings"},{heading:"when-to-use-the-stringify-sdk-directly",content:"You need to serialize individual AST nodes, not full documents"},{heading:"when-to-use-the-stringify-sdk-directly",content:"You're building custom tooling that produces Markdown"},{heading:"when-to-use-the-stringify-sdk-directly",content:"For round-trip format definitions with validation, the Format SDK is the better starting point."}],headings:[{id:"what-the-stringify-sdk-provides",content:"What the Stringify SDK provides"},{id:"two-ways-to-use-it",content:"Two ways to use it"},{id:"1-builder-primitives",content:"1\\. Builder primitives"},{id:"2-document-serialization",content:"2\\. Document serialization"},{id:"how-the-layers-fit-together",content:"How the layers fit together"},{id:"when-to-use-the-stringify-sdk-directly",content:"When to use the Stringify SDK directly"}]};const l=[{depth:2,url:"#what-the-stringify-sdk-provides",title:i.jsx(i.Fragment,{children:"What the Stringify SDK provides"})},{depth:2,url:"#two-ways-to-use-it",title:i.jsx(i.Fragment,{children:"Two ways to use it"})},{depth:3,url:"#1-builder-primitives",title:i.jsx(i.Fragment,{children:"1. Builder primitives"})},{depth:3,url:"#2-document-serialization",title:i.jsx(i.Fragment,{children:"2. Document serialization"})},{depth:2,url:"#how-the-layers-fit-together",title:i.jsx(i.Fragment,{children:"How the layers fit together"})},{depth:2,url:"#when-to-use-the-stringify-sdk-directly",title:i.jsx(i.Fragment,{children:"When to use the Stringify SDK directly"})}];function s(t){const e={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...t.components};return i.jsxs(i.Fragment,{children:[i.jsxs(e.p,{children:["The Stringify SDK turns typed data and AST nodes back into Markdown strings. It is the inverse of the ",i.jsx(e.a,{href:"/docs/parse",children:"Parse SDK"}),": where ",i.jsx(e.code,{children:"parse()"})," consumes Markdown, the Stringify SDK produces it."]}),`
`,i.jsxs(e.p,{children:["Use it directly when you need to build Markdown output from structured data, or as the serialization layer inside a ",i.jsx(e.a,{href:"/docs/template",children:"Format SDK"})," format definition."]}),`
`,i.jsxs(r,{children:[i.jsx(n,{title:"Builder Primitives",description:"heading(), list(), codeBlock(), frontmatter(), strong(), link(), and more",href:"/docs/stringify/builders"}),i.jsx(n,{title:"Document Serialization",description:"stringify(), toMarkdown(), and round-trip guarantees",href:"/docs/stringify/document-serialization"})]}),`
`,i.jsx(e.h2,{id:"what-the-stringify-sdk-provides",children:"What the Stringify SDK provides"}),`
`,i.jsxs(e.table,{children:[i.jsx(e.thead,{children:i.jsxs(e.tr,{children:[i.jsx(e.th,{children:"Capability"}),i.jsx(e.th,{children:"Functions"})]})}),i.jsxs(e.tbody,{children:[i.jsxs(e.tr,{children:[i.jsx(e.td,{children:i.jsx(e.strong,{children:"Block builders"})}),i.jsxs(e.td,{children:[i.jsx(e.code,{children:"frontmatter()"}),", ",i.jsx(e.code,{children:"heading()"}),", ",i.jsx(e.code,{children:"paragraph()"}),", ",i.jsx(e.code,{children:"codeBlock()"}),", ",i.jsx(e.code,{children:"list()"}),", ",i.jsx(e.code,{children:"blockquote()"}),", ",i.jsx(e.code,{children:"horizontalRule()"})]})]}),i.jsxs(e.tr,{children:[i.jsx(e.td,{children:i.jsx(e.strong,{children:"Inline builders"})}),i.jsxs(e.td,{children:[i.jsx(e.code,{children:"strong()"}),", ",i.jsx(e.code,{children:"em()"}),", ",i.jsx(e.code,{children:"codeSpan()"}),", ",i.jsx(e.code,{children:"link()"}),", ",i.jsx(e.code,{children:"image()"}),", ",i.jsx(e.code,{children:"strikethrough()"})]})]}),i.jsxs(e.tr,{children:[i.jsx(e.td,{children:i.jsx(e.strong,{children:"Document serialization"})}),i.jsxs(e.td,{children:[i.jsx(e.code,{children:"stringify()"}),", ",i.jsx(e.code,{children:"toMarkdown()"})]})]}),i.jsxs(e.tr,{children:[i.jsx(e.td,{children:i.jsx(e.strong,{children:"YAML helpers"})}),i.jsx(e.td,{children:i.jsx(e.code,{children:"stringifyYaml()"})})]})]})]}),`
`,i.jsx(e.h2,{id:"two-ways-to-use-it",children:"Two ways to use it"}),`
`,i.jsx(e.h3,{id:"1-builder-primitives",children:"1. Builder primitives"}),`
`,i.jsx(e.p,{children:"Compose Markdown strings from data without raw string concatenation:"}),`
`,i.jsx(i.Fragment,{children:i.jsx(e.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(e.code,{children:[i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { frontmatter, heading, paragraph, list, codeBlock } "}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/stringify"'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(e.span,{className:"line"}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" markdown"}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" ["})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"  frontmatter"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({ title: "}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"API Guide"'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" }),"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"  heading"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"Authentication"'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", "}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"2"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"),"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"  paragraph"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"Use Bearer tokens for all requests."'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"),"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"  codeBlock"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:`"fetch('/api', { headers: { Authorization: 'Bearer ...' } });"`}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", "}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"javascript"'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"),"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"]."}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"join"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"'}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\n\\n"}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]})]})})}),`
`,i.jsx(e.h3,{id:"2-document-serialization",children:"2. Document serialization"}),`
`,i.jsxs(e.p,{children:["Serialize a full ",i.jsx(e.code,{children:"Document"})," AST back to Markdown:"]}),`
`,i.jsx(i.Fragment,{children:i.jsx(e.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(e.code,{children:[i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { stringify } "}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark"'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(e.span,{className:"line"}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" output"}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" stringify"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(doc);"})]}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// Clean Markdown with frontmatter, headings, and all content restored"})})]})})}),`
`,i.jsx(e.h2,{id:"how-the-layers-fit-together",children:"How the layers fit together"}),`
`,i.jsx(i.Fragment,{children:i.jsx(e.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',children:i.jsxs(e.code,{children:[i.jsx(e.span,{className:"line",children:i.jsx(e.span,{children:"    Parse SDK      →  parse(), findAll(), textContent(), isCodeBlock() …"})}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{children:"        ↑"})}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{children:"   Format SDK      →  datamark({ schema, parse, stringify, examples })"})}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{children:"        ↑"})}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{children:"    Stringify SDK  →  heading(), list(), codeBlock(), frontmatter() …"})})]})})}),`
`,i.jsx(e.p,{children:"The Format SDK sits between the two: it uses the Parse SDK to turn Markdown into data, and the Stringify SDK to turn data back into Markdown."}),`
`,i.jsx(e.h2,{id:"when-to-use-the-stringify-sdk-directly",children:"When to use the Stringify SDK directly"}),`
`,i.jsxs(e.ul,{children:[`
`,i.jsx(e.li,{children:"You need to generate Markdown output from structured data"}),`
`,i.jsx(e.li,{children:"You want type-safe builder functions instead of template strings"}),`
`,i.jsx(e.li,{children:"You need to serialize individual AST nodes, not full documents"}),`
`,i.jsx(e.li,{children:"You're building custom tooling that produces Markdown"}),`
`]}),`
`,i.jsxs(e.p,{children:["For round-trip format definitions with validation, the ",i.jsx(e.a,{href:"/docs/template",children:"Format SDK"})," is the better starting point."]})]})}function c(t={}){const{wrapper:e}=t.components||{};return e?i.jsx(e,{...t,children:i.jsx(s,{...t})}):s(t)}export{d as _markdown,c as default,h as frontmatter,o as structuredData,l as toc};
