

import { Callout } from 'fumadocs-ui/components/callout';

Your `parse` function receives a `Document` and returns typed data. This page covers the common patterns for walking the tree and extracting structured content.

The document structure [#the-document-structure]

```typescript
import { parse } from "datamark";

const doc = parse(markdown);
// doc.frontmatter — parsed YAML or null
// doc.root — SectionNode containing the full tree
```

```typescript
import { parse, datamark } from "datamark";
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
} from "datamark/parse";
import * as z from "zod";

// Sample document for pattern demonstrations
const doc = parse(`---
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
const rootSection = doc.root.children.find(
  (n) => n.type === "section"
) as any;
const topSections = rootSection?.children?.filter(
  (n: any) => n.type === "section"
) ?? [];

const firstH1 = find(doc.root, (n) => isHeading(n, 1));
const h2Sections = sectionsAtDepth(doc.root, 2);
const paramSections = sectionsByHeading(doc.root, "Parameters");

// Walking subsections
const subSections = rootSection?.children?.filter(
  (n: any) => n.type === "section"
) ?? [];

// Extracting structured data
const jsonBlocks = findAll(doc.root, (n) => isCodeBlock(n, "json"));
const allCode = findAll(doc.root, (n) => isCodeBlock(n));

// Lists
const lists = findAll(doc.root, (n) => n.type === "list") as any[];

// Tables
const tables = findAll(doc.root, (n) => n.type === "table") as any[];
const tableHeaders =
  tables[0]?.children[0]?.children.map((c: any) =>
    inlineText(c.children)
  ) ?? [];

// Inline text
const introPara = rootSection?.children?.find(
  (n: any) => n.type === "paragraph"
) as any;
const introText = introPara ? inlineText(introPara.children) : "";

// Recursive text
const allText = textContent(doc.root).trim();

// Todo items
const todos = extractTodoItems(doc.root);

// Positions
const titleHeading = find(doc.root, (n) => isHeading(n, 1));
const titleLine = titleHeading?.position?.start.line;

// Splitting — flatten first since splitBy operates on flat BlockNode[]
const flatBlocks = [...doc.root.children];
const groups = splitBy(flatBlocks, (n) => isHeading(n, 2));
const afterAuth = after(flatBlocks, (n) => isHeading(n, 2));
const beforeParams = before(flatBlocks, (n) => isHeading(n, 2));

// Format using patterns
const ApiFormat = datamark({
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
```

`doc.root` is a `SectionNode` that contains the entire document. Its `children` contains both content nodes (paragraphs, code blocks, lists) and nested `SectionNode`s.

Finding sections [#finding-sections]

The root contains top-level sections as `SectionNode`s in its `children`:

```typescript
import { parse, inlineText } from "datamark/parse";

const doc = parse(markdown);
const rootSection = doc.root.children.find(n => n.type === "section") as SectionNode;
const topSections = rootSection.children.filter(n => n.type === "section") as SectionNode[];

const firstHeading = topSections[0]?.heading;
const title = firstHeading ? inlineText(firstHeading.children) : "";
```

Helper functions [#helper-functions]

```typescript
import { sectionsAtDepth, sectionsByHeading } from "datamark/parse";

// All h2 sections anywhere in the document
const h2s = sectionsAtDepth(doc.root, 2);

// All sections whose heading text is exactly "Parameters"
const paramSections = sectionsByHeading(doc.root, "Parameters");
```

Walking subsections [#walking-subsections]

Each section can contain more sections. Walk them recursively or split by heading:

```typescript
import { parse, inlineText } from "datamark/parse";

const doc = parse(markdown);
const h1 = doc.root.children.find(n => n.type === "section") as SectionNode;
const subSections = h1.children.filter(n => n.type === "section") as SectionNode[];

for (const section of subSections) {
  const heading = inlineText(section.heading!.children).toLowerCase();
  if (heading.includes("description")) {
    // extract description
  }
  if (heading.includes("parameters")) {
    // extract parameters
  }
}
```

Extracting structured data [#extracting-structured-data]

Code blocks as data [#code-blocks-as-data]

Code blocks are the standard way to embed structured data in Markdown. Extract them by language and parse their contents:

```typescript
import { findAll, isCodeBlock } from "datamark/parse";

// All JSON code blocks in a section
const jsonBlocks = findAll(section, n => isCodeBlock(n, "json"));
for (const block of jsonBlocks) {
  const data = JSON.parse(block.value);
}

// All code blocks regardless of language
const allCode = findAll(section, n => isCodeBlock(n));
```

Lists [#lists]

Extract list items and their text:

```typescript
import { findAll, textContent } from "datamark/parse";

const lists = findAll(doc.root, n => n.type === "list") as ListNode[];
for (const list of lists) {
  for (const item of list.children) {
    const text = textContent(item).trim();
    console.log(text);
  }
}
```

Tables [#tables]

```typescript
import { findAll, inlineText } from "datamark/parse";

const tables = findAll(doc.root, n => n.type === "table") as TableNode[];
for (const table of tables) {
  const rows = table.children;
  const headers = rows[0].children.map(c => inlineText(c.children));
  const bodyRows = rows.slice(1).map(row =>
    row.children.map(c => inlineText(c.children))
  );
}
```

Inline text [#inline-text]

`inlineText()` extracts plain text from inline nodes (paragraphs, headings). It handles bold, italic, links, and images:

```typescript
import { parse, inlineText } from "datamark/parse";

const doc = parse(markdown);
const paragraph = doc.root.children.find(n => n.type === "paragraph") as ParagraphNode;
const text = inlineText(paragraph.children);
// "Visit the docs at example.com" — link text is preserved, href is not
```

`textContent()` is the recursive version. It extracts all text from any node:

```typescript
import { textContent } from "datamark/parse";

const section = doc.root.children.find(n => n.type === "section") as SectionNode;
const allText = textContent(section).trim();
```

Todo items [#todo-items]

Use `extractTodoItems()` to find all checkbox items:

```typescript
import { extractTodoItems } from "datamark/parse";

const todos = extractTodoItems(doc.root);
for (const todo of todos) {
  console.log(todo.text, todo.completed);
}
```

Positions and source mapping [#positions-and-source-mapping]

Every node carries an optional `position` with start/end line/column. This is useful for pointing to where an error occurred in the source file:

```typescript
import { find, isHeading } from "datamark/parse";

const heading = find(doc.root, n => isHeading(n, 1));
if (heading?.position) {
  console.log(`Title is on line ${heading.position.start.line}`);
}
```

<Callout type="info">
  Positions are computed relative to the original input string, even when frontmatter is stripped. Error messages point to the right place in your source file.
</Callout>
