# Unified Node Tree & Section Hierarchy — Implementation Plan

## Context

This project is a markdown processing library (`datamark`) with two packages:
- `packages/datamark/` — the core library
- `packages/documentation/` — the documentation website (uses Fumadocs)

The library currently has two layers:
1. **AST SDK** — parses markdown into a flat tree of `BlockNode`s and `InlineNode`s
2. **Format SDK** — a generator-based combinator system (`yield* doc.consume(heading(1))`) for building reusable file formats

The Format SDK is over-engineered. It solves cursor management (array slicing) with a custom `Yieldable` protocol and ~1100 lines of infrastructure. The user wants to delete it entirely and replace it with a unified tree structure where everything is a `Node` and the section hierarchy (headings as nesting levels) is a native part of the AST.

## Current State

### `packages/datamark/src/`
- `tree.ts` — AST types (`Document`, `BlockNode`, `InlineNode`, `HeadingNode`, etc.) + `parseBody()` which returns `BlockNode[]`
- `tree-utils.ts` — traversal functions (`find`, `findAll`, `filter`, `sections`, `splitBy`, `between`, `after`, `before`, `codeBlocks`, `inlineText`, `textContent`, `toMarkdown`) — all operate on `BlockNode[]`
- `document.ts` — `parse()` returns `Document { children: BlockNode[] }`, `stringify()` serializes back
- `template/` — 7 files (~1100 lines) implementing the generator-based Format SDK
  - `parse.ts` — `heading()`, `paragraph()`, `codeBlock()`, `optional()`, `many()`, `repeat()`, `splitBy()`, `rest()`, `until()`, `section()`, `any()`, `all()`, `except()`, `getCombinator()`, `makeConsumeYieldable()`, `parse()` runner
  - `emit.ts` — `emit()` runner, `heading()`, `paragraph()`, `codeBlock()`, `hr()`, `markdown()`, `todoItem()`
  - `yieldable.ts` — `createYieldable()`, `createEmitYieldable()`, `getYieldableRun()`, `getYieldableEmit()`, `getCombinatorName()`, `getYieldableMeta()`
  - `trace.ts` — `trace()` runner that intercepts combinator calls to produce execution log
  - `docs.ts` — `docs()` runner that runs parse generator against synthetic document to produce documentation
  - `test-runner.ts` — `createTestRunner()` that validates format examples against parse + schema
  - `types.ts` — `Yieldable`, `Combinator`, `ParseContext`, `EmitContext`, `FormatConfig`, `Format`, `ParseTrace`, `TraceStep`, `FormatDocs`, `DocsStep`, `FormatExample`, `TestResult`, `TestFailure`, `TemplateParseError`
- `template/index.ts` — public API, exports everything, defines `datamark()` which wraps parse/stringify/trace/docs/test into a `Format<T>` object
- `index.ts` — public exports from both core and template

### Tests
- `tree.test.ts` — tests `parseBody()` for various markdown elements
- `tree-utils.test.ts` — tests all utility functions on `BlockNode[]`
- `document.test.ts` — tests `parse()`/`stringify()` roundtrip
- `template/parse.test.ts` — tests combinators and parse runner
- `template/index.test.ts` — tests `datamark()` wrapper, format methods, roundtrip
- `index.test.ts` — integration tests for public API

### Documentation
- `packages/documentation/content/docs/core/parse-and-stringify.mdx` — core parsing
- `packages/documentation/content/docs/core/tree-utils.mdx` — tree utilities
- `packages/documentation/content/docs/explanation/ast.mdx` — AST explanation
- `packages/documentation/content/docs/template/parse-combinators.mdx` — parse combinators
- `packages/documentation/content/docs/template/emit-combinators.mdx` — emit combinators
- `packages/documentation/content/docs/template/test.mdx` — testing
- `packages/documentation/content/docs/template/trace.mdx` — tracing
- `packages/documentation/content/docs/template/docs.mdx` — docs generation
- `packages/documentation/content/docs/template/datamark-function.mdx` — `datamark()` function
- `packages/documentation/content/docs/template/index.mdx` — template overview
- `packages/documentation/content/docs/examples/basic-format.mdx` — example using format SDK
- `packages/documentation/content/docs/examples/todo-list-format.mdx` — example
- `packages/documentation/content/docs/examples/api-docs-format.mdx` — example
- `packages/documentation/content/docs/examples/blog-post-format.mdx` — example
- `packages/documentation/content/blog/writing-a-format.mdx` — blog post about writing formats
- `packages/documentation/content/blog/why-generators.mdx` — blog post about generators
- `packages/documentation/content/docs/explanation/template-system.mdx` — template system explanation
- `packages/documentation/content/docs/explanation/combinators.mdx` — combinators explanation
- `packages/documentation/content/docs/explanation/trace-and-test.mdx` — trace and test

