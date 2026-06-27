

import { Callout } from 'fumadocs-ui/components/callout';

This example parses a blog post with frontmatter metadata and body content. The frontmatter is fully typed via `frontmatterSchema`. AST utilities (`textContent`) extract the body, and stringify primitives (`frontmatter`, `paragraph`) reconstruct the Markdown.

```typescript
import { datamark } from "datamark";
import { inlineText } from "datamark/parse";
import { frontmatter, paragraph } from "datamark/stringify";
import * as z from "zod";

const BlogFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
});

const BlogPostSchema = z.object({
  meta: BlogFrontmatterSchema,
  body: z.string(),
});

const BlogPostFormat = datamark({
  frontmatterSchema: BlogFrontmatterSchema,
  schema: BlogPostSchema,

  parse(doc) {
    // Collect all paragraph text recursively, excluding headings
    const paragraphs: string[] = [];
    function walk(node: any) {
      if (node.type === "paragraph") {
        paragraphs.push(inlineText(node.children));
      }
      if (node.children) {
        for (const child of node.children) {
          walk(child);
        }
      }
    }
    walk(doc.root);
    return { meta: doc.frontmatter, body: paragraphs.join("\n\n").trim() };
  },

  stringify(data) {
    const paragraphs = data.body.split("\n\n").map((p) => paragraph(p));
    return frontmatter(data.meta) + paragraphs.join("\n\n") + "\n";
  },
});

const blogPostMarkdown = `---
title: Hello World
date: 2026-05-30
author: Ada
tags: [typescript, markdown]
---

This is the first paragraph of the blog post.

## Subheading

More content here with **bold** text and a [link](https://example.com).`;
```

```typescript
const result = BlogPostFormat.parse(blogPostMarkdown);
console.log(result.meta.title); // "Hello World"
console.log(result.body); // full body text
```

Key concepts [#key-concepts]

* **`frontmatterSchema`** validates and types `doc.frontmatter` — no `as any` needed
* **`textContent()`** from the Parse SDK recursively extracts all text from the document tree
* **`frontmatter()`** from `datamark/stringify` serializes metadata back to YAML with proper escaping
