

import { Callout } from 'fumadocs-ui/components/callout';

A "format" in datamark is a typed contract between a Markdown document and a data structure. You define how to parse the document into an object and optionally how to serialize it back.

Step 1: Define your schema [#step-1-define-your-schema]

Start with what you want to extract:

```typescript
import * as z from "zod";

const PlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(z.object({
    description: z.string(),
    scripts: z.array(z.string()),
  })),
});
```

Step 2: Write the parse function [#step-2-write-the-parse-function]

The `parse` function receives a `Document` and returns your data type. Use the section tree and utility functions to extract values:

```typescript
import { datamark } from "datamark";
import { inlineText, textContent, findAll, isCodeBlock } from "datamark/parse";

const PlanFormat = datamark({
  frontmatterSchema: z.object({ id: z.string() }),
  schema: PlanSchema,

  parse(doc) {
    const id = doc.frontmatter.id; // typed as string
    const titleSection = doc.root.children.find(n => n.type === "section") as any;
    const title = titleSection ? inlineText(titleSection.heading.children) : "";

    const steps = titleSection
      ? (titleSection.children.filter(n => n.type === "section") as any[]).map(section => {
          const scripts = findAll(section, n => isCodeBlock(n, "javascript"))
            .map((n: any) => n.value);
          const description = textContent(section).trim();
          return { description, scripts };
        })
      : [];

    return { id, title, steps };
  },
});
```

Step 3: Add stringify [#step-3-add-stringify]

If you want roundtrip support, provide a `stringify` function:

```typescript
stringify(data) {
  let md = `---\nid: ${data.id}\n---\n\n# ${data.title}\n\n`;
  for (const step of data.steps) {
    md += `## Step\n\n${step.description}\n\n`;
    for (const script of step.scripts) {
      md += `\`\`\`javascript\n${script}\n\`\`\`\n\n`;
    }
  }
  return md;
}
```

Step 4: Test with examples [#step-4-test-with-examples]

Add examples to validate your format:

```typescript
const PlanFormat = datamark({
  schema: PlanSchema,
  examples: [
    {
      text: `---\nid: plan-001\n---\n# Q3 Roadmap\n\n## Step\n\nSet up the project.`,
      data: {
        id: "plan-001",
        title: "Q3 Roadmap",
        steps: [{ description: "Set up the project.", scripts: [] }],
      },
    },
  ],
  // parse and stringify...
});

// Run tests
const result = PlanFormat.test();
if (!result.passed) {
  console.log(result.failures);
}
```

Key tools [#key-tools]

| Function                       | Use for                                   |
| ------------------------------ | ----------------------------------------- |
| `doc.root.children`            | Top-level sections and content            |
| `inlineText()`                 | Extract heading/paragraph text            |
| `textContent()`                | Extract all text from a section           |
| `findAll()`                    | Find all matching nodes recursively       |
| `isCodeBlock()`, `isHeading()` | Filter by node type                       |
| `sectionsAtDepth()`            | Find sections at a specific heading depth |

<Callout type="info">
  Formats are plain functions — no generators, no combinators, no special syntax. Just TypeScript and the AST.
</Callout>