### External files using the format SDK
- `packages/documentation/src/data/example-formats.ts` — 4 example formats (Plan, BlogPost, TodoList, ApiDoc) all using `datamark()` with generator-based parse/stringify

## Goals

1. **Delete the entire Format SDK** — all generator/combinator machinery (`src/template/` directory)
2. **Introduce a unified `Node` type hierarchy** — everything is a `Node`, structural nodes (SectionNode, ListItemNode, TableRowNode) live alongside content nodes
3. **Make section hierarchy native** — `parse()` returns a `Document` with a `root: SectionNode` instead of a flat `children: BlockNode[]`
4. **Redesign tree utilities** — `find()`, `findAll()`, `toMarkdown()`, etc. operate on `Node` instead of `BlockNode[]`
5. **Keep a lightweight `datamark()` wrapper** — but as a simple function pairing `parse`/`stringify`/`schema`/`examples`/`docs`, without generator internals
6. **Update all tests** — remove template tests, add section tree tests, update existing tests
7. **Update all documentation** — remove template SDK docs, rewrite core docs, add examples using new imperative API
8. **Update external files** — `example-formats.ts` and any docs using the old format SDK

## The Design

### 1. Unified Node Type Hierarchy

All nodes share a common base:

```typescript
interface Node {
  type: string;
  raw?: string;
  position?: SourceSpan;
}

interface ParentNode extends Node {
  children: Node[];
}
```

**Structural nodes:**

```typescript
interface Document extends Node {
  type: "document";
  frontmatter: Record<string, unknown> | null;
  root: SectionNode;
}

interface SectionNode extends ParentNode {
  type: "section";
  heading: HeadingNode | null;
}
```

**Inline content nodes (children of ParagraphNode, HeadingNode, etc.):**

```typescript
interface TextNode extends Node {
  type: "text";
  value: string;
}

interface StrongNode extends ParentNode {
  type: "strong";
  children: InlineNode[];
}

interface EmNode extends ParentNode {
  type: "em";
  children: InlineNode[];
}

interface CodeSpanNode extends Node {
  type: "codespan";
  value: string;
}

interface LinkNode extends ParentNode {
  type: "link";
  href: string;
  title?: string;
  children: InlineNode[];
}

interface ImageNode extends Node {
  type: "image";
  src: string;
  title?: string;
  alt: string;
}

interface BreakNode extends Node {
  type: "br";
}

interface DelNode extends ParentNode {
  type: "del";
  children: InlineNode[];
}

interface InlineHtmlNode extends Node {
  type: "html";
  value: string;
}

export type InlineNode =
  | TextNode
  | EscapeNode
  | StrongNode
  | EmNode
  | CodeSpanNode
  | LinkNode
  | ImageNode
  | BreakNode
  | DelNode
  | InlineHtmlNode;

interface EscapeNode extends Node {
  type: "escape";
  value: string;
}
```

**Block content nodes:**

```typescript
interface HeadingNode extends ParentNode {
  type: "heading";
  depth: number;
  children: InlineNode[];
}

interface ParagraphNode extends ParentNode {
  type: "paragraph";
  children: InlineNode[];
}

interface CodeNode extends Node {
  type: "code";
  lang?: string;
  meta?: string;
  value: string;
}

interface BlockquoteNode extends ParentNode {
  type: "blockquote";
  children: BlockNode[];
}

interface HrNode extends Node {
  type: "hr";
}

// NEW: ListItemNode replaces the awkward `items: BlockNode[][]`
interface ListItemNode extends ParentNode {
  type: "listItem";
  children: BlockNode[];
}

interface ListNode extends ParentNode {
  type: "list";
  ordered: boolean;
  start?: number;
  children: ListItemNode[];
}

// NEW: TableRowNode and TableCellNode — everything uses `.children`
interface TableCellNode extends ParentNode {
  type: "tableCell";
  children: InlineNode[];
}

interface TableRowNode extends ParentNode {
  type: "tableRow";
  children: TableCellNode[];
}

interface TableNode extends ParentNode {
  type: "table";
  align: Array<"left" | "center" | "right" | null>;
  children: TableRowNode[]; // first = header row
}

interface HtmlBlockNode extends Node {
  type: "html";
  value: string;
}

interface SpaceNode extends Node {
  type: "space";
}

export type BlockNode =
  | HeadingNode
  | ParagraphNode
  | CodeNode
  | BlockquoteNode
  | HrNode
  | ListNode
  | TableNode
  | HtmlBlockNode
  | SpaceNode;
```

