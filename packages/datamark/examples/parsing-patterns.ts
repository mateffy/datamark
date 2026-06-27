import { parse, datamark } from "../src/index";
import {
  find,
  findAll,
  isHeading,
  isCodeBlock,
  sectionsAtDepth,
  sectionsByHeading,
  splitBy,
  between,
  after,
  before,
  inlineText,
  textContent,
  extractTodoItems,
} from "../src/parse";
import * as z from "zod";

// Sample document for pattern demonstrations
export const doc = parse(`---
title: API Reference
---

# API Reference

Introduction paragraph.

## Authentication

Use Bearer tokens.

\`\`\`json
{ "token": "abc123" }
\`\`\`

## Endpoints

### GET /users

Returns a list of users.

### POST /users

Creates a user.

## Parameters

| Name | Type |
|------|------|
| id   | number |

## Action Items

- [ ] Write tests
- [x] Update docs

Final paragraph.`);

// Finding sections
export const rootSection = doc.root.children.find(
  (n) => n.type === "section"
) as any;
export const topSections = rootSection?.children?.filter(
  (n: any) => n.type === "section"
) ?? [];

export const firstH1 = find(doc.root, (n) => isHeading(n, 1));
export const h2Sections = sectionsAtDepth(doc.root, 2);
export const paramSections = sectionsByHeading(doc.root, "Parameters");

// Walking subsections
export const subSections = rootSection?.children?.filter(
  (n: any) => n.type === "section"
) ?? [];

// Extracting structured data
export const jsonBlocks = findAll(doc.root, (n) => isCodeBlock(n, "json"));
export const allCode = findAll(doc.root, (n) => isCodeBlock(n));

// Lists
export const lists = findAll(doc.root, (n) => n.type === "list") as any[];

// Tables
export const tables = findAll(doc.root, (n) => n.type === "table") as any[];
export const tableHeaders =
  tables[0]?.children[0]?.children.map((c: any) =>
    inlineText(c.children)
  ) ?? [];

// Inline text
export const introPara = rootSection?.children?.find(
  (n: any) => n.type === "paragraph"
) as any;
export const introText = introPara ? inlineText(introPara.children) : "";

// Recursive text
export const allText = textContent(doc.root).trim();

// Todo items
export const todos = extractTodoItems(doc.root);

// Positions
export const titleHeading = find(doc.root, (n) => isHeading(n, 1));
export const titleLine = titleHeading?.position?.start.line;

// Splitting — flatten first since splitBy operates on flat BlockNode[]
export const flatBlocks = [...doc.root.children];
export const groups = splitBy(flatBlocks, (n) => isHeading(n, 2));
export const afterAuth = after(flatBlocks, (n) => isHeading(n, 2));
export const beforeParams = before(flatBlocks, (n) => isHeading(n, 2));

// Format using patterns
export const ApiFormat = datamark({
  schema: z.object({
    title: z.string(),
    endpoints: z.array(z.string()),
    todos: z.array(z.object({ text: z.string(), completed: z.boolean() })),
  }),
  parse(parsedDoc) {
    const title = inlineText(
      (parsedDoc.root.children.find((n) => n.type === "section") as any)
        ?.heading?.children ?? []
    );
    const endpointSection = sectionsByHeading(parsedDoc.root, "Endpoints")[0];
    const endpoints = endpointSection
      ? (findAll(endpointSection, (n) => n.type === "heading") as any[]).map(
          (h) => inlineText(h.children)
        )
      : [];
    return { title, endpoints, todos: extractTodoItems(parsedDoc.root) };
  },
});
