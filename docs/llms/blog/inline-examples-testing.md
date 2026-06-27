

import { Callout } from 'fumadocs-ui/components/callout';

The hardest part of maintaining a parser is not writing it — it's keeping it correct as the input format evolves. datamark solves this by making formats **self-documenting and self-testing**.

Inline examples [#inline-examples]

Every format can carry examples right in its definition:

```typescript
const PlanFormat = datamark({
  examples: [
    {
      text: `---\nid: plan-001\n---\n# Roadmap\n\n## Step\n\nSetup.`,
      data: { id: "plan-001", title: "Roadmap", steps: [{ description: "Setup.", scripts: [] }] },
    },
  ],
  // ...
});
```

These examples serve three purposes:

1. **Documentation** — `.docs()` includes them in generated docs
2. **Testing** — `.test()` validates them automatically
3. **Specification** — they act as executable contracts for what the format accepts

test() in practice [#test-in-practice]

Running `PlanFormat.test()` does two things for each example:

1. Parse the `text` and compare the output to `data`
2. If a schema is provided, validate the parsed result against it

If either step fails, you get a clear error:

```
Example 0 failed: Output mismatch.
Expected:
{ "id": "plan-001", "title": "Roadmap" }

Actual:
{ "id": "plan-001", "title": "Roadmap", "steps": [] }
```

<Callout type="info">
  Examples with only `text` (no `data`) are checked for parseability. This is useful for smoke-testing edge cases without asserting exact output.
</Callout>

CI integration [#ci-integration]

Add a test file that imports all your formats and runs `.test()`:

```typescript
import { PlanFormat } from "./formats/plan";
import { BlogFormat } from "./formats/blog";

const formats = [PlanFormat, BlogFormat];

let failed = false;
for (const format of formats) {
  const result = format.test();
  if (!result.passed) {
    failed = true;
    console.error(`${format} failed:`);
    for (const f of result.failures) {
      console.error(`  Example ${f.exampleIndex}: ${f.error}`);
    }
  }
}

if (failed) process.exit(1);
```

Now every pull request validates that your formats still parse the documents they claim to support.

Regression prevention [#regression-prevention]

When someone opens a PR that changes how `splitBy` works, your examples catch it. When you add a new combinator, you add an example. When a user reports a bug, you add a failing example first, then fix it.

Inline examples turn format definitions from static code into living specifications.