### 2. The Section Tree Algorithm

The key algorithm. Single pass, stack-based, O(n):

```typescript
function buildSectionTree(nodes: BlockNode[]): SectionNode {
  const root: SectionNode = {
    type: "section",
    heading: null,
    children: [],
  };
  const stack: SectionNode[] = [root];

  for (const node of nodes) {
    if (node.type === "heading") {
      const depth = node.depth;
      // Pop until we find a section with heading depth < current depth
      while (stack.length > 1) {
        const topDepth = stack[stack.length - 1]!.heading?.depth ?? 0;
        if (topDepth < depth) break;
        stack.pop();
      }
      const parent = stack[stack.length - 1]!;
      const section: SectionNode = {
        type: "section",
        heading: node,
        children: [],
      };
      parent.children.push(section);
      stack.push(section);
    } else {
      stack[stack.length - 1]!.children.push(node);
    }
  }

  return root;
}
```

**Edge cases handled:**
- No headings → root with all content in `children`
- Content before first heading → stays in `root.children`
- `h1 → h3 → h2`: h3 nests under h1, h2 pops h3, becomes sibling under h1
- `h2 → h1`: h1 pops h2 (2 < 1 is false), becomes child of root (sibling to h2)
- Multiple same-depth headings: each pops previous, becomes sibling
- `h11` works fine — algorithm is depth-agnostic

### 3. Parsing Pipeline

```typescript
// markdown string → marked lexer → flat BlockNode[] → buildSectionTree → Document

export function parse(content: string): Document {
  const extracted = extractFrontmatter(content);
  let frontmatter: Record<string, unknown> | null = null;
  let body = content;
  let bodyOffset = 0;

  if (extracted) {
    frontmatter = parseYaml(extracted.frontmatter) as Record<string, unknown>;
    body = extracted.body;
    bodyOffset = content.indexOf(body);
  } else {
    const split = splitFrontmatter(content);
    if (split.frontmatter) {
      frontmatter = parseYaml(split.frontmatter) as Record<string, unknown>;
      body = split.body;
      bodyOffset = content.indexOf(body);
    }
  }

  const blocks = parseBlocks(body, content, bodyOffset);  // renamed from parseBody
  const root = buildSectionTree(blocks);

  return {
    type: "document",
    frontmatter,
    root,
  };
}
```

### 4. Stringify

```typescript
export function stringify(doc: Document): string {
  const lines: string[] = [];

  if (doc.frontmatter && Object.keys(doc.frontmatter).length > 0) {
    lines.push("---");
    lines.push(stringifyYaml(doc.frontmatter));
    lines.push("---");
    lines.push("");
  }

  const blocks = flatten(doc.root);
  const body = toMarkdown(blocks);
  if (body) {
    lines.push(body);
  }

  return lines.join("\n").trim() + "\n";
}
```

**Flattening** — recursively converts sections back to flat block nodes:

```typescript
export function flatten(section: SectionNode): BlockNode[] {
  const blocks: BlockNode[] = [];
  if (section.heading) {
    blocks.push(section.heading);
  }
  for (const child of section.children) {
    if (child.type === "section") {
      blocks.push(...flatten(child as SectionNode));
    } else {
      blocks.push(child as BlockNode);
    }
  }
  return blocks;
}
```

### 5. Tree Utilities

All traversal functions operate on `Node` (the unified base). The key insight: since `SectionNode` is a `Node` with `children`, `find()` and `findAll()` work everywhere in the tree.

