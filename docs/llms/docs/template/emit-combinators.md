

Emit combinators add nodes to the output document. They are used with `yield*` inside a `stringify` generator.

Context methods [#context-methods]

doc.emitFrontmatter(data) [#docemitfrontmatterdata]

Set the document's frontmatter. Should be called at most once.

```typescript
yield* doc.emitFrontmatter({ id: data.id, title: data.title });
```

doc.emitNode(node) [#docemitnodenode]

Push a raw `BlockNode` into the output. Use when you need full control.

```typescript
doc.emitNode({
  type: "paragraph",
  children: [{ type: "text", value: "Hello", raw: "Hello" }],
  raw: "Hello",
});
```

Combinators [#combinators]

heading(depth, text) [#headingdepth-text]

Emit a heading.

```typescript
yield* heading(1, data.title);
```

paragraph(text) [#paragraphtext]

Emit a paragraph.

```typescript
yield* paragraph("This is a paragraph.");
```

codeBlock(lang, code) [#codeblocklang-code]

Emit a code block.

```typescript
yield* codeBlock("typescript", "const x = 1;");
```

markdown(text) [#markdowntext]

Parse raw Markdown text and emit the resulting nodes. Useful for injecting user content.

```typescript
yield* markdown(data.description);
```

todoItem(text, completed) [#todoitemtext-completed]

Emit a todo list item.

```typescript
yield* todoItem("Write docs", false);
yield* todoItem("Ship it", true);
```

hr() [#hr]

Emit a horizontal rule.

```typescript
yield* hr();
```

Complete example [#complete-example]

```typescript
*stringify(doc, data) {
  yield* doc.emitFrontmatter({ id: data.id });
  yield* heading(1, data.title);
  yield* markdown(data.intro);
  yield* hr();
  for (const step of data.steps) {
    yield* heading(2, step.name);
    yield* markdown(step.description);
    for (const script of step.scripts) {
      yield* codeBlock("javascript", script);
    }
  }
}
```
