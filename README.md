# datamark

A Markdown structure toolkit for TypeScript. Parse Markdown into a typed AST, query and slice it with utility functions, validate frontmatter with any Standard Schema compliant validator, and serialize back to Markdown — with full roundtrip fidelity.

**Two dependencies. Zero compromise.**
Built on [`marked`](https://marked.js.org/) (zero dependencies) and [`yaml`](https://eemeli.org/yaml/) (zero dependencies).

## Why datamark?

Structured data is usually stored as JSON or YAML. That works fine for machines, but falls apart when the data contains large amounts of text — multiline descriptions, step-by-step instructions, conversation messages. Serialized to JSON, those become escaped strings with `\n` everywhere, hostile to version control diffs and impossible to read at a glance.

Markdown is the natural solution. It renders beautifully in every editor and on every platform, handles long-form text without escaping, and has a clear, human-readable structure that even LLMs parse reliably.

**datamark is the toolkit for building those Markdown-native formats.**

It gives you a typed AST and a set of utility functions for slicing, querying, and re-serializing Markdown documents. You define the conventions — which heading level marks a section, which code block language carries structured data, what the frontmatter schema looks like — and datamark handles the parsing, validation, and serialization.

### Ideal use cases

- **AI agent tooling** — store LLM sessions, plan files, and workflow state as Markdown. The structure is robust enough that even an LLM editing the file can't easily break the parser.
- **Plan & task files** — H2 headings as plan steps, list items as todos. Walk through steps programmatically; the agent edits the same file.
- **Conversation threads** — H2 headings as message turns, `---` as content block separators, `json tool` code blocks as structured tool call metadata.
- **Specification documents** — YAML frontmatter for metadata, hierarchical headings for sections, embedded code blocks for examples.
- **Any domain format where human readability matters** — configuration, documentation, changelogs.

## Installation

```bash
npm install datamark
# or
bun add datamark
```

TypeScript-first with no build step required.

## Quick start

Use the **template system** to declaratively parse Markdown into typed objects and serialize them back:

```typescript
import { datamark, heading, codeBlock, splitBy, markdown, todoItem } from "datamark";
import * as z from "zod";

const PlanFormat = datamark({
  schema: z.object({
    id: z.string(),
    title: z.string(),
    steps: z.array(z.object({
      description: z.string(),
      scripts: z.array(z.string()),
      tasks: z.array(z.object({ text: z.string(), completed: z.boolean() })),
    })),
  }),

  *parse(doc) {
    const fm = yield* doc.consumeFrontmatter();
    const titleNode = yield* doc.consume(heading(1));
    const sections = yield* doc.consume(splitBy(heading(2)));

    const steps = sections.map((section) => {
      const scripts = section
        .filter((n) => n.type === "code")
        .map((n: any) => n.value);

      const tasks = section
        .filter((n) => n.type === "list")
        .flatMap((list: any) =>
          list.items
            .filter((item: any[]) => {
              const first = item[0];
              if (!first || first.type !== "paragraph") return false;
              const text = first.children
                .map((c: any) => (c.type === "text" ? c.value : ""))
                .join("");
              return /^\[[ xX]\]\s/.test(text);
            })
            .map((item: any[]) => {
              const first = item[0]!;
              const text = first.children
                .map((c: any) => (c.type === "text" ? c.value : ""))
                .join("");
              const match = text.match(/^\[([ xX])\]\s?(.*)$/);
              return {
                text: match?.[2] ?? text,
                completed: (match?.[1] ?? "").toLowerCase() === "x",
              };
            })
        );

      const otherNodes = section.filter(
        (n) => n.type !== "code" && n.type !== "list" && n.type !== "heading"
      );
      const description = otherNodes
        .map((n: any) => ("value" in n ? n.value : ""))
        .join("\n")
        .trim();

      return { description, scripts, tasks };
    });

    return {
      id: (fm as any)?.id ?? "",
      title: titleNode.children.map((c: any) => c.value).join(""),
      steps,
    };
  },

  *stringify(doc, data) {
    yield* doc.emitFrontmatter({ id: data.id, title: data.title });
    yield* heading(1, data.title);

    for (const step of data.steps) {
      yield* heading(2, "Step");
      if (step.description) yield* markdown(step.description);
      for (const s of step.scripts) yield* codeBlock("javascript", s);
      for (const t of step.tasks) yield* todoItem(t.text, t.completed);
    }
  },
});

// Parse
const doc = PlanFormat.parse(`---
id: PLAN-001
title: Migration Plan
---

# Migration Plan

## Step 1

\`\`\`javascript
console.log("hello");
\`\`\`

- [ ] Set up environment

## Step 2

- [x] Deploy
`);

