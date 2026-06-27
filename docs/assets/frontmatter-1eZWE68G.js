import{P as s,C as n}from"./main-BMgR5NfB.js";let a=`

import { Callout } from 'fumadocs-ui/components/callout';

datamark provides two frontmatter extraction functions for cases where you need them standalone.

\`\`\`typescript
import { extractFrontmatter, splitFrontmatter, FrontmatterError } from "datamark/parse";

const extracted = extractFrontmatter(\`---
title: Hello
---

# Body\`);

const split = splitFrontmatter(\`---
title: Hello
---

# Body\`);

const noFrontmatter = splitFrontmatter("# No frontmatter\\n\\nBody");
\`\`\`

extractFrontmatter() [#extractfrontmatter]

\`\`\`typescript
import { extractFrontmatter } from "datamark/parse";

const result = extractFrontmatter(\`---
title: Hello
---
Body here\`);
// { frontmatter: "title: Hello", body: "Body here" }
\`\`\`

Supports both \`---\` and \`+++\` style fences. Returns \`null\` if no frontmatter is found.

splitFrontmatter() [#splitfrontmatter]

\`\`\`typescript
import { splitFrontmatter } from "datamark/parse";

const result = splitFrontmatter(\`---
title: Hello
---
Body here\`);
// { frontmatter: "title: Hello", body: "Body here" }
\`\`\`

More lenient than \`extractFrontmatter\`. Uses line-by-line scanning and handles missing closing fences gracefully. Always returns an object (frontmatter may be empty string).

<Callout type="info">
  You usually don't need these directly. \`parse()\` handles frontmatter extraction and YAML parsing automatically.
</Callout>

FrontmatterError [#frontmattererror]

Both functions throw \`FrontmatterError\` on unexpected issues:

\`\`\`typescript
import { FrontmatterError } from "datamark/parse";

try {
  extractFrontmatter(badContent);
} catch (err) {
  if (err instanceof FrontmatterError) {
    console.error(err.message);
  }
}
\`\`\`
`,l={title:"Frontmatter",description:"Extract and split YAML frontmatter from Markdown strings."},h={contents:[{heading:void 0,content:"datamark provides two frontmatter extraction functions for cases where you need them standalone."},{heading:"extractfrontmatter",content:"Supports both `---` and `+++` style fences. Returns `null` if no frontmatter is found."},{heading:"splitfrontmatter",content:"More lenient than `extractFrontmatter`. Uses line-by-line scanning and handles missing closing fences gracefully. Always returns an object (frontmatter may be empty string)."},{heading:"splitfrontmatter",content:"You usually don't need these directly. `parse()` handles frontmatter extraction and YAML parsing automatically."},{heading:"frontmattererror",content:"Both functions throw `FrontmatterError` on unexpected issues:"}],headings:[{id:"extractfrontmatter",content:"extractFrontmatter()"},{id:"splitfrontmatter",content:"splitFrontmatter()"},{id:"frontmattererror",content:"FrontmatterError"}]};const d=[{depth:2,url:"#extractfrontmatter",title:s.jsx(s.Fragment,{children:"extractFrontmatter()"})},{depth:2,url:"#splitfrontmatter",title:s.jsx(s.Fragment,{children:"splitFrontmatter()"})},{depth:2,url:"#frontmattererror",title:s.jsx(s.Fragment,{children:"FrontmatterError"})}];function e(t){const i={code:"code",h2:"h2",p:"p",pre:"pre",span:"span",...t.components};return s.jsxs(s.Fragment,{children:[s.jsx(i.p,{children:"datamark provides two frontmatter extraction functions for cases where you need them standalone."}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { extractFrontmatter, splitFrontmatter, FrontmatterError } "}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/parse"'}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,s.jsx(i.span,{className:"line"}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),s.jsx(i.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" extracted"}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),s.jsx(i.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" extractFrontmatter"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`---"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"title: Hello"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,s.jsx(i.span,{className:"line"}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"# Body`"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]}),`
`,s.jsx(i.span,{className:"line"}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),s.jsx(i.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" split"}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),s.jsx(i.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" splitFrontmatter"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`---"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"title: Hello"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,s.jsx(i.span,{className:"line"}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"# Body`"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]}),`
`,s.jsx(i.span,{className:"line"}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),s.jsx(i.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" noFrontmatter"}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),s.jsx(i.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" splitFrontmatter"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'"# No frontmatter'}),s.jsx(i.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"\\n\\n"}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:'Body"'}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]})]})})}),`
`,s.jsx(i.h2,{id:"extractfrontmatter",children:"extractFrontmatter()"}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { extractFrontmatter } "}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/parse"'}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,s.jsx(i.span,{className:"line"}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),s.jsx(i.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" result"}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),s.jsx(i.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" extractFrontmatter"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`---"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"title: Hello"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"Body here`"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// { frontmatter: "title: Hello", body: "Body here" }'})})]})})}),`
`,s.jsxs(i.p,{children:["Supports both ",s.jsx(i.code,{children:"---"})," and ",s.jsx(i.code,{children:"+++"})," style fences. Returns ",s.jsx(i.code,{children:"null"})," if no frontmatter is found."]}),`
`,s.jsx(i.h2,{id:"splitfrontmatter",children:"splitFrontmatter()"}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { splitFrontmatter } "}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/parse"'}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,s.jsx(i.span,{className:"line"}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),s.jsx(i.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" result"}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),s.jsx(i.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" splitFrontmatter"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"`---"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"title: Hello"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"---"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:"Body here`"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:'// { frontmatter: "title: Hello", body: "Body here" }'})})]})})}),`
`,s.jsxs(i.p,{children:["More lenient than ",s.jsx(i.code,{children:"extractFrontmatter"}),". Uses line-by-line scanning and handles missing closing fences gracefully. Always returns an object (frontmatter may be empty string)."]}),`
`,s.jsx(n,{type:"info",children:s.jsxs(i.p,{children:["You usually don't need these directly. ",s.jsx(i.code,{children:"parse()"})," handles frontmatter extraction and YAML parsing automatically."]})}),`
`,s.jsx(i.h2,{id:"frontmattererror",children:"FrontmatterError"}),`
`,s.jsxs(i.p,{children:["Both functions throw ",s.jsx(i.code,{children:"FrontmatterError"})," on unexpected issues:"]}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"import"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { FrontmatterError } "}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"from"}),s.jsx(i.span,{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"},children:' "datamark/parse"'}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]}),`
`,s.jsx(i.span,{className:"line"}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"try"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" {"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"  extractFrontmatter"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(badContent);"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"} "}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"catch"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" (err) {"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"  if"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" (err "}),s.jsx(i.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"instanceof"}),s.jsx(i.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" FrontmatterError"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:") {"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"    console."}),s.jsx(i.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"error"}),s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(err.message);"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"  }"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"}"})})]})})})]})}function c(t={}){const{wrapper:i}=t.components||{};return i?s.jsx(i,{...t,children:s.jsx(e,{...t})}):e(t)}export{a as _markdown,c as default,l as frontmatter,h as structuredData,d as toc};
