# Runnable Examples & Import Restructure Plan

> **Status:** DRAFT
> **Plan folder:** `./.plans/runnable-examples/`
> **Supporting files:** RESEARCH.md, DESIGN.md, TASKS.md

**Goal:** Every code snippet in the documentation is backed by a real, runnable `.ts` file with tests. Create a `datamark/parse` subpath for AST utilities. Build a `<Example>` component that inlines code from disk at build time.

**Approach:**
1. Create `datamark/parse` subpath by moving tree utilities from the main entry
2. Build `packages/datamark/examples/` with runnable `.ts` + `.test.ts` pairs
3. Write a remark plugin that replaces `<Example name="..." />` with inlined code during MDX build
4. Rewrite all docs to use `<Example>` instead of inline code blocks
5. Update `packages/documentation/src/data/example-formats.ts` to use the new import structure

**Tech stack:** Bun, Vitest-like test API (`bun:test`), Fumadocs MDX, Vite, TypeScript

---

## Context & Orientation

The `datamark` library lives in `packages/datamark/`. Documentation lives in `packages/documentation/`. Tests run via `bun test` in `packages/datamark`.

Key files:
- `packages/datamark/src/index.ts` — main entry point (too many exports)
- `packages/datamark/src/tree-utils.ts` — AST query/extraction utilities (will move to `datamark/parse`)
- `packages/datamark/src/stringify.ts` — builder primitives (already a subpath)
- `packages/datamark/package.json` — exports map (needs `./parse` added)
- `packages/documentation/content/docs/**/*.mdx` — 20+ doc files with ~80 code snippets
- `packages/documentation/source.config.ts` — Fumadocs MDX config (register remark plugin here)
- `packages/documentation/vite.config.ts` — Vite build config

## Scope

**In scope:**
- `packages/datamark/src/parse.ts` (new file)
- `packages/datamark/src/index.ts` (remove parse utilities)
- `packages/datamark/package.json` (add `./parse` export)
- `packages/datamark/src/index.test.ts` (update imports)
- `packages/datamark/src/tree-utils.test.ts` (update imports)
- `packages/datamark/examples/**/*.ts` + `**/*.test.ts` (new runnable examples)
- `packages/documentation/plugins/remark-example.ts` (new remark plugin)
- `packages/documentation/source.config.ts` (register plugin)
- `packages/documentation/src/components/example.tsx` (new React component for styling)
- All `packages/documentation/content/docs/**/*.mdx` (replace code blocks with `<Example>`)
- `packages/documentation/content/blog/**/*.mdx` (replace code blocks with `<Example>`)
- `packages/documentation/src/data/example-formats.ts` (update imports)

**Out of scope:**
- Changes to core library logic (parse, stringify, tree structure)
- New library features or API changes beyond import restructuring
- Landing page (`src/components/landing-page.tsx`)
- Non-code-block content in docs

**Forbidden:**
- Do NOT change the AST node types or tree structure
- Do NOT change the `datamark/stringify` API
- Do NOT delete existing tests — update their imports
- Do NOT use `rm` for file deletion (use `trash`)

## Goal & Acceptance

1. **All examples compile and pass tests:**
   - Run: `cd packages/datamark && bun test`
   - Expected: All existing tests pass + all new `examples/*.test.ts` pass

2. **Import restructure works:**
   - `import { find, inlineText } from "datamark/parse"` compiles
   - `import { datamark, parse, stringify } from "datamark"` still works
   - `import { heading } from "datamark/stringify"` still works

3. **Docs build with inlined examples:**
   - Run: `cd packages/documentation && bun run types:check && npx vite build`
   - Expected: 0 type errors, all 67+ pages prerender

4. **Example component renders code:**
   - Open any docs page with `<Example name="..." />`
   - The code block shows the actual content of `packages/datamark/examples/{name}.ts`
   - Import paths are rewritten to package names (not relative)

## Approach

### Phase 1: Import Restructure

Create `packages/datamark/src/parse.ts` as a thin re-export module:
```typescript
export {
  find, findAll, filter,
  sectionsAtDepth, sectionsByHeading,
  splitBy, between, after, before,
  codeBlocks,
  inlineText, textContent, toMarkdown,
  flatten,
  isHeading, isCodeBlock, isTodoItem, extractTodoItems,
  type NodePredicate, type TodoItem,
} from "./tree-utils";
```

