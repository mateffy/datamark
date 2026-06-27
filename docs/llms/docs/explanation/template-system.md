

import { Callout } from 'fumadocs-ui/components/callout';

The Format SDK is the heart of datamark. It lets you define a **format** — a reusable, bidirectional mapping between Markdown documents and typed objects.

The core idea [#the-core-idea]

Instead of writing imperative traversal code over an AST, you write a **generator function** where each `yield*` expression triggers a combinator against the remaining document nodes. The generator's return value becomes the parsed object.

```typescript
*parse(doc) {
  const fm = yield* doc.frontmatter();
  const title = yield* doc.consume(heading(1));
  return { title: inlineText(title.children), meta: fm };
}
```

This reads as:

1. Get the frontmatter.
2. Consume the first H1 heading.
3. Return an object with the title text and frontmatter.

The datamark() factory [#the-datamark-factory]

`datamark(config)` wraps your generator into a `Format<T>` with four methods:

| Method            | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `parse(content)`  | Run the parse generator, validate against schema    |
| `stringify(data)` | Run the emit generator, produce Markdown            |
| `trace(content)`  | Step-by-step log of what each combinator consumed   |
| `test()`          | Validate configured examples against parse + schema |

How yield* works [#how-yield-works]

Inside the generator, `yield*` is the syntax for delegating to another generator. datamark's combinators return `Yieldable<T>` values — objects that carry a `_tag` and executable logic.

When the runner sees a `Yieldable`, it:

1. Extracts the combinator name (e.g. `heading(1)`)
2. Runs the combinator against `remaining` nodes
3. Returns `{ value, remaining }` back into your generator
4. Your generator receives `value` and continues

<Callout type="info">
  If a combinator fails (returns `null`), the runner throws a `TemplateParseError` with the position in the original Markdown.
</Callout>

The emit runner [#the-emit-runner]

The stringify generator works the same way but in reverse. It receives an `EmitContext` and a data object, then uses `yield*` with emit combinators to build nodes:

```typescript
*stringify(doc, data) {
  yield* doc.emitFrontmatter({ id: data.id });
  yield* heading(1, data.title);
  yield* markdown(data.body);
}
```

The emit runner collects nodes into an array, then serializes the document with `stringify(doc)`.

Sub-context parsing with generators [#sub-context-parsing-with-generators]

For documents split into sections (e.g. H2-delimited steps), pass a generator as the second argument to `consume()` to run it on each chunk:

```typescript
const steps = yield* doc.consume(splitByCombinator(heading(2)), function* (subdoc) {
  const h2 = yield* subdoc.consume(heading(2));
  const body = yield* subdoc.consume(rest());
  return {
    title: inlineText(h2.children),
    description: textContent(body),
  };
});
// steps is fully typed Step[] — no manual mapping needed
```

`splitByCombinator(heading(2))` returns `BlockNode[][]`, so the generator runs once per chunk and the results are collected into an array. For flat combinators (like `until(heading(2))`), the generator runs once on a single sub-context.

Why generators? [#why-generators]

Generators let us pause execution between each combinator, inspect what was consumed, and inject synthetic values for tracing. They also read naturally: the code looks like a step-by-step recipe for consuming a document.

See [Combinators](/docs/explanation/combinators) for how individual combinators work.