```typescript
// Universal traversal
export function find(node: Node, predicate: (node: Node) => boolean): Node | undefined
export function findAll(node: Node, predicate: (node: Node) => boolean): Node[]

// Section-specific
export function sectionsAtDepth(section: SectionNode, depth: number): SectionNode[]
export function sectionsByHeading(section: SectionNode, text: string): SectionNode[]

// Extractors (recursive)
export function codeBlocks(node: Node, options?: { lang?: string }): CodeNode[]
export function textContent(node: Node): string
export function inlineText(nodes: InlineNode[]): string

// Flatten
export function flatten(section: SectionNode): BlockNode[]

// Type guards
export function isHeading(node: Node, depth?: number): node is HeadingNode
export function isCodeBlock(node: Node, lang?: string): node is CodeNode
export function isSection(node: Node): node is SectionNode
export function isBlockNode(node: Node): node is BlockNode
export function isInlineNode(node: Node): node is InlineNode
export function isParentNode(node: Node): node is ParentNode

// Serialization
export function toMarkdown(node: Node): string
export function toMarkdown(nodes: BlockNode[]): string  // overload for array
```

**`find()` and `findAll()` implementation:**

```typescript
export function find(node: Node, predicate: (node: Node) => boolean): Node | undefined {
  if (predicate(node)) return node;
  if (isParentNode(node)) {
    for (const child of node.children) {
      const found = find(child, predicate);
      if (found) return found;
    }
  }
  return undefined;
}

export function findAll(node: Node, predicate: (node: Node) => boolean): Node[] {
  const results: Node[] = [];
  if (predicate(node)) results.push(node);
  if (isParentNode(node)) {
    for (const child of node.children) {
      results.push(...findAll(child, predicate));
    }
  }
  return results;
}
```

**`textContent()` and `codeBlocks()` — recursive, work on any node:**

```typescript
export function codeBlocks(node: Node, options?: { lang?: string }): CodeNode[] {
  return findAll(node, (n) => isCodeBlock(n, options?.lang)) as CodeNode[];
}

export function textContent(node: Node): string {
  if (isInlineNode(node)) {
    switch (node.type) {
      case "text": case "escape": case "codespan": case "html": return node.value;
      case "image": return node.alt;
      case "br": return "\n";
      default: return inlineText((node as ParentNode).children as InlineNode[]);
    }
  }
  if (isBlockNode(node)) {
    switch (node.type) {
      case "heading": case "paragraph": return inlineText(node.children);
      case "code": return node.value;
      case "blockquote": return textContent(node);
      case "list": return (node.children as ListItemNode[])
        .map(item => textContent(item))
        .join("\n");
      case "table": return (node.children as TableRowNode[])
        .map(row => (row.children as TableCellNode[])
          .map(cell => inlineText(cell.children))
          .join(" "))
        .join("\n");
      case "html": return node.value;
      case "hr": case "space": return "";
    }
  }
  if (isSection(node)) {
    return node.children.map(child => textContent(child)).filter(Boolean).join("\n");
  }
  return "";
}
```

### 6. Lightweight Format SDK

The new `datamark()` is a simple function. No generators, no combinators, no runners.

```typescript
export interface FormatConfig<T> {
  schema?: StandardSchemaV1<any, T>;
  description?: string;
  examples?: Array<string | FormatExample>;
  docs?: FormatDocs;
  parse: (doc: Document) => T;
  stringify?: (data: T) => string;
}

export interface Format<T> {
  parse(content: string): T;
  stringify(data: T): string;
  test(): TestResult;
  docs(): FormatDocs;
}

export interface FormatExample {
  text: string;
  data?: unknown;
}

export interface FormatDocs {
  description?: string;
  examples?: Array<string | FormatExample>;
  structure?: unknown;
  schema?: unknown;
}

export interface TestResult {
  passed: boolean;
  failures: Array<{ exampleIndex: number; example: unknown; error: string }>;
}

export function datamark<T>(config: FormatConfig<T>): Format<T> {
  const testRunner = createTestRunner(config);

  return {
    parse(content: string): T {
      const doc = parse(content);
      const result = config.parse(doc);
      if (config.schema) {
        return validateData(config.schema, result);
      }
      return result as T;
    },

    stringify(data: T): string {
      if (!config.stringify) {
        throw new Error("No stringify configured for this format");
      }
      return config.stringify(data);
    },

    test() {
      return testRunner();
    },

    docs() {
      return {
        description: config.description,
        examples: config.examples,
        structure: config.docs?.structure,
        schema: config.schema
          ? (config.schema as any)["~standard"]?.types?.output ?? undefined
          : undefined,
      };
    },
  };
}

// Simple test runner
function createTestRunner<T>(config: FormatConfig<T>): () => TestResult {
  return () => {
    const failures: TestResult["failures"] = [];
    const examples = config.examples ?? [];

    for (let i = 0; i < examples.length; i++) {
      const example = examples[i]!;
      const text = typeof example === "string" ? example : example.text;
      try {
        const doc = parse(text);
        const result = config.parse(doc);
        if (config.schema) {
          validateData(config.schema, result);
        }
        if (typeof example === "object" && example.data !== undefined) {
          if (!deepEqual(result, example.data)) {
            failures.push({
              exampleIndex: i,
              example,
              error: `Output mismatch: expected ${JSON.stringify(example.data)}, got ${JSON.stringify(result)}`,
            });
          }
        }
      } catch (err: any) {
        failures.push({
          exampleIndex: i,
          example,
          error: err.message ?? String(err),
        });
      }
    }

    return { passed: failures.length === 0, failures };
  };
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== (b as any[]).length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], (b as any[])[i])) return false;
    }
    return true;
  }

  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) return false;
  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i]!;
    if (key !== bKeys[i]) return false;
    if (!deepEqual((a as any)[key], (b as any)[key])) return false;
  }
  return true;
}
```

