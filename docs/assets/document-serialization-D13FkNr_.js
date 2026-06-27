import{P as i,C as e}from"./main-BMgR5NfB.js";let l=`

import { Callout } from 'fumadocs-ui/components/callout';

The Stringify SDK provides two ways to turn AST data back into Markdown: \`stringify()\` for full documents, and \`toMarkdown()\` for individual nodes.

stringify(doc) [#stringifydoc]

Serializes a complete \`Document\` back to a Markdown string.

\`\`\`typescript
import { parse, stringify } from "datamark";

const doc = parse(\`
---
title: Hello
---

# Hello World

This is the first paragraph.

## Section

More content here.
\`);

const output = stringify(doc);
// ---
// title: Hello
// ---
//
// # Hello World
//
// This is the first paragraph.
//
// ## Section
//
// More content here.
\`\`\`

<Callout type="info">
  \`stringify()\` flattens the section tree before serializing. The result is a clean Markdown string with frontmatter when present.
</Callout>

toMarkdown(node) [#tomarkdownnode]

Serializes a single AST node to Markdown. Useful when you need to output a subset of the tree.

\`\`\`typescript
import { toMarkdown } from "datamark/stringify";

const headingNode = { type: "heading", depth: 2, children: [{ type: "text", value: "Title" }] };
toMarkdown(headingNode); // "## Title"
\`\`\`

\`toMarkdown\` accepts a single \`Node\` or an array of \`BlockNode[]\` and returns the corresponding Markdown string.

Round-trip [#round-trip]

Parse and stringify are reversible for most Markdown:

\`\`\`typescript
import { parse, stringify } from "datamark";

const input = "# Title\\n\\nBody text";
const doc = parse(input);
const output = stringify(doc);

console.log(output); // "# Title\\n\\nBody text\\n"
\`\`\`

<Callout type="warning">
  Positions may shift slightly on roundtrip because \`toMarkdown\` re-serializes from the AST rather than preserving the original raw text. Whitespace and exact indentation are normalized.
</Callout>

stringifyYaml(data) [#stringifyyamldata]

For cases where you need YAML output without a full frontmatter fence, \`stringifyYaml\` produces clean YAML from a JavaScript object:

\`\`\`typescript
import { stringifyYaml } from "datamark/stringify";

stringifyYaml({ title: "Hello", tags: ["a", "b"] })
// "title: Hello\\ntags:\\n  - a\\n  - b\\n"
\`\`\`

This is the same function used internally by \`frontmatter()\`.

Building documents from scratch [#building-documents-from-scratch]

When you need full control over output, combine builder primitives with \`stringify()\`:

\`\`\`typescript
import { parse } from "datamark";
import { heading, paragraph, list } from "datamark/stringify";

function buildReport(data: { title: string; items: string[] }) {
  const markdown = [
    heading(data.title, 2),
    paragraph(\`Generated on \${new Date().toISOString()}\`),
    list(data.items),
  ].join("\\n\\n");

  // If you need a Document object, parse it back
  return parse(markdown);
}
\`\`\`

For format definitions, this is usually handled inside the \`stringify\` function passed to \`datamark()\`.
`,h={title:"Document Serialization",description:"Serialize AST nodes and full Documents back to Markdown."},r={contents:[{heading:void 0,content:"The Stringify SDK provides two ways to turn AST data back into Markdown: `stringify()` for full documents, and `toMarkdown()` for individual nodes."},{heading:"stringifydoc",content:"Serializes a complete `Document` back to a Markdown string."},{heading:"stringifydoc",content:"`stringify()` flattens the section tree before serializing. The result is a clean Markdown string with frontmatter when present."},{heading:"tomarkdownnode",content:"Serializes a single AST node to Markdown. Useful when you need to output a subset of the tree."},{heading:"tomarkdownnode",content:"`toMarkdown` accepts a single `Node` or an array of `BlockNode[]` and returns the corresponding Markdown string."},{heading:"round-trip",content:"Parse and stringify are reversible for most Markdown:"},{heading:"round-trip",content:"Positions may shift slightly on roundtrip because `toMarkdown` re-serializes from the AST rather than preserving the original raw text. Whitespace and exact indentation are normalized."},{heading:"stringifyyamldata",content:"For cases where you need YAML output without a full frontmatter fence, `stringifyYaml` produces clean YAML from a JavaScript object:"},{heading:"stringifyyamldata",content:"This is the same function used internally by `frontmatter()`."},{heading:"building-documents-from-scratch",content:"When you need full control over output, combine builder primitives with `stringify()`:"},{heading:"building-documents-from-scratch",content:"For format definitions, this is usually handled inside the `stringify` function passed to `datamark()`."}],headings:[{id:"stringifydoc",content:"`stringify(doc)`"},{id:"tomarkdownnode",content:"`toMarkdown(node)`"},{id:"round-trip",content:"Round-trip"},{id:"stringifyyamldata",content:"`stringifyYaml(data)`"},{id:"building-documents-from-scratch",content:"Building documents from scratch"}]};const d=[{depth:2,url:"#stringifydoc",title:i.jsx(i.Fragment,{children:i.jsx("code",{children:"stringify(doc)"})})},{depth:2,url:"#tomarkdownnode",title:i.jsx(i.Fragment,{children:i.jsx("code",{children:"toMarkdown(node)"})})},{depth:2,url:"#round-trip",title:i.jsx(i.Fragment,{children:"Round-trip"})},{depth:2,url:"#stringifyyamldata",title:i.jsx(i.Fragment,{children:i.jsx("code",{children:"stringifyYaml(data)"})})},{depth:2,url:"#building-documents-from-scratch",title:i.jsx(i.Fragment,{children:"Building documents from scratch"})}];function t(n){const s={code:"code",h2:"h2",p:"p",pre:"pre",span:"span",...n.components};return i.jsxs(i.Fragment,{children:[i.jsxs(s.p,{children:["The Stringify SDK provides two ways to turn AST data back into Markdown: ",i.jsx(s.code,{children:"stringify()"})," for full documents, and ",i.jsx(s.code,{children:"toMarkdown()"})," for individual nodes."]}),`
`,i.jsx(s.h2,{id:"stringifydoc",children:i.jsx(s.code,{children:"stringify(doc)"})}),`
`,i.jsxs(s.p,{children:["Serializes a complete ",i.jsx(s.code,{children:"Document"})," back to a Markdown string."]}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { parse, stringify } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" doc"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"title: Hello"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"# Hello World"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"This is the first paragraph."})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"## Section"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"More content here."})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" output"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" stringify"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(doc);"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// ---"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// title: Hello"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// ---"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"//"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// # Hello World"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"//"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// This is the first paragraph."})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"//"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// ## Section"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"//"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// More content here."})})]})})}),`
`,i.jsx(e,{type:"info",children:i.jsxs(s.p,{children:[i.jsx(s.code,{children:"stringify()"})," flattens the section tree before serializing. The result is a clean Markdown string with frontmatter when present."]})}),`
`,i.jsx(s.h2,{id:"tomarkdownnode",children:i.jsx(s.code,{children:"toMarkdown(node)"})}),`
`,i.jsx(s.p,{children:"Serializes a single AST node to Markdown. Useful when you need to output a subset of the tree."}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { toMarkdown } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/stringify"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" headingNode"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { type: "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"heading"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", depth: "}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"2"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", children: [{ type: "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"text"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", value: "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"Title"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" }] };"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"toMarkdown"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(headingNode); "}),i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// "## Title"'})]})]})})}),`
`,i.jsxs(s.p,{children:[i.jsx(s.code,{children:"toMarkdown"})," accepts a single ",i.jsx(s.code,{children:"Node"})," or an array of ",i.jsx(s.code,{children:"BlockNode[]"})," and returns the corresponding Markdown string."]}),`
`,i.jsx(s.h2,{id:"round-trip",children:"Round-trip"}),`
`,i.jsx(s.p,{children:"Parse and stringify are reversible for most Markdown:"}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { parse, stringify } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" input"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "# Title'}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\n\\n"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'Body text"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" doc"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(input);"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" output"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" stringify"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(doc);"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"console."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"log"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(output); "}),i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// "# Title\\n\\nBody text\\n"'})]})]})})}),`
`,i.jsx(e,{type:"warning",children:i.jsxs(s.p,{children:["Positions may shift slightly on roundtrip because ",i.jsx(s.code,{children:"toMarkdown"})," re-serializes from the AST rather than preserving the original raw text. Whitespace and exact indentation are normalized."]})}),`
`,i.jsx(s.h2,{id:"stringifyyamldata",children:i.jsx(s.code,{children:"stringifyYaml(data)"})}),`
`,i.jsxs(s.p,{children:["For cases where you need YAML output without a full frontmatter fence, ",i.jsx(s.code,{children:"stringifyYaml"})," produces clean YAML from a JavaScript object:"]}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { stringifyYaml } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/stringify"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"stringifyYaml"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({ title: "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"Hello"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", tags: ["}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"a"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"b"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"] })"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// "title: Hello\\ntags:\\n  - a\\n  - b\\n"'})})]})})}),`
`,i.jsxs(s.p,{children:["This is the same function used internally by ",i.jsx(s.code,{children:"frontmatter()"}),"."]}),`
`,i.jsx(s.h2,{id:"building-documents-from-scratch",children:"Building documents from scratch"}),`
`,i.jsxs(s.p,{children:["When you need full control over output, combine builder primitives with ",i.jsx(s.code,{children:"stringify()"}),":"]}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { parse } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { heading, paragraph, list } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/stringify"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"function"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" buildReport"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"data"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { "}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"title"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"; "}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"items"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"[] }) {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"  const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" markdown"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" ["})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"    heading"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(data.title, "}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"2"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"),"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"    paragraph"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`Generated on ${"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"new"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" Date"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"()."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"toISOString"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"()"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"}`"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"),"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"    list"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(data.items),"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  ]."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"join"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"'}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\n\\n"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"  // If you need a Document object, parse it back"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"  return"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(markdown);"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"}"})})]})})}),`
`,i.jsxs(s.p,{children:["For format definitions, this is usually handled inside the ",i.jsx(s.code,{children:"stringify"})," function passed to ",i.jsx(s.code,{children:"datamark()"}),"."]})]})}function c(n={}){const{wrapper:s}=n.components||{};return s?i.jsx(s,{...n,children:i.jsx(t,{...n})}):t(n)}export{l as _markdown,c as default,h as frontmatter,r as structuredData,d as toc};
