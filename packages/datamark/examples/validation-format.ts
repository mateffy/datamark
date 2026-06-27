import { datamark } from "../src/index";
import { textContent } from "../src/parse";
import { ValidationError } from "../src/parse";
import * as z from "zod";

// Standard Schema v1 example
export const MyFormat = datamark({
  schema: z.object({ name: z.string(), age: z.number() }),
  parse(doc) {
    return { name: "Ada", age: 30 };
  },
});

// Frontmatter validation example
export const BlogFormat = datamark({
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
export const validBlogDoc = `---
title: Hello
date: 2024-01-01
author: Ada
---

Body content here.
`;

export const badAgeDoc = "# Hello\n\nBody";
export const badFrontmatterDoc = `---
title: 123
---

# Hello`;