### 7. Public Exports

`src/index.ts` should export:

```typescript
// Document
export { parse, stringify } from "./document";

// YAML
export { parseYaml, stringifyYaml, YamlParseError } from "./yaml";

// Frontmatter
export { extractFrontmatter, splitFrontmatter, FrontmatterError } from "./frontmatter";

// Validation
export { validateData, ValidationError, type StandardSchemaV1 } from "./validation";

// AST Types
export type {
  Document,
  Node,
  ParentNode,
  SectionNode,
  BlockNode,
  InlineNode,
  HeadingNode,
  ParagraphNode,
  CodeNode,
  BlockquoteNode,
  HrNode,
  ListNode,
  ListItemNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  HtmlBlockNode,
  SpaceNode,
  TextNode,
  EscapeNode,
  StrongNode,
  EmNode,
  CodeSpanNode,
  LinkNode,
  ImageNode,
  BreakNode,
  DelNode,
  InlineHtmlNode,
} from "./tree";

// AST Building
export { parseBlocks, buildSectionTree } from "./tree";  // parseBlocks renamed from parseBody

// Tree Utilities
export {
  find,
  findAll,
  filter,
  sectionsAtDepth,
  sectionsByHeading,
  splitBy,
  between,
  after,
  before,
  codeBlocks,
  inlineText,
  textContent,
  toMarkdown,
  flatten,
  isHeading,
  isCodeBlock,
  isSection,
  isBlockNode,
  isInlineNode,
  isParentNode,
  isTodoItem,
  extractTodoItems,
  type NodePredicate,
  type TodoItem,
} from "./tree-utils";

// Format SDK
export {
  datamark,
  type Format,
  type FormatConfig,
  type FormatDocs,
  type FormatExample,
  type TestResult,
} from "./format";

// Position
export type { Position, SourceSpan } from "./position";
```

## Implementation Order

### Phase 1: Core Types
1. Rewrite `src/tree.ts`
   - Define new `Node`, `ParentNode`, `SectionNode`, `ListItemNode`, `TableRowNode`, `TableCellNode`
   - Update existing `BlockNode`/`InlineNode` types to extend `Node`/`ParentNode`
   - Add `isSection()`, `isBlockNode()`, `isInlineNode()`, `isParentNode()` type guards
   - Rename `parseBody()` to `parseBlocks()` (or keep `parseBody` but return `BlockNode[]` — same as before)
   - Implement `buildSectionTree()`
   - Update list normalization to create `ListItemNode`s instead of `BlockNode[][]`
   - Update table normalization to create `TableRowNode`/`TableCellNode`

2. Update `src/document.ts`
   - Change `Document` to have `root: SectionNode` instead of `children: BlockNode[]`
   - `parse()` builds section tree
   - `stringify()` flattens tree before serialization

3. Update `src/tree-utils.ts`
   - Redesign all functions to operate on `Node`
   - Implement `flatten()`
   - Rewrite `toMarkdown()` to handle `Node` (including SectionNode, ListItemNode, TableRowNode, TableCellNode)
   - Add `sectionsAtDepth()`, `sectionsByHeading()` (replace old `sections()`)
   - Keep `splitBy`, `between`, `after`, `before` but take `Node` or `SectionNode` where appropriate

