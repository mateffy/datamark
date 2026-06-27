import { datamark } from "../src/index";
import { inlineText } from "../src/parse";
import { frontmatter, paragraph } from "../src/stringify";
import * as z from "zod";

export const BlogFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
});

export const BlogPostSchema = z.object({
  meta: BlogFrontmatterSchema,
  body: z.string(),
});

export const BlogPostFormat = datamark({
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

export const blogPostMarkdown = `---
title: Hello World
date: 2026-05-30
author: Ada
tags: [typescript, markdown]
---

This is the first paragraph of the blog post.

## Subheading

More content here with **bold** text and a [link](https://example.com).`;
