import{P as i,D as l,B as e}from"./main-BMgR5NfB.js";let t=`

import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Callout } from 'fumadocs-ui/components/callout';

Parse your first Markdown document into a typed object in three steps. About 5 minutes.

<Steps>
  <Step>
    Install [#install]

    \`\`\`bash
    npm install datamark
    \`\`\`

    For validation, also install your schema library of choice:

    \`\`\`bash
    npm install zod
    \`\`\`
  </Step>

  <Step>
    Write your first format [#write-your-first-format]

    Create a file that describes how your Markdown is structured:

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
    console.log(result.steps[0].description); // "Set up the project."
    \`\`\`
  </Step>

  <Step>
    Parse a document [#parse-a-document]

    \`\`\`typescript
    import { PlanFormat } from "./plan-format";

    const markdown = \`---
    id: plan-001
    ---
    # Q3 Roadmap

    ## Set up project scaffolding

    Install dependencies.

    \\\`\\\`\\\`javascript
    npm init -y
    \\\`\\\`\\\`

    ## Implement core features

    Build the main functionality.
    \`;

    const result = PlanFormat.parse(markdown);
    console.log(result);
    // {
    //   id: "plan-001",
    //   title: "Q3 Roadmap",
    //   steps: [
    //     { title: "Set up project scaffolding", description: "Install dependencies.", scripts: ["npm init -y"] },
    //     { title: "Implement core features", description: "Build the main functionality.", scripts: [] },
    //   ],
    // }
    \`\`\`
  </Step>
</Steps>

What happened? [#what-happened]

1. \`parse\` turned the raw Markdown string into a typed AST with a section tree.
2. Your \`parse\` function traversed the AST using utility functions like \`findAll\`, \`textContent\`, and \`isCodeBlock\`.
3. The section tree made it easy to iterate over H2-delimited sections.
4. The final return value was validated against your Zod schema.

Where to go next [#where-to-go-next]

| Goal                          | Link                                           |
| ----------------------------- | ---------------------------------------------- |
| Understand how it works       | [The AST](/docs/explanation/ast)               |
| Learn about the format system | [Format SDK](/docs/template/datamark-function) |
| Look up core functions        | [Parse SDK](/docs/parse)                       |
| See more examples             | [Examples](/docs/examples)                     |
`,r={title:"Quickstart",description:"Get started with datamark in under 5 minutes. Parse your first Markdown document into a typed object."},d={contents:[{heading:void 0,content:"Parse your first Markdown document into a typed object in three steps. About 5 minutes."},{heading:"install",content:"For validation, also install your schema library of choice:"},{heading:"write-your-first-format",content:"Create a file that describes how your Markdown is structured:"},{heading:"what-happened",content:"`parse` turned the raw Markdown string into a typed AST with a section tree."},{heading:"what-happened",content:"Your `parse` function traversed the AST using utility functions like `findAll`, `textContent`, and `isCodeBlock`."},{heading:"what-happened",content:"The section tree made it easy to iterate over H2-delimited sections."},{heading:"what-happened",content:"The final return value was validated against your Zod schema."},{heading:"where-to-go-next",content:"Goal"},{heading:"where-to-go-next",content:"Link"},{heading:"where-to-go-next",content:"Understand how it works"},{heading:"where-to-go-next",content:"The AST"},{heading:"where-to-go-next",content:"Learn about the format system"},{heading:"where-to-go-next",content:"Format SDK"},{heading:"where-to-go-next",content:"Look up core functions"},{heading:"where-to-go-next",content:"Parse SDK"},{heading:"where-to-go-next",content:"See more examples"},{heading:"where-to-go-next",content:"Examples"}],headings:[{id:"install",content:"Install"},{id:"write-your-first-format",content:"Write your first format"},{id:"parse-a-document",content:"Parse a document"},{id:"what-happened",content:"What happened?"},{id:"where-to-go-next",content:"Where to go next"}]};const k=[{depth:3,url:"#install",title:i.jsx(i.Fragment,{children:"Install"})},{depth:3,url:"#write-your-first-format",title:i.jsx(i.Fragment,{children:"Write your first format"})},{depth:3,url:"#parse-a-document",title:i.jsx(i.Fragment,{children:"Parse a document"})},{depth:2,url:"#what-happened",title:i.jsx(i.Fragment,{children:"What happened?"})},{depth:2,url:"#where-to-go-next",title:i.jsx(i.Fragment,{children:"Where to go next"})}];function h(n){const s={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...n.components};return i.jsxs(i.Fragment,{children:[i.jsx(s.p,{children:"Parse your first Markdown document into a typed object in three steps. About 5 minutes."}),`
`,i.jsxs(l,{children:[i.jsxs(e,{children:[i.jsx(s.h3,{id:"install",children:"Install"}),i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',children:i.jsx(s.code,{children:i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"npm"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:" install"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:" datamark"})]})})})}),i.jsx(s.p,{children:"For validation, also install your schema library of choice:"}),i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',children:i.jsx(s.code,{children:i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"npm"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:" install"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:" zod"})]})})})})]}),i.jsxs(e,{children:[i.jsx(s.h3,{id:"write-your-first-format",children:"Write your first format"}),i.jsx(s.p,{children:"Create a file that describes how your Markdown is structured:"}),i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { datamark } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
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
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"Implement the core features.`"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]})]})})}),i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" result"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" PlanFormat."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(planMarkdown);"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"console."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"log"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(result.id);     "}),i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// "plan-001"'})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"console."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"log"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(result.title);  "}),i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// "Q3 Roadmap"'})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"console."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"log"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(result.steps["}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"0"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"].description); "}),i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// "Set up the project."'})]})]})})})]}),i.jsxs(e,{children:[i.jsx(s.h3,{id:"parse-a-document",children:"Parse a document"}),i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { PlanFormat } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "./plan-format"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" markdown"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:" `---"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"id: plan-001"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"# Q3 Roadmap"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"## Set up project scaffolding"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"Install dependencies."})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\`\\`\\`"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"javascript"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"npm init -y"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\`\\`\\`"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"## Implement core features"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"Build the main functionality."})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" result"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" PlanFormat."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(markdown);"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"console."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"log"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(result);"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// {"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'//   id: "plan-001",'})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'//   title: "Q3 Roadmap",'})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"//   steps: ["})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'//     { title: "Set up project scaffolding", description: "Install dependencies.", scripts: ["npm init -y"] },'})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'//     { title: "Implement core features", description: "Build the main functionality.", scripts: [] },'})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"//   ],"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// }"})})]})})})]})]}),`
`,i.jsx(s.h2,{id:"what-happened",children:"What happened?"}),`
`,i.jsxs(s.ol,{children:[`
`,i.jsxs(s.li,{children:[i.jsx(s.code,{children:"parse"})," turned the raw Markdown string into a typed AST with a section tree."]}),`
`,i.jsxs(s.li,{children:["Your ",i.jsx(s.code,{children:"parse"})," function traversed the AST using utility functions like ",i.jsx(s.code,{children:"findAll"}),", ",i.jsx(s.code,{children:"textContent"}),", and ",i.jsx(s.code,{children:"isCodeBlock"}),"."]}),`
`,i.jsx(s.li,{children:"The section tree made it easy to iterate over H2-delimited sections."}),`
`,i.jsx(s.li,{children:"The final return value was validated against your Zod schema."}),`
`]}),`
`,i.jsx(s.h2,{id:"where-to-go-next",children:"Where to go next"}),`
`,i.jsxs(s.table,{children:[i.jsx(s.thead,{children:i.jsxs(s.tr,{children:[i.jsx(s.th,{children:"Goal"}),i.jsx(s.th,{children:"Link"})]})}),i.jsxs(s.tbody,{children:[i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Understand how it works"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/docs/explanation/ast",children:"The AST"})})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Learn about the format system"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/docs/template/datamark-function",children:"Format SDK"})})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Look up core functions"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/docs/parse",children:"Parse SDK"})})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"See more examples"}),i.jsx(s.td,{children:i.jsx(s.a,{href:"/docs/examples",children:"Examples"})})]})]})]})]})}function c(n={}){const{wrapper:s}=n.components||{};return s?i.jsx(s,{...n,children:i.jsx(h,{...n})}):h(n)}export{t as _markdown,c as default,r as frontmatter,d as structuredData,k as toc};
