<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/documentation/public/datamark-logo-light.svg">
    <img alt="OpenStorage Logo" src="./packages/documentation/public/datamark-logo.svg" align="center" width="275">
  </picture>
</p>

<br/>
<br/>

# `datamark` – Use Markdown as a Data Format

**datamark** is a TypeScript library for turning Markdown documents into typed, validated objects — and back again. It gives you a **unified AST with a native section tree**, a lightweight **format system** for bidirectional parse/stringify, and typed **Markdown builder primitives** for serialization.


<br>

## Why datamark?

Markdown is everywhere: blogs, changelogs, API docs, READMEs, and more. But Markdown is a text format, not a data format. It can be hard to extract structured data from it, and even harder to write valid Markdown back after partial edits.

- *"Changelogs are hand-written, but we want to validate them and extract structured release data."*
- *"We use frontmatter for blog post metadata, but we need structured data about the sections for table of contents and SEO."*
- *"I want to edit all headings in a Markdown document and reserialize it without losing formatting."*
- *"API docs are Markdown files with code blocks. We want to extract endpoints and examples as typed data."*
- *"I want to make Markdown code snippets executable."*

datamark bridges that gap: you define a format with a frontmatter schema, an output schema, and parse/stringify functions. The resulting data is fully typed and validated, and you can convert it back to Markdown without losing formatting.

| SDK | What it does |
|---|---|
| **Format SDK** | Define `datamark()` formats: typed frontmatter, validated output, bidirectional parse/stringify |
| **Parse SDK** | Parse Markdown into a typed AST with frontmatter, section tree, headings, code blocks, lists, tables, and todos |
| **Stringify SDK** | Build Markdown with typed primitives: `heading()`, `codeBlock()`, `list()`, `frontmatter()`, `paragraph()`, and more |

Bring your own validator. Zod, Valibot, ArkType, TypeBox — anything implementing Standard Schema v1 works out of the box.

---

## Quick start

### 1. Install

```bash
npm install datamark
# or
bun add datamark
```

For validation, also install your schema library:

```bash
npm install zod
```

### 2. Parse your first document

Define a format — frontmatter schema, output schema, parse function:

```typescript
import { datamark } from "datamark";
import { inlineText, textContent, findAll, isCodeBlock } from "datamark/parse";
import { frontmatter, heading, paragraph, codeBlock } from "datamark/stringify";
import * as z from "zod";

export const PlanFormat = datamark({
  frontmatterSchema: z.object({ id: z.string() }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    steps: z.array(z.object({
      description: z.string(),
      scripts: z.array(z.string()),
    })),
  }),

  parse(doc) {
    const id = doc.frontmatter.id; // typed as string
    const titleSection = doc.root.children.find((n) => n.type === "section") as any;
    const title = titleSection ? inlineText(titleSection.heading.children) : "";

    const steps = titleSection
      ? titleSection.children
          .filter((n: any) => n.type === "section")
          .map((section: any) => {
            const scripts = findAll(section, (n) => isCodeBlock(n, "javascript")).map(
              (n: any) => n.value
            );
            const description = textContent(section).trim();
            return { description, scripts };
          })
      : [];

    return { id, title, steps };
  },

  stringify(data) {
    let md = frontmatter({ id: data.id }) + heading(data.title) + "\n\n";
    for (const step of data.steps) {
      md += heading("Step", 2) + "\n\n" + paragraph(step.description) + "\n\n";
      for (const script of step.scripts) {
        md += codeBlock(script, "javascript") + "\n\n";
      }
    }
    return md;
  },
});
```

### 3. Use it

```typescript
const input = `---
id: plan-001
---
# Q3 Roadmap

## Step

Set up the project.

\`\`\`javascript
npm init -y
\`\`\`

## Step

Implement the core features.
`;

let data = PlanFormat.parse(input);
console.log(data.id);     // "plan-001"
console.log(data.title);  // "Q3 Roadmap"
console.log(data.steps[0].description); // "Set up the project."

data.title = "Roadmap for Q3";

