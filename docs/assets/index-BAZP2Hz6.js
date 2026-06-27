import{P as i,b as t,a as n,C as a}from"./main-BkMfnTe8.js";let l=`

import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';

datamark is a TypeScript library for turning Markdown documents into typed objects — and back again. It gives you a **declarative, generator-based format system** where you define how a document is consumed using combinators like \`heading(1)\`, \`splitByCombinator(heading(2))\`, and \`many(codeBlock())\`.

<Cards>
  <Card title="AST SDK" description="Parse documents, extract frontmatter, query the AST" href="/docs/core" />

  <Card title="Format SDK" description="Define bidirectional formats with datamark()" href="/docs/template" />

  <Card title="Examples" description="Real-world format definitions for common patterns" href="/docs/examples" />

  <Card title="Comparisons" description="How datamark compares to alternatives" href="/compare" />
</Cards>

Why datamark? [#why-datamark]

Markdown is the universal format for structured text, but parsing it into typed data usually means one of two things:

1. **Regex and string manipulation** — fragile, unreadable, unmaintainable.
2. **Abstract syntax trees** — powerful, but you still write imperative traversal code.

datamark gives you a third option: **declare the shape of your document and get the shape of your data**.

A format is a pair of generator functions. The \`parse\` generator consumes the AST using \`yield*\` combinators. The \`stringify\` generator emits nodes back into Markdown. Both share the same mental model.

<Callout type="info">
  **Bring your own validator.** datamark uses the Standard Schema v1 interface, so Zod, Valibot, ArkType, TypeBox, and any compliant library work out of the box.
</Callout>

A 10-second demo [#a-10-second-demo]

\`\`\`typescript
import { datamark, heading, inlineText } from "datamark";
import * as z from "zod";

const Plan = datamark({
  schema: z.object({ id: z.string(), title: z.string() }),
  *parse(doc) {
    const fm = yield* doc.frontmatter();
    const title = yield* doc.consume(heading(1));
    return { id: (fm as any)?.id ?? "", title: inlineText(title.children) };
  },
  *stringify(doc, data) {
    yield* doc.emitFrontmatter({ id: data.id });
    yield* heading(1, data.title);
  },
});

const result = Plan.parse(\`---
id: plan-001
---
# Q3 Roadmap\`);
// { id: "plan-001", title: "Q3 Roadmap" }
\`\`\`

What datamark is NOT [#what-datamark-is-not]

<Callout type="warn">
  **It is not a static site generator.** It parses and transforms Markdown, but it does not build HTML pages or apply themes.
</Callout>

* **It is not a Markdown renderer.** It produces data, not HTML.
* **It does not stream.** Input string in, typed object out.
* **It is not a general-purpose parser generator.** It is specifically designed for Markdown documents.

Who is it for? [#who-is-it-for]

<Cards>
  <Card title="CLI & Script Developers" description="Parse READMEs, changelogs, plan files, and API docs into structured data for automation, validation, and CI." />

  <Card title="Application Developers" description="Embed typed Markdown parsing into your app for user-generated content, configuration files, and documentation formats." />
</Cards>

Quick navigation [#quick-navigation]

| Goal                        | Section                                         |
| --------------------------- | ----------------------------------------------- |
| New here?                   | [Quickstart](/docs/quickstart)                  |
| Understand the architecture | [Format SDK](/docs/explanation/template-system) |
| Look up a function          | [AST SDK](/docs/core)                           |
| See real formats            | [Examples](/docs/examples)                      |
| Compare to alternatives     | [Comparisons](/compare)                         |
`,h={title:"What is datamark?",description:"A TypeScript library for parsing Markdown into typed objects and serializing them back using declarative generator-based formats."},o={contents:[{heading:void 0,content:"datamark is a TypeScript library for turning Markdown documents into typed objects — and back again. It gives you a **declarative, generator-based format system** where you define how a document is consumed using combinators like `heading(1)`, `splitByCombinator(heading(2))`, and `many(codeBlock())`."},{heading:void 0,content:'<Card title="AST SDK" description="Parse documents, extract frontmatter, query the AST" href="/docs/core" />'},{heading:void 0,content:'<Card title="Format SDK" description="Define bidirectional formats with datamark()" href="/docs/template" />'},{heading:void 0,content:'<Card title="Examples" description="Real-world format definitions for common patterns" href="/docs/examples" />'},{heading:void 0,content:'<Card title="Comparisons" description="How datamark compares to alternatives" href="/compare" />'},{heading:"why-datamark",content:"Markdown is the universal format for structured text, but parsing it into typed data usually means one of two things:"},{heading:"why-datamark",content:"**Regex and string manipulation** — fragile, unreadable, unmaintainable."},{heading:"why-datamark",content:"**Abstract syntax trees** — powerful, but you still write imperative traversal code."},{heading:"why-datamark",content:"datamark gives you a third option: **declare the shape of your document and get the shape of your data**."},{heading:"why-datamark",content:"A format is a pair of generator functions. The `parse` generator consumes the AST using `yield*` combinators. The `stringify` generator emits nodes back into Markdown. Both share the same mental model."},{heading:"why-datamark",content:"**Bring your own validator.** datamark uses the Standard Schema v1 interface, so Zod, Valibot, ArkType, TypeBox, and any compliant library work out of the box."},{heading:"what-datamark-is-not",content:"**It is not a static site generator.** It parses and transforms Markdown, but it does not build HTML pages or apply themes."},{heading:"what-datamark-is-not",content:"**It is not a Markdown renderer.** It produces data, not HTML."},{heading:"what-datamark-is-not",content:"**It does not stream.** Input string in, typed object out."},{heading:"what-datamark-is-not",content:"**It is not a general-purpose parser generator.** It is specifically designed for Markdown documents."},{heading:"who-is-it-for",content:'<Card title="CLI & Script Developers" description="Parse READMEs, changelogs, plan files, and API docs into structured data for automation, validation, and CI." />'},{heading:"who-is-it-for",content:'<Card title="Application Developers" description="Embed typed Markdown parsing into your app for user-generated content, configuration files, and documentation formats." />'},{heading:"quick-navigation",content:"Goal"},{heading:"quick-navigation",content:"Section"},{heading:"quick-navigation",content:"New here?"},{heading:"quick-navigation",content:"Quickstart"},{heading:"quick-navigation",content:"Understand the architecture"},{heading:"quick-navigation",content:"Format SDK"},{heading:"quick-navigation",content:"Look up a function"},{heading:"quick-navigation",content:"AST SDK"},{heading:"quick-navigation",content:"See real formats"},{heading:"quick-navigation",content:"Examples"},{heading:"quick-navigation",content:"Compare to alternatives"},{heading:"quick-navigation",content:"Comparisons"}],headings:[{id:"why-datamark",content:"Why datamark?"},{id:"a-10-second-demo",content:"A 10-second demo"},{id:"what-datamark-is-not",content:"What datamark is NOT"},{id:"who-is-it-for",content:"Who is it for?"},{id:"quick-navigation",content:"Quick navigation"}]};const c=[{depth:2,url:"#why-datamark",title:i.jsx(i.Fragment,{children:"Why datamark?"})},{depth:2,url:"#a-10-second-demo",title:i.jsx(i.Fragment,{children:"A 10-second demo"})},{depth:2,url:"#what-datamark-is-not",title:i.jsx(i.Fragment,{children:"What datamark is NOT"})},{depth:2,url:"#who-is-it-for",title:i.jsx(i.Fragment,{children:"Who is it for?"})},{depth:2,url:"#quick-navigation",title:i.jsx(i.Fragment,{children:"Quick navigation"})}];function r(s){const e={a:"a",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...s.components};return i.jsxs(i.Fragment,{children:[i.jsxs(e.p,{children:["datamark is a TypeScript library for turning Markdown documents into typed objects — and back again. It gives you a ",i.jsx(e.strong,{children:"declarative, generator-based format system"})," where you define how a document is consumed using combinators like ",i.jsx(e.code,{children:"heading(1)"}),", ",i.jsx(e.code,{children:"splitByCombinator(heading(2))"}),", and ",i.jsx(e.code,{children:"many(codeBlock())"}),"."]}),`
`,i.jsxs(t,{children:[i.jsx(n,{title:"AST SDK",description:"Parse documents, extract frontmatter, query the AST",href:"/docs/core"}),i.jsx(n,{title:"Format SDK",description:"Define bidirectional formats with datamark()",href:"/docs/template"}),i.jsx(n,{title:"Examples",description:"Real-world format definitions for common patterns",href:"/docs/examples"}),i.jsx(n,{title:"Comparisons",description:"How datamark compares to alternatives",href:"/compare"})]}),`
`,i.jsx(e.h2,{id:"why-datamark",children:"Why datamark?"}),`
`,i.jsx(e.p,{children:"Markdown is the universal format for structured text, but parsing it into typed data usually means one of two things:"}),`
`,i.jsxs(e.ol,{children:[`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"Regex and string manipulation"})," — fragile, unreadable, unmaintainable."]}),`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"Abstract syntax trees"})," — powerful, but you still write imperative traversal code."]}),`
`]}),`
`,i.jsxs(e.p,{children:["datamark gives you a third option: ",i.jsx(e.strong,{children:"declare the shape of your document and get the shape of your data"}),"."]}),`
`,i.jsxs(e.p,{children:["A format is a pair of generator functions. The ",i.jsx(e.code,{children:"parse"})," generator consumes the AST using ",i.jsx(e.code,{children:"yield*"})," combinators. The ",i.jsx(e.code,{children:"stringify"})," generator emits nodes back into Markdown. Both share the same mental model."]}),`
`,i.jsx(a,{type:"info",children:i.jsxs(e.p,{children:[i.jsx(e.strong,{children:"Bring your own validator."})," datamark uses the Standard Schema v1 interface, so Zod, Valibot, ArkType, TypeBox, and any compliant library work out of the box."]})}),`
`,i.jsx(e.h2,{id:"a-10-second-demo",children:"A 10-second demo"}),`
`,i.jsx(i.Fragment,{children:i.jsx(e.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(e.code,{children:[i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { datamark, heading, inlineText } "}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark"'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" *"}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" as"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" z "}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "zod"'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(e.span,{className:"line"}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" Plan"}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" datamark"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  schema: z."}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"object"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({ id: z."}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(), title: z."}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"() }),"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"  *"}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"doc"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") {"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    const"}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" fm"}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" yield*"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" doc."}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"frontmatter"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"();"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    const"}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" title"}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" yield*"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" doc."}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"consume"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"heading"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"1"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"));"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    return"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { id: (fm "}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"as"}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" any"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:")?.id "}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"??"}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' ""'}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", title: "}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"inlineText"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(title.children) };"})]}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  },"})}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"  *"}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"stringify"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"doc"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", "}),i.jsx(e.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"data"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") {"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    yield*"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" doc."}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"emitFrontmatter"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({ id: data.id });"})]}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    yield*"}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" heading"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"1"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", data.title);"})]}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  },"})}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"});"})}),`
`,i.jsx(e.span,{className:"line"}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(e.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" result"}),i.jsx(e.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" Plan."}),i.jsx(e.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`---"})]}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"id: plan-001"})}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,i.jsxs(e.span,{className:"line",children:[i.jsx(e.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"# Q3 Roadmap`"}),i.jsx(e.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]}),`
`,i.jsx(e.span,{className:"line",children:i.jsx(e.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// { id: "plan-001", title: "Q3 Roadmap" }'})})]})})}),`
`,i.jsx(e.h2,{id:"what-datamark-is-not",children:"What datamark is NOT"}),`
`,i.jsx(a,{type:"warn",children:i.jsxs(e.p,{children:[i.jsx(e.strong,{children:"It is not a static site generator."})," It parses and transforms Markdown, but it does not build HTML pages or apply themes."]})}),`
`,i.jsxs(e.ul,{children:[`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"It is not a Markdown renderer."})," It produces data, not HTML."]}),`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"It does not stream."})," Input string in, typed object out."]}),`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"It is not a general-purpose parser generator."})," It is specifically designed for Markdown documents."]}),`
`]}),`
`,i.jsx(e.h2,{id:"who-is-it-for",children:"Who is it for?"}),`
`,i.jsxs(t,{children:[i.jsx(n,{title:"CLI & Script Developers",description:"Parse READMEs, changelogs, plan files, and API docs into structured data for automation, validation, and CI."}),i.jsx(n,{title:"Application Developers",description:"Embed typed Markdown parsing into your app for user-generated content, configuration files, and documentation formats."})]}),`
`,i.jsx(e.h2,{id:"quick-navigation",children:"Quick navigation"}),`
`,i.jsxs(e.table,{children:[i.jsx(e.thead,{children:i.jsxs(e.tr,{children:[i.jsx(e.th,{children:"Goal"}),i.jsx(e.th,{children:"Section"})]})}),i.jsxs(e.tbody,{children:[i.jsxs(e.tr,{children:[i.jsx(e.td,{children:"New here?"}),i.jsx(e.td,{children:i.jsx(e.a,{href:"/docs/quickstart",children:"Quickstart"})})]}),i.jsxs(e.tr,{children:[i.jsx(e.td,{children:"Understand the architecture"}),i.jsx(e.td,{children:i.jsx(e.a,{href:"/docs/explanation/template-system",children:"Format SDK"})})]}),i.jsxs(e.tr,{children:[i.jsx(e.td,{children:"Look up a function"}),i.jsx(e.td,{children:i.jsx(e.a,{href:"/docs/core",children:"AST SDK"})})]}),i.jsxs(e.tr,{children:[i.jsx(e.td,{children:"See real formats"}),i.jsx(e.td,{children:i.jsx(e.a,{href:"/docs/examples",children:"Examples"})})]}),i.jsxs(e.tr,{children:[i.jsx(e.td,{children:"Compare to alternatives"}),i.jsx(e.td,{children:i.jsx(e.a,{href:"/compare",children:"Comparisons"})})]})]})]})]})}function k(s={}){const{wrapper:e}=s.components||{};return e?i.jsx(e,{...s,children:i.jsx(r,{...s})}):r(s)}export{l as _markdown,k as default,h as frontmatter,o as structuredData,c as toc};