Update `packages/datamark/src/index.ts`:
- Remove all `tree-utils` re-exports (find, findAll, inlineText, etc.)
- Keep: `parse`, `stringify`, tree types, type guards, validation, frontmatter, yaml, format SDK

Update `packages/datamark/package.json`:
```json
"exports": {
  ".": "./src/index.ts",
  "./parse": "./src/parse.ts",
  "./stringify": "./src/stringify.ts"
}
```

Update test files to import from the correct paths:
- `index.test.ts`: keep tests that verify main entry exports; add tests that verify `datamark/parse` subpath works
- `tree-utils.test.ts`: no import changes needed (it imports from `./tree-utils` directly)

### Phase 2: Runnable Examples

Create `packages/datamark/examples/` with these example files. Each is a self-contained runnable TypeScript file that imports from relative paths (`../../src/...`) so it can be executed directly. Each has a corresponding `.test.ts` that asserts the example works.

**Shared helpers** (`examples/_shared.ts`):
```typescript
import { parse } from "../../src/index";
export const SAMPLE_MARKDOWN = `...`; // full sample doc
export const SAMPLE_DOC = parse(SAMPLE_MARKDOWN);
```

**Core examples** (each is a `.ts` file with exported functions + a `.test.ts`):

| File | What it demonstrates | Key imports |
|------|---------------------|-------------|
| `parse-and-stringify.ts` | `parse()`, `stringify()`, `parseBlocks()` | `datamark` |
| `tree-query.ts` | `find()`, `findAll()`, `filter()`, `isHeading()` | `datamark/parse` |
| `section-navigation.ts` | `sectionsAtDepth()`, `sectionsByHeading()`, `splitBy()`, `between()` | `datamark/parse` |
| `text-extraction.ts` | `inlineText()`, `textContent()`, `toMarkdown()` | `datamark/parse` |
| `code-blocks.ts` | `codeBlocks()`, `isCodeBlock()` | `datamark/parse` |
| `todo-items.ts` | `extractTodoItems()`, `isTodoItem()` | `datamark/parse` |
| `frontmatter.ts` | `extractFrontmatter()`, `splitFrontmatter()` | `datamark` |
| `yaml.ts` | `parseYaml()`, `stringifyYaml()` | `datamark` |
| `validation.ts` | `validateData()` with a mock schema | `datamark` |
| `format-basic.ts` | Minimal `datamark()` with parse only | `datamark` |
| `format-frontmatter.ts` | `datamark()` with `frontmatterSchema` | `datamark` |
| `format-stringify.ts` | `datamark()` with parse + stringify + builders | `datamark`, `datamark/stringify` |
| `format-testing.ts` | `datamark()` with `.test()` and examples | `datamark` |
| `builders.ts` | All builder functions from `datamark/stringify` | `datamark/stringify` |
| `blog-post.ts` | Full BlogPost format with typed frontmatter | `datamark`, `datamark/stringify` |
| `todo-list.ts` | Full TodoList format with priorities | `datamark`, `datamark/stringify` |
| `api-docs.ts` | Full ApiDoc format | `datamark`, `datamark/stringify` |
| `changelog.ts` | Full Changelog format | `datamark`, `datamark/stringify` |
| `recipe.ts` | Full Recipe format | `datamark`, `datamark/stringify` |
| `meeting-notes.ts` | Full MeetingNotes format | `datamark`, `datamark/stringify` |
| `plan.ts` | Full Plan format | `datamark`, `datamark/stringify` |

**Format example structure** (e.g., `blog-post.ts`):
```typescript
import { datamark, textContent } from "../../src/index";
import { frontmatter, paragraph } from "../../src/stringify";
import * as z from "zod";

export const BlogFrontmatterSchema = z.object({
  title: z.string(), date: z.string(), author: z.string(), tags: z.array(z.string()),
});

export const BlogPostSchema = z.object({
  meta: BlogFrontmatterSchema,
  body: z.string(),
});

export const BlogPostFormat = datamark({
  frontmatterSchema: BlogFrontmatterSchema,
  schema: BlogPostSchema,
  parse(doc) {
    return { meta: doc.frontmatter, body: textContent(doc.root).trim() };
  },
  stringify(data) {
    return frontmatter(data.meta) + paragraph(data.body) + "\n";
  },
});

export const blogPostMarkdown = `---\ntitle: Hello World\ndate: 2026-05-30\nauthor: Ada\ntags: [typescript, markdown]\n---\n\nThis is the first paragraph.\n\n## Subheading\n\nMore content with **bold** text.`;
```

**Corresponding test** (`blog-post.test.ts`):
```typescript
import { describe, test, expect } from "bun:test";
import { BlogPostFormat, blogPostMarkdown } from "./blog-post";