const md = PlanFormat.stringify(data);
// Back to Markdown, ready to save
```

---

## What datamark is

- **A typed Markdown parser.** Frontmatter is parsed as YAML. The body becomes a proper AST with headings, paragraphs, code blocks, lists, tables, blockquotes — and a native section tree where H1/H2/H3 are parent nodes, not flat siblings.
- **A format system.** Define `datamark()` with a schema and parse/stringify functions. The result is fully typed and validated.
- **A Markdown builder.** Typed primitives like `heading()`, `codeBlock()`, `list()`, `frontmatter()` — no string concatenation, no indentation bugs.

## What datamark is NOT

- **It is not a static site generator.** It parses and transforms Markdown, but it does not build HTML pages or apply themes.
- **It is not a Markdown renderer.** It produces data and Markdown strings, not HTML.
- **It does not stream.** Input string in, typed object out.
- **It is not a general-purpose parser generator.** It is specifically designed for Markdown documents.

---

## Core concepts

### Section tree

Unlike flat ASTs where headings are just block nodes, datamark nests them. Every heading becomes a `SectionNode` that owns everything beneath it until the next heading of equal or greater depth.

```typescript
import { parse } from "datamark";

const doc = parse(`
# Title

Intro paragraph.

## Section A

Some text.

### Subsection A1

More text.

## Section B

Final text.
`);

const topSection = doc.root.children[0] as any;
console.log(topSection.heading.depth); // 1

const subSections = topSection.children.filter((n: any) => n.type === "section");
console.log(subSections.length); // 2 (Section A and Section B)
```

This makes traversal intuitive: find a section, look inside its `children` for nested sections, code blocks, lists, or paragraphs.

### Frontmatter validation

Frontmatter is validated before your parse function runs. If `frontmatterSchema` is provided, `doc.frontmatter` is typed inside your parse function — no casting needed.

```typescript
const BlogFormat = datamark({
  frontmatterSchema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
  }),
  parse(doc) {
    const meta = doc.frontmatter; // typed as { title, date, author }
    // ...
  },
});
```

If the YAML is malformed, you get `FrontmatterError`. If it fails schema validation, you get `ValidationError` with structured issue data.

### Markdown builder primitives

The Stringify SDK gives you typed functions for every Markdown construct. No more template literal indentation bugs:

```typescript
import { frontmatter, heading, paragraph, codeBlock, list } from "datamark/stringify";

const markdown = [
  frontmatter({ title: "API Guide", version: "2.0" }),
  heading("Authentication", 2),
  paragraph("Use Bearer tokens for all requests."),
  codeBlock("fetch('/api', { headers: { Authorization: 'Bearer ...' } });", "javascript"),
  list(["Install the SDK", "Configure your API key", "Make your first request"]),
].join("\n\n");
```

---

## SDK layers

datamark is three focused SDKs that compose together:

| Layer | Import | Purpose |
|---|---|---|
| **Parse SDK** | `datamark/parse` | Parse documents, extract frontmatter, query the AST with `find`, `findAll`, `textContent`, `extractTodoItems`, `sectionsAtDepth`, `splitBy`, etc. |
| **Format SDK** | `datamark` | Define `datamark()` formats with typed frontmatter, validated output, and bidirectional parse/stringify |
| **Stringify SDK** | `datamark/stringify` | Build Markdown with typed primitives: `heading`, `paragraph`, `codeBlock`, `list`, `blockquote`, `frontmatter`, `strong`, `em`, `link`, etc. |

Use only what you need. If you just want to parse Markdown and query it, import `datamark/parse`. If you want full bidirectional formats, use the Format SDK. If you just need to generate Markdown strings, use the Stringify SDK.

---

## Philosophy

- **Markdown as a data format.** Not just human-readable text — structured, typed, validated data that happens to render everywhere.
- **One definition, two directions.** Define `parse` and `stringify` in the same place. Round-trip by design.
- **Bring your own validator.** Standard Schema v1 means Zod, Valibot, ArkType, TypeBox, and anything else compliant — no lock-in.
- **AST-native section tree.** Headings are parent nodes, not flat siblings. Traversal is intuitive, not imperative.
- **Deterministic.** No global state, no side effects. Same input, same output, every time.

---

## Documentation

| What you need | Link |
|---------------|------|
| Get started in 5 minutes | [Quickstart](https://datamark.md/docs/quickstart) |
| Parse SDK reference | [Parse SDK](https://datamark.md/docs/parse) |
| Stringify SDK reference | [Stringify SDK](https://datamark.md/docs/stringify) |
| Format SDK reference | [Format SDK](https://datamark.md/docs/template) |
| Understand the AST | [AST deep dive](https://datamark.md/docs/explanation/ast) |
| Real-world examples | [Examples](https://datamark.md/docs/examples) |
| Compare to alternatives | [Comparisons](https://datamark.md/compare) |

Full documentation lives at **[datamark.md](https://datamark.md)**.

---

## License

MIT
