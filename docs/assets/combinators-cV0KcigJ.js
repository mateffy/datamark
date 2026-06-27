import{P as e,C as s}from"./main-BkMfnTe8.js";let r=`

import { Callout } from 'fumadocs-ui/components/callout';

A combinator is a function that transforms an array of block nodes into a result and a remaining slice. \`null\` means the combinator did not match.

\`\`\`typescript
type Combinator<T> = (nodes: BlockNode[]) => { value: T; remaining: BlockNode[] } | null;
\`\`\`

Node matchers [#node-matchers]

Matchers like \`heading(1)\` and \`codeBlock()\` are both predicates and combinators. They carry a \`CombinatorSymbol\` that the runner uses when you pass them to \`doc.consume()\`.

\`\`\`typescript
const matcher = heading(1);
matcher(blockNode); // true if it's an H1
const result = matcher[CombinatorSymbol](nodes); // runs the combinator
\`\`\`

This dual nature means you can reuse matchers in \`filter\`, \`findAll\`, and \`splitBy\` without writing separate predicate functions.

Combinator modifiers [#combinator-modifiers]

optional(matcher) [#optionalmatcher]

Returns the value if it matches, or \`undefined\` if it doesn't. Never throws.

many(matcher) [#manymatcher]

Runs the combinator repeatedly until it fails. Returns all matches.

repeat(count, matcher) [#repeatcount-matcher]

Runs the combinator exactly \`count\` times. Throws if it can't match enough.

Structural combinators [#structural-combinators]

until(predicate) [#untilpredicate]

Consumes nodes until the predicate matches. Returns consumed nodes; the matched node stays in \`remaining\`.

splitByCombinator(predicate) [#splitbycombinatorpredicate]

Splits all remaining nodes by a predicate. Returns groups of nodes separated by matching nodes (which are discarded). Consumes everything.

<Callout type="info">
  \`splitByCombinator\` is the workhorse for section-based documents. Combine it with \`heading(2)\` to split a document into top-level sections, then map over each section to extract its contents.
</Callout>

rest() [#rest]

Consumes all remaining nodes. Always succeeds.

section(depth) [#sectiondepth]

Consumes a heading at the given depth plus all body nodes until the next heading of the same depth. The heading is included in the returned chunk. Fails if the first remaining node is not a matching heading.

Predicate helpers [#predicate-helpers]

except(predicate) [#exceptpredicate]

Negates a predicate. Useful with \`until()\` or \`splitByCombinator()\`.

any(...predicates) [#anypredicates]

Returns \`true\` if any predicate matches.

all(...predicates) [#allpredicates]

Returns \`true\` only if all predicates match.

How consume advances [#how-consume-advances]

When you call \`yield* doc.consume(heading(1))\`, the runner:

1. Finds the first matching node in \`remaining\`
2. Returns it as \`value\`
3. Sets \`remaining\` to everything after the matched node

This means combinators are **cursor-advancing**. They don't just test — they consume.

Error handling [#error-handling]

When a combinator fails, the runner throws \`TemplateParseError\` with a message like:

\`\`\`
Parse combinator "heading(1)" failed at position "## Subheading"
\`\`\`

The position is derived from the first unconsumed node, so you know exactly where parsing broke down.
`,h={title:"Combinators",description:"How node matchers, combinator modifiers, and structural combinators work under the hood."},c={contents:[{heading:void 0,content:"A combinator is a function that transforms an array of block nodes into a result and a remaining slice. `null` means the combinator did not match."},{heading:"node-matchers",content:"Matchers like `heading(1)` and `codeBlock()` are both predicates and combinators. They carry a `CombinatorSymbol` that the runner uses when you pass them to `doc.consume()`."},{heading:"node-matchers",content:"This dual nature means you can reuse matchers in `filter`, `findAll`, and `splitBy` without writing separate predicate functions."},{heading:"optionalmatcher",content:"Returns the value if it matches, or `undefined` if it doesn't. Never throws."},{heading:"manymatcher",content:"Runs the combinator repeatedly until it fails. Returns all matches."},{heading:"repeatcount-matcher",content:"Runs the combinator exactly `count` times. Throws if it can't match enough."},{heading:"untilpredicate",content:"Consumes nodes until the predicate matches. Returns consumed nodes; the matched node stays in `remaining`."},{heading:"splitbycombinatorpredicate",content:"Splits all remaining nodes by a predicate. Returns groups of nodes separated by matching nodes (which are discarded). Consumes everything."},{heading:"splitbycombinatorpredicate",content:"`splitByCombinator` is the workhorse for section-based documents. Combine it with `heading(2)` to split a document into top-level sections, then map over each section to extract its contents."},{heading:"rest",content:"Consumes all remaining nodes. Always succeeds."},{heading:"sectiondepth",content:"Consumes a heading at the given depth plus all body nodes until the next heading of the same depth. The heading is included in the returned chunk. Fails if the first remaining node is not a matching heading."},{heading:"exceptpredicate",content:"Negates a predicate. Useful with `until()` or `splitByCombinator()`."},{heading:"anypredicates",content:"Returns `true` if any predicate matches."},{heading:"allpredicates",content:"Returns `true` only if all predicates match."},{heading:"how-consume-advances",content:"When you call `yield* doc.consume(heading(1))`, the runner:"},{heading:"how-consume-advances",content:"Finds the first matching node in `remaining`"},{heading:"how-consume-advances",content:"Returns it as `value`"},{heading:"how-consume-advances",content:"Sets `remaining` to everything after the matched node"},{heading:"how-consume-advances",content:"This means combinators are **cursor-advancing**. They don't just test — they consume."},{heading:"error-handling",content:"When a combinator fails, the runner throws `TemplateParseError` with a message like:"},{heading:"error-handling",content:"The position is derived from the first unconsumed node, so you know exactly where parsing broke down."}],headings:[{id:"node-matchers",content:"Node matchers"},{id:"combinator-modifiers",content:"Combinator modifiers"},{id:"optionalmatcher",content:"`optional(matcher)`"},{id:"manymatcher",content:"`many(matcher)`"},{id:"repeatcount-matcher",content:"`repeat(count, matcher)`"},{id:"structural-combinators",content:"Structural combinators"},{id:"untilpredicate",content:"`until(predicate)`"},{id:"splitbycombinatorpredicate",content:"`splitByCombinator(predicate)`"},{id:"rest",content:"`rest()`"},{id:"sectiondepth",content:"`section(depth)`"},{id:"predicate-helpers",content:"Predicate helpers"},{id:"exceptpredicate",content:"`except(predicate)`"},{id:"anypredicates",content:"`any(...predicates)`"},{id:"allpredicates",content:"`all(...predicates)`"},{id:"how-consume-advances",content:"How consume advances"},{id:"error-handling",content:"Error handling"}]};const d=[{depth:2,url:"#node-matchers",title:e.jsx(e.Fragment,{children:"Node matchers"})},{depth:2,url:"#combinator-modifiers",title:e.jsx(e.Fragment,{children:"Combinator modifiers"})},{depth:3,url:"#optionalmatcher",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"optional(matcher)"})})},{depth:3,url:"#manymatcher",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"many(matcher)"})})},{depth:3,url:"#repeatcount-matcher",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"repeat(count, matcher)"})})},{depth:2,url:"#structural-combinators",title:e.jsx(e.Fragment,{children:"Structural combinators"})},{depth:3,url:"#untilpredicate",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"until(predicate)"})})},{depth:3,url:"#splitbycombinatorpredicate",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"splitByCombinator(predicate)"})})},{depth:3,url:"#rest",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"rest()"})})},{depth:3,url:"#sectiondepth",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"section(depth)"})})},{depth:2,url:"#predicate-helpers",title:e.jsx(e.Fragment,{children:"Predicate helpers"})},{depth:3,url:"#exceptpredicate",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"except(predicate)"})})},{depth:3,url:"#anypredicates",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"any(...predicates)"})})},{depth:3,url:"#allpredicates",title:e.jsx(e.Fragment,{children:e.jsx("code",{children:"all(...predicates)"})})},{depth:2,url:"#how-consume-advances",title:e.jsx(e.Fragment,{children:"How consume advances"})},{depth:2,url:"#error-handling",title:e.jsx(e.Fragment,{children:"Error handling"})}];function t(i){const n={code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",...i.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.p,{children:["A combinator is a function that transforms an array of block nodes into a result and a remaining slice. ",e.jsx(n.code,{children:"null"})," means the combinator did not match."]}),`
`,e.jsx(e.Fragment,{children:e.jsx(n.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:e.jsx(n.code,{children:e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"type"}),e.jsx(n.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" Combinator"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"<"}),e.jsx(n.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"T"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"> "}),e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"="}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" ("}),e.jsx(n.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"nodes"}),e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),e.jsx(n.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" BlockNode"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"[]) "}),e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"=>"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" { "}),e.jsx(n.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"value"}),e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),e.jsx(n.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" T"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"; "}),e.jsx(n.span,{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"},children:"remaining"}),e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:":"}),e.jsx(n.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" BlockNode"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"[] } "}),e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"|"}),e.jsx(n.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" null"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:";"})]})})})}),`
`,e.jsx(n.h2,{id:"node-matchers",children:"Node matchers"}),`
`,e.jsxs(n.p,{children:["Matchers like ",e.jsx(n.code,{children:"heading(1)"})," and ",e.jsx(n.code,{children:"codeBlock()"})," are both predicates and combinators. They carry a ",e.jsx(n.code,{children:"CombinatorSymbol"})," that the runner uses when you pass them to ",e.jsx(n.code,{children:"doc.consume()"}),"."]}),`
`,e.jsx(e.Fragment,{children:e.jsx(n.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>',children:e.jsxs(n.code,{children:[e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),e.jsx(n.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" matcher"}),e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),e.jsx(n.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:" heading"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),e.jsx(n.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:"1"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:");"})]}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"},children:"matcher"}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:"(blockNode); "}),e.jsx(n.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// true if it's an H1"})]}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:"const"}),e.jsx(n.span,{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"},children:" result"}),e.jsx(n.span,{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"},children:" ="}),e.jsx(n.span,{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"},children:" matcher[CombinatorSymbol](nodes); "}),e.jsx(n.span,{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"},children:"// runs the combinator"})]})]})})}),`
`,e.jsxs(n.p,{children:["This dual nature means you can reuse matchers in ",e.jsx(n.code,{children:"filter"}),", ",e.jsx(n.code,{children:"findAll"}),", and ",e.jsx(n.code,{children:"splitBy"})," without writing separate predicate functions."]}),`
`,e.jsx(n.h2,{id:"combinator-modifiers",children:"Combinator modifiers"}),`
`,e.jsx(n.h3,{id:"optionalmatcher",children:e.jsx(n.code,{children:"optional(matcher)"})}),`
`,e.jsxs(n.p,{children:["Returns the value if it matches, or ",e.jsx(n.code,{children:"undefined"})," if it doesn't. Never throws."]}),`
`,e.jsx(n.h3,{id:"manymatcher",children:e.jsx(n.code,{children:"many(matcher)"})}),`
`,e.jsx(n.p,{children:"Runs the combinator repeatedly until it fails. Returns all matches."}),`
`,e.jsx(n.h3,{id:"repeatcount-matcher",children:e.jsx(n.code,{children:"repeat(count, matcher)"})}),`
`,e.jsxs(n.p,{children:["Runs the combinator exactly ",e.jsx(n.code,{children:"count"})," times. Throws if it can't match enough."]}),`
`,e.jsx(n.h2,{id:"structural-combinators",children:"Structural combinators"}),`
`,e.jsx(n.h3,{id:"untilpredicate",children:e.jsx(n.code,{children:"until(predicate)"})}),`
`,e.jsxs(n.p,{children:["Consumes nodes until the predicate matches. Returns consumed nodes; the matched node stays in ",e.jsx(n.code,{children:"remaining"}),"."]}),`
`,e.jsx(n.h3,{id:"splitbycombinatorpredicate",children:e.jsx(n.code,{children:"splitByCombinator(predicate)"})}),`
`,e.jsx(n.p,{children:"Splits all remaining nodes by a predicate. Returns groups of nodes separated by matching nodes (which are discarded). Consumes everything."}),`
`,e.jsx(s,{type:"info",children:e.jsxs(n.p,{children:[e.jsx(n.code,{children:"splitByCombinator"})," is the workhorse for section-based documents. Combine it with ",e.jsx(n.code,{children:"heading(2)"})," to split a document into top-level sections, then map over each section to extract its contents."]})}),`
`,e.jsx(n.h3,{id:"rest",children:e.jsx(n.code,{children:"rest()"})}),`
`,e.jsx(n.p,{children:"Consumes all remaining nodes. Always succeeds."}),`
`,e.jsx(n.h3,{id:"sectiondepth",children:e.jsx(n.code,{children:"section(depth)"})}),`
`,e.jsx(n.p,{children:"Consumes a heading at the given depth plus all body nodes until the next heading of the same depth. The heading is included in the returned chunk. Fails if the first remaining node is not a matching heading."}),`
`,e.jsx(n.h2,{id:"predicate-helpers",children:"Predicate helpers"}),`
`,e.jsx(n.h3,{id:"exceptpredicate",children:e.jsx(n.code,{children:"except(predicate)"})}),`
`,e.jsxs(n.p,{children:["Negates a predicate. Useful with ",e.jsx(n.code,{children:"until()"})," or ",e.jsx(n.code,{children:"splitByCombinator()"}),"."]}),`
`,e.jsx(n.h3,{id:"anypredicates",children:e.jsx(n.code,{children:"any(...predicates)"})}),`
`,e.jsxs(n.p,{children:["Returns ",e.jsx(n.code,{children:"true"})," if any predicate matches."]}),`
`,e.jsx(n.h3,{id:"allpredicates",children:e.jsx(n.code,{children:"all(...predicates)"})}),`
`,e.jsxs(n.p,{children:["Returns ",e.jsx(n.code,{children:"true"})," only if all predicates match."]}),`
`,e.jsx(n.h2,{id:"how-consume-advances",children:"How consume advances"}),`
`,e.jsxs(n.p,{children:["When you call ",e.jsx(n.code,{children:"yield* doc.consume(heading(1))"}),", the runner:"]}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["Finds the first matching node in ",e.jsx(n.code,{children:"remaining"})]}),`
`,e.jsxs(n.li,{children:["Returns it as ",e.jsx(n.code,{children:"value"})]}),`
`,e.jsxs(n.li,{children:["Sets ",e.jsx(n.code,{children:"remaining"})," to everything after the matched node"]}),`
`]}),`
`,e.jsxs(n.p,{children:["This means combinators are ",e.jsx(n.strong,{children:"cursor-advancing"}),". They don't just test — they consume."]}),`
`,e.jsx(n.h2,{id:"error-handling",children:"Error handling"}),`
`,e.jsxs(n.p,{children:["When a combinator fails, the runner throws ",e.jsx(n.code,{children:"TemplateParseError"})," with a message like:"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(n.pre,{className:"shiki shiki-themes github-light github-dark",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabIndex:"0",icon:'<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',children:e.jsx(n.code,{children:e.jsx(n.span,{className:"line",children:e.jsx(n.span,{children:'Parse combinator "heading(1)" failed at position "## Subheading"'})})})})}),`
`,e.jsx(n.p,{children:"The position is derived from the first unconsumed node, so you know exactly where parsing broke down."})]})}function o(i={}){const{wrapper:n}=i.components||{};return n?e.jsx(n,{...i,children:e.jsx(t,{...i})}):t(i)}export{r as _markdown,o as default,h as frontmatter,c as structuredData,d as toc};
