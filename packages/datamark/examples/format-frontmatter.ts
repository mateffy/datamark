import { datamark } from "../src/index";
import * as z from "zod";

export const FrontmatterSchema = z.object({
  version: z.string(),
  author: z.string(),
});

export const DataSchema = z.object({
  version: z.string(),
  author: z.string(),
  title: z.string(),
});

export const FrontmatterFormat = datamark({
  frontmatterSchema: FrontmatterSchema,
  schema: DataSchema,
  parse(doc) {
    const fm = doc.frontmatter;
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? (h1.heading.children[0] as any)?.value ?? "" : "";
    return { version: fm.version, author: fm.author, title };
  },
});

export const frontmatterMarkdown = `---
version: 1.0.0
author: Ada
---

# Release Notes`;
