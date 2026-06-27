

import { Callout } from 'fumadocs-ui/components/callout';

datamark does not bundle a validator. Instead, it implements the **Standard Schema v1** interface, a cross-library specification that Zod, Valibot, ArkType, TypeBox, and others support.

Standard Schema v1 [#standard-schema-v1]

Any object with a `~standard` property implementing the spec can be passed as a schema:

```typescript
import { datamark } from "datamark";
import { textContent } from "datamark/parse";
import { ValidationError } from "datamark/parse";
import * as z from "zod";

// Standard Schema v1 example
const MyFormat = datamark({
  schema: z.object({ name: z.string(), age: z.number() }),
  parse(doc) {
    return { name: "Ada", age: 30 };
  },
});

// Frontmatter validation example
const BlogFormat = datamark({
  frontmatterSchema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
  }),
  schema: z.object({ meta: z.any(), body: z.string() }),
  parse(doc) {
    const meta = doc.frontmatter;
    const body = textContent(doc.root).trim();
    return { meta, body };
  },
});

// Sample documents
const validBlogDoc = `---
title: Hello
date: 2024-01-01
author: Ada
---

Body content here.
`;

const badAgeDoc = "# Hello\n\nBody";
const badFrontmatterDoc = `---
title: 123
---

# Hello`;
```

```typescript
const result = MyFormat.parse(markdown);
// result is typed as { name: string; age: number }
```

Frontmatter validation [#frontmatter-validation]

Formats can validate frontmatter separately from the output schema using `frontmatterSchema`:

```typescript
import { datamark } from "datamark";
import { textContent } from "datamark/parse";
import * as z from "zod";

const BlogFormat = datamark({
  frontmatterSchema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
  }),
  schema: z.object({ meta: z.any(), body: z.string() }),

  parse(doc) {
    const meta = doc.frontmatter; // already validated
    const body = textContent(doc.root).trim();
    return { meta, body };
  },
});
```

When `frontmatterSchema` is provided, frontmatter is validated before your `parse` function runs. If it fails, you get a `ValidationError` with clear path information.

Validation in the parse pipeline [#validation-in-the-parse-pipeline]

When a schema is provided, `parse()` validates the return value automatically. If validation fails, it throws `ValidationError` with structured issue data:

```typescript
import { ValidationError } from "datamark/parse";

try {
  BlogFormat.parse("---\ntitle: 123\n---\n\n# Hello");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.issues);
    // [{ message: "Expected string, received number", path: ["title"] }]
  }
}
```

<Callout type="warn">
  Asynchronous schema validation is not supported. Use synchronous validators like Zod or Valibot.
</Callout>

Supported validators [#supported-validators]

| Library | Status                   |
| ------- | ------------------------ |
| Zod     | ✅ Supported              |
| Valibot | ✅ Supported              |
| ArkType | ✅ Supported              |
| TypeBox | ✅ Supported              |
| Yup     | ❌ Not Standard Schema v1 |
| Joi     | ❌ Not Standard Schema v1 |
