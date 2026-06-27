# Design: Runnable Examples System

## New Export Structure

### `datamark` (main entry)
Core parsing, types, validation, format SDK:
- `datamark`, `parse`, `stringify`
- `parseBlocks`, `parseBody`, `buildSectionTree`
- All tree types (`Node`, `BlockNode`, `SectionNode`, etc.)
- Type guards (`isSection`, `isBlockNode`, `isInlineNode`, `isParentNode`)
- `validateData`, `ValidationError`
- `extractFrontmatter`, `splitFrontmatter`, `FrontmatterError`
- `parseYaml`, `stringifyYaml`, `YamlParseError`
- Position types

### `datamark/parse` (new subpath)
All AST query and extraction utilities:
- `find`, `findAll`, `filter`
- `sectionsAtDepth`, `sectionsByHeading`
- `splitBy`, `between`, `after`, `before`
- `codeBlocks`
- `inlineText`, `textContent`
- `toMarkdown`
- `flatten`
- `isHeading`, `isCodeBlock`, `isTodoItem`, `extractTodoItems`

### `datamark/stringify` (existing)
Builder primitives (unchanged):
- `frontmatter`, `heading`, `paragraph`, `codeBlock`, `list`, `blockquote`, `horizontalRule`
- `strong`, `em`, `codeSpan`, `link`, `image`, `strikethrough`

## Examples Directory

```
packages/datamark/examples/
├── _shared.ts              # Shared test helpers (mock schemas, sample markdown)
├── parse-and-stringify.ts  # Core parse/stringify examples
├── parse-and-stringify.test.ts
├── tree-query.ts           # find, findAll, filter examples
├── tree-query.test.ts
├── section-navigation.ts   # sectionsAtDepth, sectionsByHeading, splitBy
├── section-navigation.test.ts
├── text-extraction.ts      # inlineText, textContent, toMarkdown
├── text-extraction.test.ts
├── code-blocks.ts          # codeBlocks, isCodeBlock
├── code-blocks.test.ts
├── todo-items.ts           # extractTodoItems, isTodoItem
├── todo-items.test.ts
├── frontmatter.ts          # extractFrontmatter, splitFrontmatter
├── frontmatter.test.ts
├── yaml.ts                 # parseYaml, stringifyYaml
├── yaml.test.ts
├── validation.ts           # validateData with StandardSchemaV1
├── validation.test.ts
├── format-basic.ts          # Minimal datamark() format
├── format-basic.test.ts
├── format-frontmatter.ts    # Format with frontmatterSchema
├── format-frontmatter.test.ts
├── format-stringify.ts      # Format with parse + stringify
├── format-stringify.test.ts
├── format-testing.ts        # Format with .test() and examples
├── format-testing.test.ts
├── builders.ts              # All stringify builders
├── builders.test.ts
├── blog-post.ts             # Full format: blog post
├── blog-post.test.ts
├── todo-list.ts             # Full format: todo list
├── todo-list.test.ts
├── api-docs.ts              # Full format: API docs
├── api-docs.test.ts
├── changelog.ts             # Full format: changelog
├── changelog.test.ts
├── recipe.ts                # Full format: recipe
├── recipe.test.ts
├── meeting-notes.ts         # Full format: meeting notes
├── meeting-notes.test.ts
└── plan.ts                  # Full format: project plan
    └── plan.test.ts
```

## `<Example>` Component (Build-Time Code Inlining)

### Approach
A custom **remark plugin** (`packages/documentation/plugins/remark-example.ts`) that:
1. Scans MDX AST for `<Example name="..." />` JSX elements
2. Reads the corresponding `.ts` file from `../../datamark/examples/{name}.ts`
3. Rewrites import paths:
   - `../../src/index` or `../../src/parse` → `datamark`
   - `../../src/stringify` → `datamark/stringify`
   - `../../src/tree` → `datamark`
   - `../../src/tree-utils` → `datamark/parse`
   - `../../src/validation` → `datamark`
   - `../../src/frontmatter` → `datamark`
   - `../../src/yaml` → `datamark`
   - `../../src/document` → `datamark`
   - `../../examples/_shared` → removed (docs don't show shared helpers)
4. Replaces the `<Example />` node with a fenced code block:
   ```mdx
   ```typescript
   {inlinedCode}
   ```
   ```
5. If `showOutput` prop is present, also appends a `<Callout>` or comment showing expected output

### Integration
Register the plugin in `source.config.ts` via Fumadocs MDX config.

### Props
```tsx
<Example name="blog-post" />           {/* Just the code */}
<Example name="blog-post" showOutput /> {/* Code + expected output callout */}
```

### MDX Usage
```mdx
---
title: Blog Post Format
---

This example parses a blog post with frontmatter metadata:

<Example name="blog-post" />

## Key concepts
...
```

## Import Path Rewriting Rules

| Source import (in `.ts` file) | Displayed import (in docs) |
|-------------------------------|---------------------------|
| `../../src/index` | `datamark` |
| `../../src/parse` | `datamark/parse` |
| `../../src/stringify` | `datamark/stringify` |
| `../../src/tree` | `datamark` |
| `../../src/tree-utils` | `datamark/parse` |
| `../../src/validation` | `datamark` |
| `../../src/frontmatter` | `datamark` |
| `../../src/yaml` | `datamark` |
| `../../src/document` | `datamark` |
| `../../src/position` | `datamark` |
| `../../examples/_shared` | *(removed)* |
| `../../examples/X` | *(removed — self-contained)* |

## Benefits
1. **Real code**: Every snippet is a `.ts` file that `bun test` can execute
2. **Tested**: Every `.test.ts` verifies the example produces correct output
3. **Always up to date**: Docs show the actual code from disk
4. **Refactor-safe**: Rename a function? The example `.ts` breaks, tests fail, docs update automatically
5. **No drift**: Docs cannot show code that doesn't compile