describe("blog-post example", () => {
  test("parses frontmatter and body", () => {
    const result = BlogPostFormat.parse(blogPostMarkdown);
    expect(result.meta.title).toBe("Hello World");
    expect(result.body).toContain("first paragraph");
  });

  test("round-trips through stringify", () => {
    const data = BlogPostFormat.parse(blogPostMarkdown);
    const md = BlogPostFormat.stringify(data);
    expect(md).toContain("---");
    expect(md).toContain("title: Hello World");
  });
});
```

### Phase 3: Remark Plugin for `<Example>`

Create `packages/documentation/plugins/remark-example.ts`:

```typescript
import { visit } from "unist-util-visit";
import * as fs from "node:fs";
import * as path from "node:path";

const IMPORT_MAP: Record<string, string> = {
  '"../../src/index"': '"datamark"',
  '"../../src/parse"': '"datamark/parse"',
  '"../../src/stringify"': '"datamark/stringify"',
  '"../../src/tree"': '"datamark"',
  '"../../src/tree-utils"': '"datamark/parse"',
  '"../../src/validation"': '"datamark"',
  '"../../src/frontmatter"': '"datamark"',
  '"../../src/yaml"': '"datamark"',
  '"../../src/document"': '"datamark"',
  '"../../src/position"': '"datamark"',
};

