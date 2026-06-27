

import { Callout } from 'fumadocs-ui/components/callout';

Frontmatter is YAML metadata between `---` fences at the top of a Markdown file. The Format SDK makes it fully typed and validated.

Reading frontmatter [#reading-frontmatter]

When you call `parse(content)`, frontmatter is extracted and parsed automatically. In a format definition, access it via `doc.frontmatter`:

```typescript
import { datamark } from "datamark";

const MyFormat = datamark({
  parse(doc) {
    const title = doc.frontmatter?.title as string; // Record<string, unknown> — needs cast
    return { title: title ?? "" };
  },
});
```

Without a schema, `doc.frontmatter` is `Record<string, unknown> | null`. Provide a `frontmatterSchema` and it becomes fully typed.

Validating frontmatter [#validating-frontmatter]

Provide a `frontmatterSchema` and `doc.frontmatter` becomes typed:

```typescript
import { datamark } from "datamark";
import * as z from "zod";

const FrontmatterSchema = z.object({
  version: z.string(),
  author: z.string(),
});

const DataSchema = z.object({
  version: z.string(),
  author: z.string(),
  title: z.string(),
});

const FrontmatterFormat = datamark({
  frontmatterSchema: FrontmatterSchema,
  schema: DataSchema,
  parse(doc) {
    const fm = doc.frontmatter;
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? (h1.heading.children[0] as any)?.value ?? "" : "";
    return { version: fm.version, author: fm.author, title };
  },
});

const frontmatterMarkdown = `---
version: 1.0.0
author: Ada
---

# Release Notes`;
```

```typescript
const result = FrontmatterFormat.parse(frontmatterMarkdown);
console.log(result.version); // "1.0.0"
```

<Callout type="info">
  `frontmatterSchema` is validated **before** your `parse` function runs. If the document lacks frontmatter and your schema does not allow `null`, `parse()` throws `ValidationError` immediately. If you need frontmatter to be optional, use an optional schema such as `z.object({ ... }).optional()`.
</Callout>

Pattern: frontmatter-only formats [#pattern-frontmatter-only-formats]

Some formats use frontmatter as the primary data source and treat the body as secondary:

```typescript
import { parse, datamark } from "datamark";
import { textContent, inlineText } from "datamark/parse";
import { heading, paragraph } from "datamark/stringify";
import * as z from "zod";

// Pattern: frontmatter-only format
const ConfigFormat = datamark({
  frontmatterSchema: z.object({
    name: z.string(),
    version: z.string(),
    features: z.array(z.string()),
  }),
  schema: z.object({
    config: z.object({
      name: z.string(),
      version: z.string(),
      features: z.array(z.string()),
    }),
    readme: z.string().optional(),
  }),
  parse(doc) {
    const config = doc.frontmatter;
    const readme = textContent(doc.root).trim() || undefined;
    return { config, readme };
  },
});

// Pattern: optional frontmatter
const OptionalFrontmatterFormat = datamark({
  frontmatterSchema: z.object({ title: z.string() }).nullable(),
  schema: z.object({ title: z.string() }),
  parse(doc) {
    const title =
      doc.frontmatter?.title ??
      inlineText(
        (
          doc.root.children.find((n) => n.type === "section") as any
        )?.heading?.children ?? []
      );
    return { title };
  },
  stringify(data) {
    return heading(data.title) + "\n\n" + paragraph("Body content.") + "\n";
  },
});

// Sample documents
const configDoc = `---
name: my-app
version: "1.0.0"
features:
  - auth
  - api
---

This app does things.
`;

const titledDoc = `---
title: Hello World
---

Body here.
`;

const untitledDoc = `# Fallback Title\n\nBody here.`;
```

```typescript
const result = ConfigFormat.parse(configDoc);
console.log(result.config.name);     // "my-app"
console.log(result.config.version);  // "1.0.0"
console.log(result.readme);          // "This app does things."
```

Pattern: optional frontmatter [#pattern-optional-frontmatter]

Not every document has frontmatter. Handle it gracefully with a nullable schema:

```typescript
const MyFormat = datamark({
  frontmatterSchema: z.object({ title: z.string() }).nullable(),
  parse(doc) {
    const title = doc.frontmatter?.title
      ?? inlineText((doc.root.children.find(n => n.type === "section") as any)?.heading?.children ?? []);
    return { title };
  },
});
```

Error handling [#error-handling]

If the YAML itself is malformed, `parse()` throws `FrontmatterError` before your format runs:

```typescript
import { parse } from "datamark";
import { FrontmatterError } from "datamark/parse";

try {
  parse("---\nbad: [\n---\nBody");
} catch (err) {
  if (err instanceof FrontmatterError) {
    console.error("YAML is broken:", err.message);
  }
}
```

If the YAML is valid but does not match your `frontmatterSchema`, you get `ValidationError` with structured issue data:

```typescript
import { ValidationError } from "datamark/parse";

try {
  BlogFormat.parse("---\ntitle: 123\n---\n# Hello"); // title should be string
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.issues);
    // [{ message: "Expected string, received number", path: ["title"] }]
  }
}
```