### Phase 2: Delete Template SDK
1. Delete entire `src/template/` directory:
   - `parse.ts`, `emit.ts`, `yieldable.ts`, `trace.ts`, `docs.ts`, `test-runner.ts`, `types.ts`, `index.ts`
2. Create `src/format.ts` with the new lightweight `datamark()`
3. Update `src/index.ts` exports

### Phase 3: Tests
1. Rewrite `src/tree.test.ts`:
   - Test `parseBlocks()` returns new `BlockNode` types
   - Test `ListItemNode` in lists
   - Test `TableRowNode`/`TableCellNode` in tables
   - Test `buildSectionTree()` for all edge cases

2. Rewrite `src/tree-utils.test.ts`:
   - Test `find()`, `findAll()` on `Node` (including sections)
   - Test `textContent()` on `SectionNode`
   - Test `codeBlocks()` on `SectionNode`
   - Test `toMarkdown()` on `Node`
   - Test `flatten()`

3. Rewrite `src/document.test.ts`:
   - Test `parse()` returns `Document.root: SectionNode`
   - Test `stringify()` from section tree
   - Test roundtrip

4. Create `src/section-tree.test.ts`:
   - No headings → single root section
   - Content before first heading → root section
   - `h1 → h2 → h3` → nested sections
   - `h2 → h1` → h1 pops h2, sibling of root
   - Multiple same-depth headings → siblings
   - `h11` → works at any depth
   - Deeply nested: `h1 → h6 → h6 → h2` → h2 pops both h6s
   - Heading at end of document → section with empty body
   - Only one heading at start → root with empty body, single child section

5. Rewrite `src/index.test.ts`:
   - Remove all template-related tests
   - Remove `TemplateParseError` from error class test
   - Test full workflow with new API
   - Test `datamark()` with imperative parse/stringify
   - Test `format.test()` and `format.docs()`

6. Delete `src/template/parse.test.ts` and `src/template/index.test.ts`

### Phase 4: Update External Files
1. `packages/documentation/src/data/example-formats.ts`
   - Rewrite all 4 example formats (Plan, BlogPost, TodoList, ApiDoc) using imperative parse
   - Use `doc.root.sections[0]!.heading!`, `textContent(section)`, `codeBlocks(section)` etc.
   - Update `formatCode` strings for display
   - Remove any `yield*`, `doc.consume()`, `heading()`, etc.

### Phase 5: Documentation (CRITICAL)

The documentation website is in `packages/documentation/` and uses Fumadocs. All content is in `.mdx` files.

**Delete or rewrite these pages:**

1. `content/docs/template/parse-combinators.mdx` — **DELETE** (combinators are gone)
2. `content/docs/template/emit-combinators.mdx` — **DELETE** (emit combinators are gone)
3. `content/docs/template/test.mdx` — **DELETE** (testing is now just `format.test()` with a simple description)
4. `content/docs/template/trace.mdx` — **DELETE** (tracing is gone with the generators)
5. `content/docs/template/docs.mdx` — **DELETE** (docs generation changed — now declarative, not from introspection)
6. `content/docs/template/datamark-function.mdx` — **REWRITE** — document the new `datamark()` function, `parse`/`stringify` as regular functions, `docs`/`examples` metadata
7. `content/docs/template/index.mdx` — **REWRITE** — overview of the new lightweight format SDK
8. `content/docs/explanation/template-system.mdx` — **DELETE** (template system is gone)
9. `content/docs/explanation/combinators.mdx` — **DELETE** (combinators are gone)
10. `content/docs/explanation/trace-and-test.mdx` — **DELETE** (trace is gone)
11. `content/blog/why-generators.mdx` — **DELETE** (generators are no longer used)
12. `content/blog/writing-a-format.mdx` — **REWRITE** — update the step-by-step guide to use imperative parse instead of generators

**Rewrite these pages:**