// doc is fully typed: { id: string; title: string; steps: [...] }

// Serialize back
const md = PlanFormat.stringify(doc);
```

The template system uses generator functions with `yield*` to consume the document sequentially. Each combinator advances a cursor through the Markdown tree, and the generator's `return` value becomes the typed, schema-validated result.

## Template system

The template system is built on three concepts: **parse**, **emit**, and **datamark**.

### `parse(generator)`

Create a parser from a generator function. The generator receives a `ParseContext` and uses combinators with `yield*` to consume the document.

```typescript
import { parse, heading, codeBlock, optional, many, splitBy, rest } from "datamark";

const myParser = parse(function* (doc) {
  const fm = yield* doc.consumeFrontmatter();
  const h1 = yield* doc.consume(heading(1));
  const sections = yield* doc.consume(splitBy(heading(2)));
  const restNodes = yield* doc.consume(rest());

  return { title: h1.children.map((c: any) => c.value).join(""), sections };
});

const result = myParser(markdownString);
```

### `emit(generator)`

Create a stringifier from a generator function. The generator receives an `EmitContext` and the data object, then builds the output document.

```typescript
import { emit, heading, codeBlock, markdown, todoItem } from "datamark";

const myStringifier = emit(function* (doc, data: { title: string; code: string }) {
  yield* heading(1, data.title);
  yield* codeBlock("typescript", data.code);
});

const md = myStringifier({ title: "Hello", code: "const x = 1;" });
```

### `datamark({ schema?, parse, stringify? })`

Combine parse and emit generators into a reusable format. When a schema is provided, parsed results are validated automatically.

```typescript
const Format = datamark({
  schema: MySchema,

  *parse(doc) {
    ...
    return parsedObject;
  },

  *stringify(doc, data) {
    ...
  },
});

Format.parse(content);   // → typed object
Format.stringify(data);  // → markdown string
```

### Documenting combinators

Attach `.description()` and `.examples()` to any `consume()` call. These are picked up by `Format.docs()` and `Format.trace()` to produce human-readable documentation and visualizations.

```typescript
*parse(doc) {
  const fm = yield* doc.consumeFrontmatter()
    .description("YAML frontmatter with plan metadata");
  const title = yield* doc.consume(heading(1))
    .description("Plan title from first H1 heading")
    .examples(["# Migration Plan"]);
  const sections = yield* doc.consume(splitBy(heading(2)))
    .description("Steps split by H2 headings");
  ...
}
```

### `Format.trace(markdown)`

Trace how a specific document is consumed step-by-step. Returns the parsed AST with source positions, a log of every combinator call, and the final parsed object.

```typescript
const trace = PlanFormat.trace(planMarkdown);

// trace.document   — full AST with line/column positions
// trace.steps      — [{ type, combinator, description, consumed, region, matched }]
// trace.result     — the parsed object