export function remarkExample() {
  return (tree: any) => {
    visit(tree, "mdxJsxFlowElement", (node: any) => {
      if (node.name !== "Example") return;
      const nameAttr = node.attributes.find((a: any) => a.name === "name");
      if (!nameAttr) return;
      const name = nameAttr.value;

      const examplesDir = path.resolve(__dirname, "../../datamark/examples");
      const filePath = path.join(examplesDir, `${name}.ts`);
      if (!fs.existsSync(filePath)) {
        console.warn(`[remark-example] Example not found: ${filePath}`);
        return;
      }

      let code = fs.readFileSync(filePath, "utf-8");

      // Remove shared helper imports
      code = code.replace(/import.*from\s+"\.\.\/..\/examples\/_shared".*?;\n?/g, "");
      code = code.replace(/import.*from\s+"\.\.\/[^"]+".*?;\n?/g, ""); // Remove cross-example imports

      // Rewrite src imports
      for (const [from, to] of Object.entries(IMPORT_MAP)) {
        code = code.replace(new RegExp(from, "g"), to);
      }

      // Trim leading/trailing blank lines
      code = code.replace(/^\n+|\n+$/g, "");

      // Replace node with a code block
      node.type = "code";
      node.lang = "typescript";
      node.value = code;
      delete node.name;
      delete node.attributes;
    });
  };
}
```

Register in `source.config.ts`:
```typescript
import { remarkExample } from "../plugins/remark-example";

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkExample],
  },
});
```

Wait — let me check if `fumadocs-mdx/config`'s `defineConfig` accepts `mdxOptions`. Looking at the current `source.config.ts`, it just exports `defineConfig()` with no args. Let me check the Fumadocs MDX API.

Actually, looking at Fumadocs MDX docs, the `defineConfig` can accept an options object. But since we're using the `postprocess` approach with `includeProcessedMarkdown`, we might need to add the remark plugin at the Vite plugin level instead.

Let me check how `fumadocs-mdx/vite` accepts options.

The simplest approach: since `mdx()` from `fumadocs-mdx/vite` is a Vite plugin, I can pass options to it. Or I can modify the MDX processing at the `source.config.ts` level.

Let me use a simpler approach: register the remark plugin in `source.config.ts` via the `mdxOptions` field if available, or wrap the Vite plugin.

Actually, looking at Fumadocs MDX more carefully, the `defineConfig` function can take options:
```typescript
export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkExample],
  },
});
```

This should work. Let me include this in the plan but note it may need adjustment based on the actual Fumadocs MDX API.

### Phase 4: Update Documentation

For each doc file, replace fenced code blocks with `<Example name="..." />` where the example name maps to a `.ts` file.

**Mapping (docs page → example names):**

| Doc page | Example names used |
|----------|-------------------|
| `docs/core/parse-and-stringify.mdx` | `parse-and-stringify` |
| `docs/core/tree-utils.mdx` | `tree-query`, `section-navigation`, `text-extraction`, `code-blocks`, `todo-items` |
| `docs/core/frontmatter.mdx` | `frontmatter` |
| `docs/core/yaml.mdx` | `yaml` |
| `docs/template/datamark-function.mdx` | `format-basic`, `format-frontmatter`, `format-testing` |
| `docs/template/frontmatter.mdx` | `format-frontmatter` |
| `docs/template/parsing.mdx` | `tree-query`, `section-navigation`, `text-extraction`, `code-blocks`, `todo-items` |
| `docs/template/stringify.mdx` | `builders`, `format-stringify` |
| `docs/template/testing.mdx` | `format-testing` |
| `docs/examples/basic-format.mdx` | `format-basic` |
| `docs/examples/blog-post-format.mdx` | `blog-post` |
| `docs/examples/todo-list-format.mdx` | `todo-list` |
| `docs/examples/api-docs-format.mdx` | `api-docs` |
| `docs/examples/changelog-format.mdx` | `changelog` |
| `docs/examples/recipe-format.mdx` | `recipe` |
| `docs/examples/meeting-notes-format.mdx` | `meeting-notes` |
| `docs/explanation/ast.mdx` | `parse-and-stringify` |
| `docs/explanation/validation.mdx` | `validation` |
| `docs/index.mdx` | `parse-and-stringify` |
| `docs/quickstart.mdx` | `format-basic` or `blog-post` |

For code blocks that are **not** extractable as standalone examples (e.g., very short snippets like `console.log(result.title)`, interface definitions, or inline one-liners), keep them as inline code blocks.

### Phase 5: Update `example-formats.ts`

The `packages/documentation/src/data/example-formats.ts` file also needs import updates:
- `import { ... } from "datamark"` → keep for main entry items
- Add `import { ... } from "datamark/parse"` for tree utilities
- Keep `import { ... } from "datamark/stringify"` for builders

## Tasks

### Task 1: Create `datamark/parse` subpath

**Files:**
- Create: `packages/datamark/src/parse.ts`
- Modify: `packages/datamark/src/index.ts`
- Modify: `packages/datamark/package.json`
- Test: `packages/datamark/src/index.test.ts`

**Steps:**
- [ ] **Step 1: Create `parse.ts`**
  Re-export all tree-utils exports:
  ```typescript
  export {
    find, findAll, filter,
    sectionsAtDepth, sectionsByHeading,
    splitBy, between, after, before,
    codeBlocks,
    inlineText, textContent, toMarkdown,
    flatten,
    isHeading, isCodeBlock, isTodoItem, extractTodoItems,
    type NodePredicate, type TodoItem,
  } from "./tree-utils";
  ```
- [ ] **Step 2: Update `index.ts`**
  Remove all tree-utils re-exports. Keep: parse, stringify, tree types, type guards, validation, frontmatter, yaml, format SDK, position types.
- [ ] **Step 3: Update `package.json`**
  Add `"./parse": "./src/parse.ts"` to exports.
- [ ] **Step 4: Update `index.test.ts`**
  Add test: `import { find, inlineText } from "./parse"` works. Keep existing tests but update any that import removed items from `./index`.
- [ ] **Step 5: Run tests**
  Run: `cd packages/datamark && bun test`
  Expected: All tests pass

### Task 2: Create runnable examples directory

**Files:**
- Create: `packages/datamark/examples/_shared.ts`
- Create: `packages/datamark/examples/*.ts` (20 files)
- Create: `packages/datamark/examples/*.test.ts` (20 files)

**Steps:**
- [ ] **Step 1: Create `_shared.ts`**
  Define `SAMPLE_MARKDOWN` and `SAMPLE_DOC` constants.
- [ ] **Step 2: Create core examples**
  Create `parse-and-stringify.ts`, `tree-query.ts`, `section-navigation.ts`, `text-extraction.ts`, `code-blocks.ts`, `todo-items.ts`, `frontmatter.ts`, `yaml.ts`, `validation.ts`, `builders.ts`.
- [ ] **Step 3: Create format examples**
  Create `format-basic.ts`, `format-frontmatter.ts`, `format-stringify.ts`, `format-testing.ts`.
- [ ] **Step 4: Create full format examples**
  Create `blog-post.ts`, `todo-list.ts`, `api-docs.ts`, `changelog.ts`, `recipe.ts`, `meeting-notes.ts`, `plan.ts`.
  Each uses proper builder primitives (no raw string concat).
- [ ] **Step 5: Write tests for all examples**
  Each `.test.ts` verifies:
  - The example's main function/format works
  - Parse produces expected output
  - Stringify round-trips correctly (for formats with stringify)
- [ ] **Step 6: Run all tests**
  Run: `cd packages/datamark && bun test`
  Expected: All 40+ test suites pass

### Task 3: Build `<Example>` remark plugin

**Files:**
- Create: `packages/documentation/plugins/remark-example.ts`
- Modify: `packages/documentation/source.config.ts`
- Create: `packages/documentation/src/components/example.tsx`

**Steps:**
- [ ] **Step 1: Install dependencies**
  `unist-util-visit` might already be available via MDX dependencies. Check first.
- [ ] **Step 2: Write `remark-example.ts`**
  Implement the plugin as designed. Handle edge cases (missing file, no `name` attribute).
- [ ] **Step 3: Register in `source.config.ts`**
  Pass `mdxOptions.remarkPlugins` to `defineConfig` or wrap the MDX plugin.
- [ ] **Step 4: Create `example.tsx` component**
  A React component that wraps code blocks in the same `Card` / `CodeFrame` styling used on the landing page. If the remark plugin converts `<Example>` to a `<pre>`/`<code>` already, this component may just be for additional styling props.
- [ ] **Step 5: Test plugin**
  Create a temporary MDX file with `<Example name="blog-post" />`, run `bun run types:check && npx vite build`, verify the output contains the inlined code.

### Task 4: Rewrite all docs to use `<Example>`

**Files:**
- Modify: All `packages/documentation/content/docs/**/*.mdx`
- Modify: `packages/documentation/content/blog/**/*.mdx`
- Modify: `packages/documentation/src/data/example-formats.ts`

**Steps:**
- [ ] **Step 1: Update `example-formats.ts`**
  Update imports to use `datamark/parse` for tree utilities. Ensure all stringify uses builder primitives.
- [ ] **Step 2: Update `docs/core/*.mdx`**
  Replace code blocks with `<Example name="..." />` where examples exist.
- [ ] **Step 3: Update `docs/template/*.mdx`**
  Same.
- [ ] **Step 4: Update `docs/examples/*.mdx`**
  Same — these will use the full format examples.
- [ ] **Step 5: Update `docs/explanation/*.mdx`**
  Same.
- [ ] **Step 6: Update `docs/index.mdx` and `docs/quickstart.mdx`**
  Same.
- [ ] **Step 7: Update `blog/*.mdx`**
  Same.
- [ ] **Step 8: Verify build**
  Run: `cd packages/documentation && bun run types:check && npx vite build`
  Expected: 0 errors, all pages prerender

## Validation & Acceptance

1. Run: `cd packages/datamark && bun test`
   Expected: All tests pass (existing + new example tests)

2. Run: `cd packages/documentation && bun run types:check`
   Expected: 0 TypeScript errors

3. Run: `cd packages/documentation && npx vite build`
   Expected: Build completes, all pages prerender

4. Manual check: Open a docs page in browser, inspect a code block from `<Example name="..." />`, verify the code matches the `.ts` file and imports use package names.

## Risks & Rollback

- **Risk:** Fumadocs MDX doesn't support custom remark plugins easily.
  Mitigation: Use Vite's `mdx` plugin options directly, or preprocess MDX files with a build script before Vite sees them.
- **Risk:** Import rewriting regex is fragile.
  Mitigation: Use a simple string replacement with exact paths, not a general regex. Add a test for the remark plugin itself.
- **Risk:** Examples use `zod` which is a devDependency in the examples but might not be available.
  Mitigation: Add `zod` as a devDependency in `packages/datamark/package.json`.
- **Rollback:** `git revert` the commits. All changes are additive except the import restructure in `index.ts`.

## Open Questions

1. Does `fumadocs-mdx/config`'s `defineConfig` accept `mdxOptions.remarkPlugins`? Need to verify during implementation.
2. Should we keep some small inline code blocks for very short snippets (e.g., `console.log(result)`), or make every single snippet an example?
3. Do the blog posts also need the `<Example>` treatment, or just the docs?

## Out of Scope

- Landing page code examples (hero demo)
- README.md in `packages/datamark/`
- API reference auto-generation
- Playground / interactive editor
