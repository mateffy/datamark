

`test()` validates all configured examples against your parse generator and schema. It is designed to be run in CI to prevent format drift.

Usage [#usage]

```typescript
const result = PlanFormat.test();

console.log(result.passed); // boolean
console.log(result.failures); // TestFailure[]
```

FormatExample [#formatexample]

Examples can be strings or objects:

```typescript
const PlanFormat = datamark({
  examples: [
    // Just check parseability
    "---\nid: a\n---\n# Title",

    // Check parseability + exact output
    {
      text: "---\nid: a\n---\n# Title",
      data: { id: "a", title: "Title" },
    },
  ],
  // ...
});
```

TestFailure [#testfailure]

When a test fails:

| Property       | Type                      | Description                  |
| -------------- | ------------------------- | ---------------------------- |
| `exampleIndex` | `number`                  | Which example failed         |
| `example`      | `string \| FormatExample` | The original example         |
| `error`        | `string`                  | Human-readable error message |

CI script [#ci-script]

```typescript
import { PlanFormat } from "./formats/plan";

if (import.meta.main) {
  const result = PlanFormat.test();
  if (!result.passed) {
    for (const f of result.failures) {
      console.error(`Example ${f.exampleIndex} failed: ${f.error}`);
    }
    process.exit(1);
  }
  console.log("All format examples passed.");
}
```

This keeps your format definitions self-documenting, self-testing, and regression-proof.