13. `content/docs/explanation/ast.mdx` — **REWRITE** — describe the new unified `Node` hierarchy, `SectionNode`, `Document.root`, `ParentNode`, `ListItemNode`, `TableRowNode`/`TableCellNode`. Explain the tree structure vs flat array.
14. `content/docs/core/parse-and-stringify.mdx` — **UPDATE** — document that `parse()` returns a `Document` with `root: SectionNode`, show `stringify()` usage. Mention `parseBlocks()` for low-level.
15. `content/docs/core/tree-utils.mdx` — **REWRITE** — document all `find`, `findAll`, `textContent`, `codeBlocks`, `toMarkdown`, `flatten`, `isHeading`, `isSection`, etc. Show examples of working with `Node` and `SectionNode`.
16. `content/docs/examples/basic-format.mdx` — **REWRITE** — use the new imperative `datamark()` API
17. `content/docs/examples/todo-list-format.mdx` — **REWRITE** — use imperative API
18. `content/docs/examples/api-docs-format.mdx` — **REWRITE** — use imperative API
19. `content/docs/examples/blog-post-format.mdx` — **REWRITE** — use imperative API

**Update navigation:**
20. `content/docs/template/meta.json` — Update/remove pages from the template section
21. `content/docs/explanation/meta.json` — Update/remove pages
22. `content/docs/examples/meta.json` — Ensure examples still reference correct pages
23. `content/docs/meta.json` — Update top-level nav

**Update the docs compare page:**
24. `content/compare/remark-plugins.mdx` — Update any references to the old format SDK

## Key Examples (for the implementing agent)

### Example 1: Using the new `parse()`

```typescript
import { parse, isHeading, isCodeBlock, findAll, inlineText, textContent } from "datamark";

const doc = parse(`
---
id: plan-001
---
# Q3 Roadmap

## Step

Set up the project.

\`\`\`javascript
npm init -y
\`\`\`

## Step

Implement the core.
`);

// doc.root is a SectionNode
const title = doc.root.children[0]?.type === "section" 
  ? inlineText(doc.root.children[0].heading.children)
  : "";

// Find all sections at depth 2
const h2Sections = doc.root.children
  .filter(n => n.type === "section")
  .filter(n => n.heading?.depth === 2);

// Find all code blocks recursively
const allCode = findAll(doc.root, n => isCodeBlock(n, "javascript"));
```

### Example 2: Using `datamark()` with imperative parse

```typescript
import { datamark, parse, inlineText, textContent, findAll, isCodeBlock, isHeading } from "datamark";
import * as z from "zod";

const PlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(z.object({
    description: z.string(),
    scripts: z.array(z.string()),
  })),
});

const PlanFormat = datamark({
  schema: PlanSchema,
  description: "A project plan with frontmatter, title, and step sections.",
  examples: [
    {
      text: `---\nid: plan-001\n---\n# Q3 Roadmap\n\n## Step\n\nSet up the project.\n\n\`\`\`js\nnpm init -y\n\`\`\``, 
      data: {
        id: "plan-001", 
        title: "Q3 Roadmap", 
        steps: [{ description: "Set up the project.", scripts: ["npm init -y"] }]
      }
    },
  ],
  
  parse(doc) {
    const id = doc.frontmatter?.id ?? "";
    const rootSections = doc.root.children.filter(n => n.type === "section");
    const titleSection = rootSections[0];
    const title = titleSection ? inlineText(titleSection.heading!.children) : "";
    
    const steps = titleSection!.children
      .filter(n => n.type === "section")
      .map(section => {
        const scripts = findAll(section, n => isCodeBlock(n, "javascript"))
          .map(n => n.value);
        const description = textContent(section);
        return { description, scripts };
      });
    
    return { id, title, steps };
  },
  
  stringify(data) {
    let md = `---\nid: ${data.id}\n---\n\n# ${data.title}\n\n`;
    for (const step of data.steps) {
      md += `## Step\n\n${step.description}\n\n`;
      for (const script of step.scripts) {
        md += `\`\`\`javascript\n${script}\n\`\`\`\n\n`;
      }
    }
    return md;
  },
  
  docs: {
    description: "A project plan with frontmatter, title, and step sections.",
    structure: [
      { element: "frontmatter", fields: ["id"] },
      { element: "heading(1)", field: "title" },
      { element: "section", heading: 2, field: "steps", children: [
        { element: "paragraph", field: "description" },
        { element: "codeBlock", lang: "javascript", many: true, field: "scripts" }
      ]}
    ]
  }
});

// Usage
const result = PlanFormat.parse(markdown);
const back = PlanFormat.stringify(result);
const test = PlanFormat.test();
const docs = PlanFormat.docs();
```

### Example 3: Working with the section tree

```typescript
import { parse, findAll, isSection } from "datamark";

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

