

import { Callout } from 'fumadocs-ui/components/callout';

The hardest part of maintaining a parser is keeping it correct as the input format evolves. datamark solves this by making formats **self-documenting and self-testing** with inline examples.

Inline examples [#inline-examples]

Every format can carry examples right in its definition:

```typescript
import { datamark } from "datamark";
import { inlineText } from "datamark/parse";

const TestedFormat = datamark({
  examples: [
    { text: "# Hello", data: { title: "Hello" } },
    { text: "# World\n\nbody", data: { title: "World" } },
  ],
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    return { title: h1 ? inlineText(h1.heading.children) : "" };
  },
});
```

```typescript
const result = TestedFormat.test();
if (!result.passed) {
  for (const failure of result.failures) {
    console.error(`Example ${failure.exampleIndex}: ${failure.error}`);
  }
}
```

Examples serve three purposes:

1. **Documentation** — `.docs()` includes them in generated docs
2. **Testing** — `.test()` validates them automatically
3. **Specification** — they act as executable contracts for what the format accepts

Running tests [#running-tests]

Call `.test()` to validate all examples. For each example, `.test()`:

1. Parses the `text`
2. Validates frontmatter against `frontmatterSchema` (if configured)
3. Runs your `parse` function
4. Validates the output against `schema` (if configured)
5. If `data` is provided, compares for exact equality

For each example, `.test()`:

1. Parses the `text`
2. Validates frontmatter against `frontmatterSchema` (if configured)
3. Runs your `parse` function
4. Validates the output against `schema` (if configured)
5. If `data` is provided, compares for exact equality

Frontmatter validation in tests [#frontmatter-validation-in-tests]

When `frontmatterSchema` is configured, `.test()` validates frontmatter before running `parse`:

```typescript
import { datamark } from "datamark";
import * as z from "zod";

const BlogFormat = datamark({
  frontmatterSchema: z.object({ title: z.string() }),
  examples: [
    {
      text: "---\ntitle: Hello\n---\n\n# Hello",
      data: { title: "Hello" },
    },
  ],
  parse(doc) {
    return { title: doc.frontmatter.title };
  },
});

BlogFormat.test(); // validates frontmatter automatically
```

CI integration [#ci-integration]

Add a single test file that imports all your formats:

```typescript
import { PlanFormat } from "./formats/plan";
import { BlogFormat } from "./formats/blog";

const formats = [PlanFormat, BlogFormat];
let failed = false;

for (const format of formats) {
  const result = format.test();
  if (!result.passed) {
    failed = true;
    console.error(format.docs().description ?? "Unknown format");
    for (const f of result.failures) {
      console.error(`  Example ${f.exampleIndex}: ${f.error}`);
    }
  }
}

if (failed) process.exit(1);
```

Now every pull request validates that your formats still parse the documents they claim to support.

Regression prevention [#regression-prevention]

When someone opens a PR that changes how you extract todo items, your examples catch it. When you add a new format, you add an example. When a user reports a bug, you add a failing example first, then fix it.

Inline examples turn format definitions from static code into living specifications.
