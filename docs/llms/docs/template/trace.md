

`trace(content)` runs your parse generator against a document and records every combinator call, what it consumed, and where in the source it happened.

Usage [#usage]

```typescript
const trace = PlanFormat.trace(markdown);

console.log(trace.result); // final parsed object
console.log(trace.steps.length); // number of steps
```

TraceStep [#tracestep]

Each step in the trace has:

| Property      | Type                                              | Description                                     |
| ------------- | ------------------------------------------------- | ----------------------------------------------- |
| `type`        | `"frontmatter" \| "consume" \| "peek" \| "error"` | What kind of step                               |
| `combinator`  | `string`                                          | Human-readable name, e.g. `heading(1)`          |
| `description` | `string?`                                         | User-provided description from `.description()` |
| `examples`    | `string[]?`                                       | User-provided examples from `.examples()`       |
| `matched`     | `unknown`                                         | The value produced                              |
| `consumed`    | `BlockNode[]`                                     | Raw nodes consumed                              |
| `region`      | `SourceSpan`                                      | Start/end position in original Markdown         |

Example [#example]

```typescript
for (const step of trace.steps) {
  console.log(`${step.combinator} consumed ${step.consumed.length} nodes`);
  console.log(`  at line ${step.region.start.line}`);
}
```

Debugging failed parses [#debugging-failed-parses]

When a format fails on a new document, `trace()` shows you exactly which combinator ran out of nodes. Look at the last successful step and the `remaining` nodes after it to understand what the format expected vs. what the document contained.
