import{P as i,b as a,a as e,C as t}from"./main-BMgR5NfB.js";let r=`

import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';

datamark is a TypeScript library for turning Markdown documents into typed objects — and back again. It gives you a **unified AST** with a native section tree, plus a lightweight **format system** for defining how documents map to your data structures.

<Cards>
  <Card title="Parse SDK" description="Parse documents, extract frontmatter, query the AST" href="/docs/parse" />

  <Card title="Stringify SDK" description="Serialize AST nodes and build Markdown with typed primitives" href="/docs/stringify" />

  <Card title="Format SDK" description="Define bidirectional formats with datamark()" href="/docs/template" />

  <Card title="Examples" description="Real-world format definitions for common patterns" href="/docs/examples" />
</Cards>

Why datamark? [#why-datamark]

Markdown is the universal format for structured text, but parsing it into typed data usually means one of two things:

1. **Regex and string manipulation** — fragile, unreadable, unmaintainable.
2. **Abstract syntax trees** — powerful, but you still write imperative traversal code.

datamark gives you a third option: **a unified AST with a native section tree** and **a lightweight format system** that makes common patterns trivial.

<Callout type="info">
  **Bring your own validator.** datamark uses the Standard Schema v1 interface, so Zod, Valibot, ArkType, TypeBox, and any compliant library work out of the box.
</Callout>

A 10-second demo [#a-10-second-demo]

\`\`\`typescript
import { datamark } from "datamark";
import { findAll, inlineText, textContent, isCodeBlock } from "datamark/parse";
import { frontmatter, heading, paragraph, codeBlock } from "datamark/stringify";
import * as z from "zod";

const PlanFrontmatterSchema = z.object({ id: z.string() });

const PlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(
    z.object({
      description: z.string(),
      scripts: z.array(z.string()),
    })
  ),
});

const PlanFormat = datamark({
  frontmatterSchema: PlanFrontmatterSchema,
  schema: PlanSchema,

  parse(doc) {
    const id = doc.frontmatter.id;
    const titleSection = doc.root.children.find((n) => n.type === "section") as any;
    const title = titleSection ? inlineText(titleSection.heading.children) : "";

    const steps = titleSection
      ? (titleSection.children.filter((n: any) => n.type === "section") as any[]).map(
          (section) => {
            const scripts = findAll(section, (n) => isCodeBlock(n, "javascript")).map(
              (n: any) => n.value
            );
            const description = textContent(section).trim();
            return { description, scripts };
          }
        )
      : [];

    return { id, title, steps };
  },

  stringify(data) {
    let md = frontmatter({ id: data.id }) + heading(data.title) + "\\n\\n";
    for (const step of data.steps) {
      md += heading("Step", 2) + "\\n\\n" + paragraph(step.description) + "\\n\\n";
      for (const script of step.scripts) {
        md += codeBlock(script, "javascript") + "\\n\\n";
      }
    }
    return md;
  },
});

const planMarkdown = \`---
id: plan-001
---
# Q3 Roadmap

## Step

Set up the project.

\\\`\\\`\\\`javascript
npm init -y
\\\`\\\`\\\`

## Step

Implement the core features.\`;
\`\`\`

\`\`\`typescript
const result = PlanFormat.parse(planMarkdown);
console.log(result.id);     // "plan-001"
console.log(result.title);  // "Q3 Roadmap"
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

| Goal                        | Section                          |
| --------------------------- | -------------------------------- |
| New here?                   | [Quickstart](/docs/quickstart)   |
| Understand the architecture | [The AST](/docs/explanation/ast) |
| Look up a function          | [Parse SDK](/docs/parse)         |
| See real formats            | [Examples](/docs/examples)       |
| Compare to alternatives     | [Comparisons](/compare)          |
`,d={title:"What is datamark?",description:"A TypeScript library for parsing Markdown into typed objects and serializing them back using declarative formats."},k={contents:[{heading:void 0,content:"datamark is a TypeScript library for turning Markdown documents into typed objects — and back again. It gives you a **unified AST** with a native section tree, plus a lightweight **format system** for defining how documents map to your data structures."},{heading:void 0,content:'<Card title="Parse SDK" description="Parse documents, extract frontmatter, query the AST" href="/docs/parse" />'},{heading:void 0,content:'<Card title="Stringify SDK" description="Serialize AST nodes and build Markdown with typed primitives" href="/docs/stringify" />'},{heading:void 0,content:'<Card title="Format SDK" description="Define bidirectional formats with datamark()" href="/docs/template" />'},{heading:void 0,content:'<Card title="Examples" description="Real-world format definitions for common patterns" href="/docs/examples" />'},{heading:"why-datamark",content:"Markdown is the universal format for structured text, but parsing it into typed data usually means one of two things:"},{heading:"why-datamark",content:"**Regex and string manipulation** — fragile, unreadable, unmaintainable."},{heading:"why-datamark",content:"**Abstract syntax trees** — powerful, but you still write imperative traversal code."},{heading:"why-datamark",content:"datamark gives you a third option: **a unified AST with a native section tree** and **a lightweight format system** that makes common patterns trivial."},{heading:"why-datamark",content:"**Bring your own validator.** datamark uses the Standard Schema v1 interface, so Zod, Valibot, ArkType, TypeBox, and any compliant library work out of the box."},{heading:"what-datamark-is-not",content:"**It is not a static site generator.** It parses and transforms Markdown, but it does not build HTML pages or apply themes."},{heading:"what-datamark-is-not",content:"**It is not a Markdown renderer.** It produces data, not HTML."},{heading:"what-datamark-is-not",content:"**It does not stream.** Input string in, typed object out."},{heading:"what-datamark-is-not",content:"**It is not a general-purpose parser generator.** It is specifically designed for Markdown documents."},{heading:"who-is-it-for",content:'<Card title="CLI & Script Developers" description="Parse READMEs, changelogs, plan files, and API docs into structured data for automation, validation, and CI." />'},{heading:"who-is-it-for",content:'<Card title="Application Developers" description="Embed typed Markdown parsing into your app for user-generated content, configuration files, and documentation formats." />'},{heading:"quick-navigation",content:"Goal"},{heading:"quick-navigation",content:"Section"},{heading:"quick-navigation",content:"New here?"},{heading:"quick-navigation",content:"Quickstart"},{heading:"quick-navigation",content:"Understand the architecture"},{heading:"quick-navigation",content:"The AST"},{heading:"quick-navigation",content:"Look up a function"},{heading:"quick-navigation",content:"Parse SDK"},{heading:"quick-navigation",content:"See real formats"},{heading:"quick-navigation",content:"Examples"},{heading:"quick-navigation",content:"Compare to alternatives"},{heading:"quick-navigation",content:"Comparisons"}],headings:[{id:"why-datamark",content:"Why datamark?"},{id:"a-10-second-demo",content:"A 10-second demo"},{id:"what-datamark-is-not",content:"What datamark is NOT"},{id:"who-is-it-for",content:"Who is it for?"},{id:"quick-navigation",content:"Quick navigation"}]};const c=[{depth:2,url:"#why-datamark",title:i.jsx(i.Fragment,{children:"Why datamark?"})},{depth:2,url:"#a-10-second-demo",title:i.jsx(i.Fragment,{children:"A 10-second demo"})},{depth:2,url:"#what-datamark-is-not",title:i.jsx(i.Fragment,{children:"What datamark is NOT"})},{depth:2,url:"#who-is-it-for",title:i.jsx(i.Fragment,{children:"Who is it for?"})},{depth:2,url:"#quick-navigation",title:i.jsx(i.Fragment,{children:"Quick navigation"})}];function h(n){const s={a:"a",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...n.components};return i.jsxs(i.Fragment,{children:[i.jsxs(s.p,{children:["datamark is a TypeScript library for turning Markdown documents into typed objects — and back again. It gives you a ",i.jsx(s.strong,{children:"unified AST"})," with a native section tree, plus a lightweight ",i.jsx(s.strong,{children:"format system"})," for defining how documents map to your data structures."]}),`
`,i.jsxs(a,{children:[i.jsx(e,{title:"Parse SDK",description:"Parse documents, extract frontmatter, query the AST",href:"/docs/parse"}),i.jsx(e,{title:"Stringify SDK",description:"Serialize AST nodes and build Markdown with typed primitives",href:"/docs/stringify"}),i.jsx(e,{title:"Format SDK",description:"Define bidirectional formats with datamark()",href:"/docs/template"}),i.jsx(e,{title:"Examples",description:"Real-world format definitions for common patterns",href:"/docs/examples"})]}),`
`,i.jsx(s.h2,{id:"why-datamark",children:"Why datamark?"}),`
`,i.jsx(s.p,{children:"Markdown is the universal format for structured text, but parsing it into typed data usually means one of two things:"}),`
`,i.jsxs(s.ol,{children:[`
`,i.jsxs(s.li,{children:[i.jsx(s.strong,{children:"Regex and string manipulation"})," — fragile, unreadable, unmaintainable."]}),`
`,i.jsxs(s.li,{children:[i.jsx(s.strong,{children:"Abstract syntax trees"})," — powerful, but you still write imperative traversal code."]}),`
`]}),`
`,i.jsxs(s.p,{children:["datamark gives you a third option: ",i.jsx(s.strong,{children:"a unified AST with a native section tree"})," and ",i.jsx(s.strong,{children:"a lightweight format system"})," that makes common patterns trivial."]}),`
`,i.jsx(t,{type:"info",children:i.jsxs(s.p,{children:[i.jsx(s.strong,{children:"Bring your own validator."})," datamark uses the Standard Schema v1 interface, so Zod, Valibot, ArkType, TypeBox, and any compliant library work out of the box."]})}),`
`,i.jsx(s.h2,{id:"a-10-second-demo",children:"A 10-second demo"}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { datamark } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { findAll, inlineText, textContent, isCodeBlock } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/parse"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { frontmatter, heading, paragraph, codeBlock } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/stringify"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" *"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" as"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" z "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "zod"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" PlanFrontmatterSchema"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"object"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({ id: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"() });"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" PlanSchema"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"object"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  id: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(),"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  title: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(),"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  steps: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"array"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"    z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"object"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"      description: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(),"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"      scripts: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"array"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"()),"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"    })"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  ),"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"});"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" PlanFormat"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" datamark"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  frontmatterSchema: PlanFrontmatterSchema,"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  schema: PlanSchema,"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"  parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"doc"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" id"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" doc.frontmatter.id;"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" titleSection"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" doc.root.children."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"find"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"n"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"=>"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" n.type "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"==="}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "section"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"as"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" any"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" title"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" titleSection "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"?"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" inlineText"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(titleSection.heading.children) "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' ""'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" steps"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" titleSection"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"      ?"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" (titleSection.children."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"filter"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"n"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" any"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"=>"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" n.type "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"==="}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "section"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"as"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" any"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"[])."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"map"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"          ("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"section"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"=>"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"            const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" scripts"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" findAll"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(section, ("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"n"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"=>"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" isCodeBlock"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(n, "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"javascript"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"))."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"map"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"              ("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"n"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" any"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"=>"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" n.value"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"            );"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"            const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" description"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" textContent"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(section)."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"trim"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"();"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"            return"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { description, scripts };"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"          }"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"        )"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"      :"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" [];"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    return"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { id, title, steps };"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  },"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"  stringify"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"data"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    let"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" md "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" frontmatter"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({ id: data.id }) "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"+"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" heading"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(data.title) "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"+"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "'}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\n\\n"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    for"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" ("}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" step"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" of"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" data.steps) {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"      md "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"+="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" heading"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"Step"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", "}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"2"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"+"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "'}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\n\\n"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"'}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" +"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" paragraph"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(step.description) "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"+"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "'}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\n\\n"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"      for"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" ("}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" script"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" of"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" step.scripts) {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"        md "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"+="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" codeBlock"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(script, "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"javascript"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"+"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "'}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\n\\n"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"      }"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"    }"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    return"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" md;"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  },"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"});"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" planMarkdown"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:" `---"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"id: plan-001"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"# Q3 Roadmap"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"## Step"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"Set up the project."})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\`\\`\\`"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"javascript"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"npm init -y"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\`\\`\\`"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"## Step"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"Implement the core features.`"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]})]})})}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" result"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" PlanFormat."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(planMarkdown);"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"console."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"log"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(result.id);     "}),i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// "plan-001"'})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"console."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"log"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(result.title);  "}),i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// "Q3 Roadmap"'})]})]})})}),`
`,i.jsx(s.h2,{id:"what-datamark-is-not",children:"What datamark is NOT"}),`
`,i.jsx(t,{type:"warn",children:i.jsxs(s.p,{children:[i.jsx(s.strong,{children:"It is not a static site generator."})," It parses and transforms Markdown, but it does not build HTML pages or apply themes."]})}),`
`,i.jsxs(s.ul,{children:[`
`,i.jsxs(s.li,{children:[i.jsx(s.strong,{children:"It is not a Markdown renderer."})," It produces data, not HTML."]}),`
`,i.jsxs(s.li,{children:[i.jsx(s.strong,{children:"It does not stream."})," Input string in, typed object out."]}),`
`,i.jsxs(s.li,{children:[i.jsx(s.strong,{children:"It is not a general-purpose parser generator."})," It is specifically designed for Markdown documents."]}),`
`]}),`
`,i.jsx(s.h2,{id:"who-is-it-for",children:"Who is it for?"}),`
`,i.jsxs(a,{children:[i.jsx(e,{title:"CLI & Script Developers",description:"Parse READMEs, changelogs, plan files, and API docs into structured data for automation, validation, and CI."}),i.jsx(e,{title:"Application Developers",description:"Embed typed Markdown parsing into your app for user-generated content, configuration files, and documentation formats."})]}),`
`,i.jsx(s.h2,{id:"quick-navigation",children:"Quick navigation"}),`
`,i.jsxs(s.table,{children:[i.jsx(s.thead,{children:i.jsxs(s.tr,{children:[i.jsx(s.th,{children:"Goal"}),i.jsx(s.th,{children:"Section"})]})}),i.jsxs(s.tbody,{children:[i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"New here?"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/docs/quickstart",children:"Quickstart"})})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Understand the architecture"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/docs/explanation/ast",children:"The AST"})})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Look up a function"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/docs/parse",children:"Parse SDK"})})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"See real formats"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/docs/examples",children:"Examples"})})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Compare to alternatives"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/compare",children:"Comparisons"})})]})]})]})]})}function o(n={}){const{wrapper:s}=n.components||{};return s?i.jsx(s,{...n,children:i.jsx(h,{...n})}):h(n)}export{r as _markdown,o as default,d as frontmatter,k as structuredData,c as toc};
