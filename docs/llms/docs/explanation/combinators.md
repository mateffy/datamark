

import { Callout } from 'fumadocs-ui/components/callout';

A combinator is a function that transforms an array of block nodes into a result and a remaining slice. `null` means the combinator did not match.

```typescript
type Combinator<T> = (nodes: BlockNode[]) => { value: T; remaining: BlockNode[] } | null;
```

Node matchers [#node-matchers]

Matchers like `heading(1)` and `codeBlock()` are both predicates and combinators. They carry a `CombinatorSymbol` that the runner uses when you pass them to `doc.consume()`.

```typescript
const matcher = heading(1);
matcher(blockNode); // true if it's an H1
const result = matcher[CombinatorSymbol](nodes); // runs the combinator
```

This dual nature means you can reuse matchers in `filter`, `findAll`, and `splitBy` without writing separate predicate functions.

Combinator modifiers [#combinator-modifiers]

optional(matcher) [#optionalmatcher]

Returns the value if it matches, or `undefined` if it doesn't. Never throws.

many(matcher) [#manymatcher]

Runs the combinator repeatedly until it fails. Returns all matches.

repeat(count, matcher) [#repeatcount-matcher]

Runs the combinator exactly `count` times. Throws if it can't match enough.

Structural combinators [#structural-combinators]

until(predicate) [#untilpredicate]

Consumes nodes until the predicate matches. Returns consumed nodes; the matched node stays in `remaining`.

splitByCombinator(predicate) [#splitbycombinatorpredicate]

Splits all remaining nodes by a predicate. Returns groups of nodes separated by matching nodes (which are discarded). Consumes everything.

<Callout type="info">
  `splitByCombinator` is the workhorse for section-based documents. Combine it with `heading(2)` to split a document into top-level sections, then map over each section to extract its contents.
</Callout>

rest() [#rest]

Consumes all remaining nodes. Always succeeds.

section(depth) [#sectiondepth]

Consumes a heading at the given depth plus all body nodes until the next heading of the same depth. The heading is included in the returned chunk. Fails if the first remaining node is not a matching heading.

Predicate helpers [#predicate-helpers]

except(predicate) [#exceptpredicate]

Negates a predicate. Useful with `until()` or `splitByCombinator()`.

any(...predicates) [#anypredicates]

Returns `true` if any predicate matches.

all(...predicates) [#allpredicates]

Returns `true` only if all predicates match.

How consume advances [#how-consume-advances]

When you call `yield* doc.consume(heading(1))`, the runner:

1. Finds the first matching node in `remaining`
2. Returns it as `value`
3. Sets `remaining` to everything after the matched node

This means combinators are **cursor-advancing**. They don't just test — they consume.

Error handling [#error-handling]

When a combinator fails, the runner throws `TemplateParseError` with a message like:

```
Parse combinator "heading(1)" failed at position "## Subheading"
```

The position is derived from the first unconsumed node, so you know exactly where parsing broke down.