// Example: highlight which lines map to which fields
for (const step of trace.steps) {
  console.log(`${step.combinator}: lines ${step.region.start.line}–${step.region.end.line}`);
}
```

### `Format.docs()`

Generate static documentation for the format itself — no document needed. Returns combinator descriptions, examples, and schema info derived from the parse generator metadata.

```typescript
const docs = PlanFormat.docs();
// {
//   description: "A plan document with frontmatter and H2-delimited steps.",
//   examples: [...],
//   steps: [
//     { combinator: "consumeFrontmatter", description: "YAML frontmatter..." },
//     { combinator: "heading(1)", description: "Plan title...", examples: ["# Migration Plan"] },
//   ],
//   schema: { ... } // if a Standard Schema was configured
// }
```

### `Format.test()`

Validate all configured examples against the parse generator + schema.

```typescript
const result = PlanFormat.test();
// result.passed   → true if all examples pass
// result.failures → [{ exampleIndex, error }] for any mismatches
```

Configure examples at format creation:

```typescript
const PlanFormat = datamark({
  description: "A plan document...",
  examples: [
    {
      text: "---\nid: PLAN-001\ntitle: Setup\n---\n\n# Setup\n",
      data: { id: "PLAN-001", title: "Setup", steps: [] },
    },
    "---\nid: PLAN-002\ntitle: Deploy\n---\n\n# Deploy\n",
  ],
  *parse(doc) { ... },
});
```

### Parse combinators

Combinators consume nodes from the document and return typed values.

| Combinator | Description |
|-----------|-------------|
| `heading(depth)` | Match and consume a heading at a specific depth |
| `paragraph()` | Match and consume a paragraph |
| `codeBlock({ lang? })` | Match and consume a code block, optionally by language |
| `optional(matcher)` | Make a combinator optional (returns `T \| undefined`) |
| `many(matcher)` | Repeat a combinator until it fails (returns `T[]`) |
| `repeat(count, matcher)` | Repeat a combinator exactly `count` times |
| `until(predicate)` | Consume nodes until a predicate matches |
| `splitBy(predicate)` | Split remaining nodes by a predicate (returns `BlockNode[][]`) |
| `rest()` | Consume all remaining nodes |

### Emit combinators

Combinators that emit nodes into the output document.

| Combinator | Description |
|-----------|-------------|
| `heading(depth, text)` | Emit a heading |
| `paragraph(text)` | Emit a paragraph |
| `codeBlock(lang, code)` | Emit a code block |
| `markdown(text)` | Parse and emit inline Markdown |
| `todoItem(text, completed)` | Emit a todo list item |
| `hr()` | Emit a horizontal rule |

### Parse context

The `ParseContext` object passed to parse generators:

```typescript
doc.consumeFrontmatter()  // → Yieldable<Record<string, unknown> | null>
doc.consume(combinator)   // → Yieldable<T>
doc.remaining             // → BlockNode[] (peek at unconsumed nodes)
```

### Emit context

The `EmitContext` object passed to emit generators:

```typescript
doc.emitFrontmatter(data)  // → Yieldable<void>
doc.emitNode(node)        // → void (emit a raw BlockNode)
```

## Core API (building blocks)

For custom processing or when the template system is not needed, datamark exposes its lower-level building blocks directly.

### Document parsing

```typescript
import { parse, stringify } from "datamark";

const doc = parse(content, {
  frontmatterSchema: MySchema,   // optional Standard Schema validator
  titleProperty: "title",        // frontmatter key for title (default: "title")
  titleFromHeading: true,        // fall back to first H1 (default: true)
});

// doc.frontmatter → typed frontmatter object
// doc.title       → string | null
// doc.children    → BlockNode[]

const md = stringify(doc);  // serialize back to Markdown
```

### Tree utilities

```typescript
import { find, findAll, filter, sections, splitBy, between, after, before, codeBlocks, inlineText, textContent, toMarkdown, isHeading, isCodeBlock, isTodoItem, extractTodoItems } from "datamark";

const h1 = find(doc.children, (n) => isHeading(n, 1));
const allCode = codeBlocks(doc.children);     // CodeNode[] (recursive)
const todos = extractTodoItems(doc.children);  // TodoItem[]
const plain = textContent(doc.children);       // plain text string
```

### Frontmatter and YAML

```typescript
import { extractFrontmatter, parseYaml, stringifyYaml } from "datamark";

const extracted = extractFrontmatter(content);
if (extracted) {
  const data = parseYaml(extracted.frontmatter);
  const body = extracted.body;
}
```

### Validation

```typescript
import { validateData, ValidationError } from "datamark";
import * as z from "zod";

const PlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["pending", "in-progress", "done"]),
});

const data = validateData(PlanSchema, doc.frontmatter);
// data is typed as { id: string; title: string; status: "pending" | "in-progress" | "done" }
```

## Core concepts

### Document

The result of `parse()`:

```typescript
interface Document {
  type: "document";
  frontmatter: Record<string, unknown> | null;
  title: string | null;
  children: BlockNode[];
}
```

### Block nodes

Top-level Markdown constructs:

```typescript
type BlockNode =
  | { type: "heading"; depth: number; children: InlineNode[]; position?: SourceSpan }
  | { type: "paragraph"; children: InlineNode[]; position?: SourceSpan }
  | { type: "code"; lang?: string; meta?: string; value: string; position?: SourceSpan }
  | { type: "blockquote"; children: BlockNode[]; position?: SourceSpan }
  | { type: "hr"; position?: SourceSpan }
  | { type: "list"; ordered: boolean; items: BlockNode[][]; position?: SourceSpan }
  | { type: "table"; header: TableCell[]; rows: TableCell[][]; position?: SourceSpan }
  | { type: "html"; value: string; position?: SourceSpan }
  | { type: "space"; position?: SourceSpan };
```

Note: `code` nodes split the language tag into `lang` and `meta` — so ` ```json tool ``` ` produces `{ lang: "json", meta: "tool" }`. This makes it straightforward to embed named structured payloads inside Markdown documents.

Every node carries an optional `position: { start: { line, column, offset }, end: { line, column, offset } }` tracking its exact location in the original markdown.

### Inline nodes

Text formatting inside headings and paragraphs:

```typescript
type InlineNode =
  | { type: "text"; value: string; position?: SourceSpan }
  | { type: "strong"; children: InlineNode[]; position?: SourceSpan }
  | { type: "em"; children: InlineNode[]; position?: SourceSpan }
  | { type: "codespan"; value: string; position?: SourceSpan }
  | { type: "link"; href: string; title?: string; children: InlineNode[]; position?: SourceSpan }
  | { type: "image"; src: string; title?: string; alt: string; position?: SourceSpan }
  | { type: "del"; children: InlineNode[]; position?: SourceSpan }
  | { type: "br"; position?: SourceSpan }
  | { type: "html"; value: string; position?: SourceSpan }
  | { type: "escape"; value: string; position?: SourceSpan };
