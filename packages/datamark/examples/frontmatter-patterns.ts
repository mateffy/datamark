import { parse, datamark } from "../src/index";
import { textContent, inlineText } from "../src/parse";
import { heading, paragraph } from "../src/stringify";
import * as z from "zod";

// Pattern: frontmatter-only format
export const ConfigFormat = datamark({
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
export const OptionalFrontmatterFormat = datamark({
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
export const configDoc = `---
name: my-app
version: "1.0.0"
features:
  - auth
  - api
---

This app does things.
`;

export const titledDoc = `---
title: Hello World
---

Body here.
`;

export const untitledDoc = `# Fallback Title\n\nBody here.`;