// Navigate the tree
const root = doc.root;

// Root has 1 top-level section (the h1) and 1 paragraph (intro)
const topSection = root.children.find(n => isSection(n)) as SectionNode;
console.log(topSection.heading?.depth); // 1

// The h1 section has a paragraph and 2 subsections (h2s)
const subSections = topSection.children.filter(n => isSection(n));
console.log(subSections.length); // 2

// The first h2 has its own subsection (h3)
const subSubSections = subSections[0].children.filter(n => isSection(n));
console.log(subSubSections[0].heading?.depth); // 3
```

## Important Notes for the Implementing Agent

1. **Breaking changes are fine.** This library is not in production. Clean, correct implementation is more important than backward compatibility.

2. **TypeScript strictness matters.** The old code has some `any` casts. The new code should minimize these. The type guards (`isSection`, `isBlockNode`, `isParentNode`, etc.) are critical for narrowing.

3. **List normalization.** The old `ListNode.items: BlockNode[][]` is awkward. The new `ListNode.children: ListItemNode[]` where each `ListItemNode` is a `ParentNode` with `children: BlockNode[]` is much cleaner. The `parseBlocks()` function (or the conversion step) needs to normalize `marked` tokens into this structure.

4. **Table normalization.** Similarly, `TableNode.header` + `TableNode.rows` becomes `TableNode.children: TableRowNode[]` where the first row is the header. Each `TableRowNode` has `children: TableCellNode[]`.

5. **Position tracking.** The old `advance()` function in `tree.ts` tracks positions. Make sure `parseBlocks()` still computes positions correctly. `SectionNode` doesn't need its own position (it's structural, not a markdown token), but `heading` and body nodes within it should keep their positions.

6. **Documentation is part of the library.** The `AGENTS.md` in the project root says: *"The library's source is in `packages/datamark`, but the documentation website is inside `packages/documentation`. Then you change things about the library, make sure to check and update the documentation as well. It should always be up-to-date with the current state of the library."* 

7. **Test the docs build.** After updating documentation, run the build for the docs site to verify no broken references. The docs package is a separate package — check its `package.json` for the build command.

8. **Keep `parseBlocks` low-level.** The renamed `parseBlocks()` (or `parseBody` if you keep the name) should still return flat `BlockNode[]` for the internal pipeline. `buildSectionTree()` is the public step that turns it into a section tree. This allows users to access either the flat blocks or the tree.

9. **The `toMarkdown` function needs to handle SectionNode.** When calling `toMarkdown(node)` on a `SectionNode`, it should flatten it first, then serialize. Or provide a clear path: `toMarkdown(flatten(section))` for the array version. The overload should be unambiguous.

10. **Export everything from index.ts.** Make sure all public types, functions, and interfaces are exported from the top-level `index.ts`. The old `index.test.ts` checks for all exports — update that test accordingly.

11. **Remove `TemplateParseError`.** Since the template SDK is gone, `TemplateParseError` is no longer needed. The `ValidationError` from `validation.ts` stays.

12. **For the implementing agent: Read the existing files first.** Before making any changes, read all the files mentioned above to understand the current state. Then follow the implementation order. The plan is intentionally comprehensive.

13. **For the `section-tree.test.ts`:** Test these edge cases:
    - Empty document
    - Document with no headings
    - Single heading at start
    - Content before first heading
    - `h1 → h2 → h3` (nested)
    - `h2 → h1` (out-of-order, h1 pops h2)
    - Multiple same-depth headings (siblings)
    - `h1 → h6 → h6 → h2` (h2 pops both h6s)
    - Heading at end of document (section with empty body)
    - `h1` only (root has empty body, one child section)
    - Mixed content: paragraphs, lists, code blocks between headings
    - `h11` — any depth should work
    - Consecutive headings (h1, h2, h3 with no body between them)
    - `h3` without any parent h2/h1 (orphan, should go under root)

14. **For the `example-formats.ts` migration:** The formats are currently shown as interactive examples on the documentation site. The `parseFn` and `traceFn` are used in the UI. Remove `traceFn` from the interface (tracing is gone). The `parseFn` should just call `format.parse(md)`.

15. **For the implementing agent: Don't forget to update the test runner.** The test runner used `parseRunner()` from `template/parse.ts`. The new test runner should just call `parse()` and then the user's `parse()` function directly. No generator machinery needed.
