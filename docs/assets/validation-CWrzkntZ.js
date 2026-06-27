import{P as i,C as n}from"./main-BkMfnTe8.js";let r=`

import { Callout } from 'fumadocs-ui/components/callout';

datamark does not bundle a validator. Instead, it implements the **Standard Schema v1** interface, a cross-library specification that Zod, Valibot, ArkType, TypeBox, and others support.

Standard Schema v1 [#standard-schema-v1]

Any object with a \`~standard\` property implementing the spec can be passed as a schema:

\`\`\`typescript
import * as z from "zod";
import { datamark } from "datamark";

const MyFormat = datamark({
  schema: z.object({ name: z.string(), age: z.number() }),
  *parse(doc) {
    // ...
    return { name: "Ada", age: 30 };
  },
});

const result = MyFormat.parse(markdown);
// result is typed as { name: string; age: number }
\`\`\`

Validation in the parse pipeline [#validation-in-the-parse-pipeline]

When a schema is provided, \`parse()\` validates the generator's return value automatically. If validation fails, it throws \`ValidationError\` with structured issue data:

\`\`\`typescript
try {
  MyFormat.parse(badMarkdown);
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.issues);
    // [{ message: "Expected string, received number", path: ["age"] }]
  }
}
\`\`\`

<Callout type="warn">
  Asynchronous schema validation is not supported. Use synchronous validators like Zod or Valibot.
</Callout>

Supported validators [#supported-validators]

| Library | Status                   |
| ------- | ------------------------ |
| Zod     | ✅ Supported              |
| Valibot | ✅ Supported              |
| ArkType | ✅ Supported              |
| TypeBox | ✅ Supported              |
| Yup     | ❌ Not Standard Schema v1 |
| Joi     | ❌ Not Standard Schema v1 |
`,d={title:"Validation",description:"Standard Schema v1 support, validation errors, and typed frontmatter."},h={contents:[{heading:void 0,content:"datamark does not bundle a validator. Instead, it implements the **Standard Schema v1** interface, a cross-library specification that Zod, Valibot, ArkType, TypeBox, and others support."},{heading:"standard-schema-v1",content:"Any object with a `~standard` property implementing the spec can be passed as a schema:"},{heading:"validation-in-the-parse-pipeline",content:"When a schema is provided, `parse()` validates the generator's return value automatically. If validation fails, it throws `ValidationError` with structured issue data:"},{heading:"validation-in-the-parse-pipeline",content:"Asynchronous schema validation is not supported. Use synchronous validators like Zod or Valibot."},{heading:"supported-validators",content:"Library"},{heading:"supported-validators",content:"Status"},{heading:"supported-validators",content:"Zod"},{heading:"supported-validators",content:"✅ Supported"},{heading:"supported-validators",content:"Valibot"},{heading:"supported-validators",content:"✅ Supported"},{heading:"supported-validators",content:"ArkType"},{heading:"supported-validators",content:"✅ Supported"},{heading:"supported-validators",content:"TypeBox"},{heading:"supported-validators",content:"✅ Supported"},{heading:"supported-validators",content:"Yup"},{heading:"supported-validators",content:"❌ Not Standard Schema v1"},{heading:"supported-validators",content:"Joi"},{heading:"supported-validators",content:"❌ Not Standard Schema v1"}],headings:[{id:"standard-schema-v1",content:"Standard Schema v1"},{id:"validation-in-the-parse-pipeline",content:"Validation in the parse pipeline"},{id:"supported-validators",content:"Supported validators"}]};const l=[{depth:2,url:"#standard-schema-v1",title:i.jsx(i.Fragment,{children:"Standard Schema v1"})},{depth:2,url:"#validation-in-the-parse-pipeline",title:i.jsx(i.Fragment,{children:"Validation in the parse pipeline"})},{depth:2,url:"#supported-validators",title:i.jsx(i.Fragment,{children:"Supported validators"})}];function a(e){const s={code:"code",h2:"h2",p:"p",pre:"pre",span:"span",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...e.components};return i.jsxs(i.Fragment,{children:[i.jsxs(s.p,{children:["datamark does not bundle a validator. Instead, it implements the ",i.jsx(s.strong,{children:"Standard Schema v1"})," interface, a cross-library specification that Zod, Valibot, ArkType, TypeBox, and others support."]}),`
`,i.jsx(s.h2,{id:"standard-schema-v1",children:"Standard Schema v1"}),`
`,i.jsxs(s.p,{children:["Any object with a ",i.jsx(s.code,{children:"~standard"})," property implementing the spec can be passed as a schema:"]}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" *"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" as"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" z "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "zod"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { datamark } "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" MyFormat"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" datamark"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  schema: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"object"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({ name: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(), age: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"number"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"() }),"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"  *"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"doc"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") {"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"    // ..."})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    return"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { name: "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"Ada"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:", age: "}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"30"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" };"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  },"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"});"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" result"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" MyFormat."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(markdown);"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// result is typed as { name: string; age: number }"})})]})})}),`
`,i.jsx(s.h2,{id:"validation-in-the-parse-pipeline",children:"Validation in the parse pipeline"}),`
`,i.jsxs(s.p,{children:["When a schema is provided, ",i.jsx(s.code,{children:"parse()"})," validates the generator's return value automatically. If validation fails, it throws ",i.jsx(s.code,{children:"ValidationError"})," with structured issue data:"]}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"try"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  MyFormat."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(badMarkdown);"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"} "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"catch"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" (err) {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"  if"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" (err "}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"instanceof"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" ValidationError"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"    console."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"log"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(err.issues);"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'    // [{ message: "Expected string, received number", path: ["age"] }]'})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  }"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"}"})})]})})}),`
`,i.jsx(n,{type:"warn",children:i.jsx(s.p,{children:"Asynchronous schema validation is not supported. Use synchronous validators like Zod or Valibot."})}),`
`,i.jsx(s.h2,{id:"supported-validators",children:"Supported validators"}),`
`,i.jsxs(s.table,{children:[i.jsx(s.thead,{children:i.jsxs(s.tr,{children:[i.jsx(s.th,{children:"Library"}),i.jsx(s.th,{children:"Status"})]})}),i.jsxs(s.tbody,{children:[i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Zod"}),i.jsx(s.td,{children:"✅ Supported"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Valibot"}),i.jsx(s.td,{children:"✅ Supported"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"ArkType"}),i.jsx(s.td,{children:"✅ Supported"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"TypeBox"}),i.jsx(s.td,{children:"✅ Supported"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Yup"}),i.jsx(s.td,{children:"❌ Not Standard Schema v1"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Joi"}),i.jsx(s.td,{children:"❌ Not Standard Schema v1"})]})]})]})]})}function c(e={}){const{wrapper:s}=e.components||{};return s?i.jsx(s,{...e,children:i.jsx(a,{...e})}):a(e)}export{r as _markdown,c as default,d as frontmatter,h as structuredData,l as toc};
