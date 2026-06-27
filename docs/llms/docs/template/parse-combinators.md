

import { Callout } from 'fumadocs-ui/components/callout';

Parse combinators consume nodes from the AST and advance the internal cursor. They are used with `yield* doc.consume(...)`.

Node matchers [#node-matchers]

heading(depth) [#headingdepth]

Match a heading at a specific depth. Returns the full `HeadingNode`.

```typescript
const h1 = yield* doc.consume(heading(1));
console.log(inlineText(h1.children)); // heading text content
```

paragraph() [#paragraph]

Match any paragraph. Returns `ParagraphNode`.

```typescript
const p = yield* doc.consume(paragraph());
```

codeBlock(options?) [#codeblockoptions]

Match a code block, optionally filtered by language.

```typescript
const ts = yield* doc.consume(codeBlock({ lang: "typescript" }));
console.log(ts.value); // raw code string
console.log(ts.lang); // "typescript"
```

hr() [#hr]

Match a horizontal rule.

```typescript
const rule = yield* doc.consume(hr());
```

todo() [#todo]

Match a list containing todo items. Returns `ListNode`.

```typescript
const list = yield* doc.consume(todo());
```

Combinator modifiers [#combinator-modifiers]

optional(matcher) [#optionalmatcher]

Returns the value, or `undefined` if it does not match.

```typescript
const subtitle = yield* doc.consume(optional(heading(2)));
// HeadingNode | undefined
```

many(matcher) [#manymatcher]

Returns all consecutive matches.

```typescript
const paragraphs = yield* doc.consume(many(paragraph()));
// ParagraphNode[]
```

repeat(count, matcher) [#repeatcount-matcher]

Returns exactly `count` matches. Throws if not enough.

```typescript
const [a, b] = yield* doc.consume(repeat(2, paragraph()));
```

except(predicate) [#exceptpredicate]

Negates a predicate. Useful with `until()` or `splitBy()`.

```typescript
const nodes = yield* doc.consume(until(except(heading(2))));
// consumes until a non-H2 node
```

any(...predicates) [#anypredicates]

Returns `true` if any predicate matches.

```typescript
const isBreak = any(heading(2), hr());
const sections = yield* doc.consume(splitByCombinator(isBreak));
```

all(...predicates) [#allpredicates]

Returns `true` only if all predicates match.

```typescript
const isSpecial = all(heading(2), (n) => n.raw.includes("TODO"));
```

Structural combinators [#structural-combinators]

splitByCombinator(predicate) [#splitbycombinatorpredicate]

Split remaining nodes by a predicate. Returns groups. Matching separator nodes are discarded. Consumes everything.

```typescript
const sections = yield* doc.consume(splitByCombinator(heading(2)));
// BlockNode[][] — each group is nodes between H2s
```

<Callout type="info">
  `splitByCombinator` is the most common structural combinator. It is the standard way to turn a flat list of nodes into sections. When passed to `consume()` with a generator, the generator runs on each chunk and results are collected into an array.
</Callout>

until(predicate) [#untilpredicate]

Consume nodes until the predicate matches. Returns consumed nodes; the matched node stays in `remaining`.

```typescript
const preamble = yield* doc.consume(until(heading(2)));
// BlockNode[] — everything before the first H2
```

rest() [#rest]

Consume all remaining nodes.

```typescript
const leftovers = yield* doc.consume(rest());
// BlockNode[]
```

section(depth) [#sectiondepth]

Consume a heading at the given depth plus all body nodes until the next heading of the same depth. The heading is included. Fails if the first remaining node is not a matching heading.

```typescript
const chunk = yield* doc.consume(section(2));
// BlockNode[] — heading(2) + body nodes
```

Accessing remaining nodes [#accessing-remaining-nodes]

You can inspect what's left without consuming:

```typescript
console.log(doc.remaining.length);
console.log(doc.remaining[0]?.type);
```

frontmatter() [#frontmatter]

Returns the frontmatter object. Frontmatter is not part of the cursor — calling it does not advance `remaining`.

```typescript
const fm = yield* doc.frontmatter();
// Record<string, unknown> | null
```

peek() [#peek]

Run a combinator without advancing the parent cursor. Same signature as `consume()`.

```typescript
const next = yield* doc.peek(heading(1));
// heading(1) is still in doc.remaining
```
