

import { Callout } from 'fumadocs-ui/components/callout';

When we set out to build datamark, we had a specific requirement: the API should read like a recipe for consuming a document. Step by step, linear, declarative.

We evaluated three approaches: promises, parser combinators, and generators. Generators won.

Promises and async/await [#promises-and-asyncawait]

You could write parsing as a sequence of async functions:

```typescript
async function parse(doc) {
  const fm = await doc.frontmatter();
  const title = await doc.consume(heading(1));
  return { title: inlineText(title.children), meta: fm };
}
```

This reads well, but it locks us into asynchronicity for no benefit. Markdown parsing is synchronous. More importantly, promises don't let us pause between steps to inject synthetic values for tracing.

Parser combinators [#parser-combinators]

Traditional parser combinators (like Parsec) compose functions that return new parsers:

```typescript
const parser = seq(frontmatter, heading(1));
```

This is elegant and well-studied, but it introduces a steep learning curve. Combinator libraries have their own algebra, their own error model, and their own way of threading state. We wanted something that looked like normal TypeScript.

Generators [#generators]

Generators give us the best of both worlds:

1. **They read linearly.** Each `yield*` is a step. The code looks like a script.
2. **They are pausable.** The runner can stop after each step, inspect what happened, and inject values for tracing.
3. **They are native.** No new syntax, no new concepts. Just `function*` and `yield*`.
4. **They compose naturally.** `yield*` delegates to another generator, exactly like combinators compose.

```typescript
*parse(doc) {
  const fm = yield* doc.frontmatter();
  const title = yield* doc.consume(heading(1));
  const sections = yield* doc.consume(splitByCombinator(heading(2)));
  return { title: inlineText(title.children), sections };
}
```

<Callout type="info">
  The generator approach also means our `trace()` implementation is trivial. We run the same generator against a synthetic context that records every step. With promises or callbacks, this would require a completely separate code path.
</Callout>

The Yieldable protocol [#the-yieldable-protocol]

Under the hood, each combinator returns a `Yieldable<T>` — an object with a `_tag` and executable logic. The runner executes it and feeds the result back into the generator. This protocol is what makes `yield*` "return" a value.

It is a small abstraction, but it gives us:

* **Composable combinators** — `many(optional(heading(2)))` works out of the box
* **Metadata attachment** — `.description("...")` and `.examples([...])` for docs
* **Uniform error handling** — every failure goes through the same `TemplateParseError` path

Why not async generators? [#why-not-async-generators]

Async generators (`async function*`) would let us `await` inside parsing. But Markdown parsing doesn't need I/O. Keeping it synchronous means simpler stack traces, no event loop overhead, and easier debugging.

Generators are the right abstraction for a declarative document parser. They let us write code that reads like the document it consumes.
