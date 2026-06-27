

import { Callout } from 'fumadocs-ui/components/callout';

This example shows a minimal format that extracts a title and body from a Markdown document. It uses the Parse SDK (`inlineText`, `textContent`) for parsing and the stringify subpath (`heading`, `paragraph`) for serialization.

```typescript
import { datamark } from "datamark";
import { inlineText, textContent } from "datamark/parse";
import { heading, paragraph } from "datamark/stringify";
import * as z from "zod";

const BasicSchema = z.object({
  title: z.string(),
  body: z.string(),
});

const BasicFormat = datamark({
  schema: BasicSchema,

  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? inlineText(h1.heading.children) : "";
    // Get body from the first paragraph inside the top section, excluding the heading
    const firstPara = h1?.children?.find((n: any) => n.type === "paragraph");
    const body = firstPara ? inlineText(firstPara.children) : "";
    return { title, body };
  },

  stringify(data) {
    return heading(data.title) + "\n\n" + paragraph(data.body) + "\n";
  },
});

const basicMarkdown = "# Hello\n\nThis is the body.";
```

```typescript
const result = BasicFormat.parse("# Hello\n\nThis is the body.");
console.log(result.title); // "Hello"
console.log(result.body); // "This is the body."

const markdown = BasicFormat.stringify(result);
```

Key concepts [#key-concepts]

* **`inlineText()`** and **`textContent()`** from the Parse SDK extract text from the parsed tree
* **`heading()`** and **`paragraph()`** from `datamark/stringify` build Markdown strings — no manual interpolation
* The Format SDK wraps AST traversal + serialization into a typed, reusable object