```

## API reference

### Template system

| Export | Description |
|--------|-------------|
| `datamark({ schema?, parse, stringify? })` | Create a reusable parse/stringify format |
| `parse(generator)` | Create a parser from a generator function |
| `emit(generator)` | Create a stringifier from a generator function |
| `heading(depth)` / `heading(depth, text)` | Match or emit a heading |
| `paragraph()` / `paragraph(text)` | Match or emit a paragraph |
| `codeBlock({ lang? })` / `codeBlock(lang, code)` | Match or emit a code block |
| `optional(matcher)` | Make a combinator optional |
| `many(matcher)` | Repeat a combinator |
| `repeat(count, matcher)` | Repeat exactly N times |
| `until(predicate)` | Consume until a predicate matches |
| `splitBy(predicate)` | Split nodes by a predicate |
| `rest()` | Consume all remaining nodes |
| `markdown(text)` | Emit parsed Markdown nodes |
| `todoItem(text, completed)` | Emit a todo list item |
| `hr()` | Emit a horizontal rule |
| `.description(text)` | Attach docs to a `yield* doc.consume(...)` call |
| `.examples(texts)` | Attach examples to a consume call |
| `Format.trace(content)` | Trace step-by-step parse of a document |
| `Format.docs()` | Generate static documentation from metadata |
| `Format.test()` | Validate configured examples |
| `Position` / `SourceSpan` | Line/column/offset position tracking on AST nodes |

### Document

| Export | Description |
|--------|-------------|
| `parse(content, options?)` | Parse Markdown into a `Document` |
| `stringify(doc)` | Serialize a `Document` back to Markdown |
| `ParseOptions` | `{ frontmatterSchema?, titleProperty?, titleFromHeading? }` |
| `Document` | `{ type, frontmatter, title, children }` |

### Tree

| Export | Description |
|--------|-------------|
| `parseBody(body)` | Parse a Markdown body into `BlockNode[]` |
| `BlockNode` | Discriminated union of all block-level node types |
| `InlineNode` | Discriminated union of all inline node types |
| `HeadingNode`, `ParagraphNode`, `CodeNode`, ... | Individual node interfaces |

### Tree utilities

| Export | Description |
|--------|-------------|
| `find(nodes, predicate)` | First matching node (recurses into containers) |
| `findAll(nodes, predicate)` | All matching nodes depth-first |
| `filter(nodes, predicate)` | Top-level filter |
| `sections(nodes, { by, level })` | Split into heading-delimited `Section[]` |
| `splitBy(nodes, predicate)` | Split array by separator predicate |
| `between(nodes, start, end)` | Nodes between two predicates (exclusive) |
| `after(nodes, predicate)` | Nodes after first match |
| `before(nodes, predicate)` | Nodes before first match |
| `codeBlocks(nodes)` | All code blocks, recursively |
| `inlineText(nodes)` | Plain text from inline nodes |
| `textContent(nodes)` | Plain text from block nodes |
| `toMarkdown(nodes)` | Serialize block nodes to Markdown |
| `isHeading(node, depth?)` | Type guard for heading nodes |
| `isCodeBlock(node, lang?)` | Type guard for code nodes |
| `isTodoItem(node)` | Type guard for todo list nodes |
| `extractTodoItems(nodes)` | Extract all todo items from nodes |

### Frontmatter and YAML

| Export | Description |
|--------|-------------|
| `extractFrontmatter(content)` | Strict extraction (`---` or `+++` fences) |
| `splitFrontmatter(content)` | Lenient line-scan extraction (`---` only) |
| `parseYaml(content)` | Parse YAML string to a JS value |
| `stringifyYaml(value)` | Serialize a JS value to YAML |
| `FrontmatterError`, `YamlParseError` | Named error classes |

### Validation

| Export | Description |
|--------|-------------|
| `validateData(schema, data)` | Validate against any Standard Schema; throws `ValidationError` |
| `validateFrontmatter(data, schema?)` | Validate frontmatter, or pass through if no schema |
| `ValidationError` | Error with `.issues` array |
| `StandardSchemaV1` | Vendored Standard Schema v1 interface |

## Building a domain format (imperative style)

Here is how you would build a complete AI conversation thread parser on top of datamark primitives:

```typescript
import { parse, sections, splitBy, codeBlocks, inlineText, toMarkdown } from "datamark";
import * as z from "zod";

const ThreadSchema = z.object({
  id: z.string(),
  harness: z.enum(["OPENCODE", "PI"]),
  status: z.enum(["active", "completed"]).default("active"),
});

function parseThread(content: string) {
  const doc = parse(content, { frontmatterSchema: ThreadSchema });

  const messages = sections(doc.children, { by: "heading", level: 2 }).map((section) => {
    const role = section.heading ? inlineText(section.heading.children) : "unknown";

    const blocks = splitBy(section.children, (n) => n.type === "hr").map((part) => {
      const tools = codeBlocks(part).filter((c) => c.lang === "json" && c.meta === "tool");
      if (tools.length > 0) {
        return { type: "toolCall", data: JSON.parse(tools[0]!.value) };
      }
      return { type: "text", text: toMarkdown(part) };
    });

    return { role, blocks };
  });

  return { meta: doc.frontmatter, title: doc.title, messages };
}
```

The resulting format is plain Markdown — readable in any editor, diffable in git, and editable by both humans and LLMs without any special tooling.

## Learn more

- Website: [datamark.md](https://datamark.md)
- Full reference: [datamark.md/docs](https://datamark.md/docs)
- LLM skill file: [datamark.md/skill](https://datamark.md/skill)

## License

MIT
