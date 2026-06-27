import{P as i}from"./main-BkMfnTe8.js";let h=`

JSON Schema is the standard way to describe structured data. Could you use it to describe a Markdown document format?

The JSON Schema approach [#the-json-schema-approach]

You would define a schema for the output shape:

\`\`\`json
{
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "sections": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "heading": { "type": "string" },
          "content": { "type": "string" }
        }
      }
    }
  }
}
\`\`\`

But JSON Schema describes **output shape**, not **how to parse**. It doesn't tell you:

* Which heading depth marks a section boundary
* How to extract code blocks vs. paragraphs
* How to handle optional frontmatter
* How to serialize back to Markdown

The datamark approach [#the-datamark-approach]

datamark combines schema validation with parsing logic:

\`\`\`typescript
const PlanFormat = datamark({
  schema: z.object({ title: z.string(), sections: z.array(...) }),
  *parse(doc) {
    const title = yield* doc.consume(heading(1));
    const sections = yield* doc.consume(splitBy(heading(2)));
    // ...map to schema shape
  },
});
\`\`\`

| Feature           | JSON Schema | datamark                |
| ----------------- | ----------- | ----------------------- |
| Output validation | ✅           | ✅ (via Standard Schema) |
| Parsing logic     | ❌           | ✅ Generator functions   |
| Bidirectional     | ❌           | ✅ Parse + stringify     |
| Trace/debug       | ❌           | ✅ Step-by-step          |
| Self-testing      | ❌           | ✅ Inline examples       |
| Markdown-specific | ❌           | ✅ AST combinators       |

When to use JSON Schema [#when-to-use-json-schema]

JSON Schema is excellent for API payloads, configuration files, and any data that doesn't live in Markdown. When your input is a Markdown document, you need parsing logic too — and that's where datamark fits.
`,t={title:"datamark vs JSON Schema",description:"Describing document structure with JSON Schema vs. generator-based combinators."},r={contents:[{heading:void 0,content:"JSON Schema is the standard way to describe structured data. Could you use it to describe a Markdown document format?"},{heading:"the-json-schema-approach",content:"You would define a schema for the output shape:"},{heading:"the-json-schema-approach",content:"But JSON Schema describes **output shape**, not **how to parse**. It doesn't tell you:"},{heading:"the-json-schema-approach",content:"Which heading depth marks a section boundary"},{heading:"the-json-schema-approach",content:"How to extract code blocks vs. paragraphs"},{heading:"the-json-schema-approach",content:"How to handle optional frontmatter"},{heading:"the-json-schema-approach",content:"How to serialize back to Markdown"},{heading:"the-datamark-approach",content:"datamark combines schema validation with parsing logic:"},{heading:"the-datamark-approach",content:"Feature"},{heading:"the-datamark-approach",content:"JSON Schema"},{heading:"the-datamark-approach",content:"datamark"},{heading:"the-datamark-approach",content:"Output validation"},{heading:"the-datamark-approach",content:"✅"},{heading:"the-datamark-approach",content:"✅ (via Standard Schema)"},{heading:"the-datamark-approach",content:"Parsing logic"},{heading:"the-datamark-approach",content:"❌"},{heading:"the-datamark-approach",content:"✅ Generator functions"},{heading:"the-datamark-approach",content:"Bidirectional"},{heading:"the-datamark-approach",content:"❌"},{heading:"the-datamark-approach",content:"✅ Parse + stringify"},{heading:"the-datamark-approach",content:"Trace/debug"},{heading:"the-datamark-approach",content:"❌"},{heading:"the-datamark-approach",content:"✅ Step-by-step"},{heading:"the-datamark-approach",content:"Self-testing"},{heading:"the-datamark-approach",content:"❌"},{heading:"the-datamark-approach",content:"✅ Inline examples"},{heading:"the-datamark-approach",content:"Markdown-specific"},{heading:"the-datamark-approach",content:"❌"},{heading:"the-datamark-approach",content:"✅ AST combinators"},{heading:"when-to-use-json-schema",content:"JSON Schema is excellent for API payloads, configuration files, and any data that doesn't live in Markdown. When your input is a Markdown document, you need parsing logic too — and that's where datamark fits."}],headings:[{id:"the-json-schema-approach",content:"The JSON Schema approach"},{id:"the-datamark-approach",content:"The datamark approach"},{id:"when-to-use-json-schema",content:"When to use JSON Schema"}]};const l=[{depth:2,url:"#the-json-schema-approach",title:i.jsx(i.Fragment,{children:"The JSON Schema approach"})},{depth:2,url:"#the-datamark-approach",title:i.jsx(i.Fragment,{children:"The datamark approach"})},{depth:2,url:"#when-to-use-json-schema",title:i.jsx(i.Fragment,{children:"When to use JSON Schema"})}];function a(e){const s={code:"code",h2:"h2",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...e.components};return i.jsxs(i.Fragment,{children:[i.jsx(s.p,{children:"JSON Schema is the standard way to describe structured data. Could you use it to describe a Markdown document format?"}),`
`,i.jsx(s.h2,{id:"the-json-schema-approach",children:"The JSON Schema approach"}),`
`,i.jsx(s.p,{children:"You would define a schema for the output shape:"}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"{"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'  "type"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"object"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'  "properties"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'    "title"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": { "}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'"type"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"string"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" },"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'    "sections"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'      "type"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"array"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'      "items"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'        "type"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"object"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'        "properties"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'          "heading"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": { "}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'"type"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"string"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" },"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'          "content"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": { "}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:'"type"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),i.jsx(s.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"string"'}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" }"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"        }"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"      }"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"    }"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  }"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"}"})})]})})}),`
`,i.jsxs(s.p,{children:["But JSON Schema describes ",i.jsx(s.strong,{children:"output shape"}),", not ",i.jsx(s.strong,{children:"how to parse"}),". It doesn't tell you:"]}),`
`,i.jsxs(s.ul,{children:[`
`,i.jsx(s.li,{children:"Which heading depth marks a section boundary"}),`
`,i.jsx(s.li,{children:"How to extract code blocks vs. paragraphs"}),`
`,i.jsx(s.li,{children:"How to handle optional frontmatter"}),`
`,i.jsx(s.li,{children:"How to serialize back to Markdown"}),`
`]}),`
`,i.jsx(s.h2,{id:"the-datamark-approach",children:"The datamark approach"}),`
`,i.jsx(s.p,{children:"datamark combines schema validation with parsing logic:"}),`
`,i.jsx(i.Fragment,{children:i.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:i.jsxs(s.code,{children:[i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" PlanFormat"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" datamark"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  schema: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"object"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"({ title: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"string"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(), sections: z."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"array"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"..."}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") }),"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"  *"}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"parse"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"doc"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" title"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" yield*"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" doc."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"consume"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"heading"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"1"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"));"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"    const"}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" sections"}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),i.jsx(s.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" yield*"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" doc."}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"consume"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"splitBy"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"heading"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),i.jsx(s.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"2"}),i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:")));"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"    // ...map to schema shape"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  },"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"});"})})]})})}),`
`,i.jsxs(s.table,{children:[i.jsx(s.thead,{children:i.jsxs(s.tr,{children:[i.jsx(s.th,{children:"Feature"}),i.jsx(s.th,{children:"JSON Schema"}),i.jsx(s.th,{children:"datamark"})]})}),i.jsxs(s.tbody,{children:[i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Output validation"}),i.jsx(s.td,{children:"✅"}),i.jsx(s.td,{children:"✅ (via Standard Schema)"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Parsing logic"}),i.jsx(s.td,{children:"❌"}),i.jsx(s.td,{children:"✅ Generator functions"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Bidirectional"}),i.jsx(s.td,{children:"❌"}),i.jsx(s.td,{children:"✅ Parse + stringify"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Trace/debug"}),i.jsx(s.td,{children:"❌"}),i.jsx(s.td,{children:"✅ Step-by-step"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Self-testing"}),i.jsx(s.td,{children:"❌"}),i.jsx(s.td,{children:"✅ Inline examples"})]}),i.jsxs(s.tr,{children:[i.jsx(s.td,{children:"Markdown-specific"}),i.jsx(s.td,{children:"❌"}),i.jsx(s.td,{children:"✅ AST combinators"})]})]})]}),`
`,i.jsx(s.h2,{id:"when-to-use-json-schema",children:"When to use JSON Schema"}),`
`,i.jsx(s.p,{children:"JSON Schema is excellent for API payloads, configuration files, and any data that doesn't live in Markdown. When your input is a Markdown document, you need parsing logic too — and that's where datamark fits."})]})}function d(e={}){const{wrapper:s}=e.components||{};return s?i.jsx(s,{...e,children:i.jsx(a,{...e})}):a(e)}export{h as _markdown,d as default,t as frontmatter,r as structuredData,l as toc};
