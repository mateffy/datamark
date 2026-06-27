# Research: Runnable Examples System

## Current State

### Export structure (`packages/datamark/package.json`)
```json
{
  "exports": {
    ".": "./src/index.ts",
    "./stringify": "./src/stringify.ts"
  }
}
```

### Current `datamark` main entry (`packages/datamark/src/index.ts`)
Exports:
- `parse`, `stringify` from `./document`
- `parseBlocks`, `parseBody`, `buildSectionTree`, all tree types + type guards from `./tree`
- `find`, `findAll`, `filter`, `sectionsAtDepth`, `sectionsByHeading`, `splitBy`, `between`, `after`, `before`, `codeBlocks`, `inlineText`, `textContent`, `toMarkdown`, `flatten`, `isHeading`, `isCodeBlock`, `isTodoItem`, `extractTodoItems` from `./tree-utils`
- `validateData`, `ValidationError` from `./validation`
- `extractFrontmatter`, `splitFrontmatter`, `FrontmatterError` from `./frontmatter`
- `parseYaml`, `stringifyYaml`, `YamlParseError` from `./yaml`
- `datamark`, `Format`, `FormatConfig`, etc. from `./format`
- Position types from `./position`

### Current `datamark/stringify` subpath (`packages/datamark/src/stringify.ts`)
Exports: `frontmatter`, `heading`, `paragraph`, `codeBlock`, `list`, `blockquote`, `horizontalRule`, `strong`, `em`, `codeSpan`, `link`, `image`, `strikethrough`

### Code snippets across docs (~80 total)

**`docs/core/`:**
- `parse-and-stringify.mdx` — 4 snippets (parse, stringify, parseBlocks, Document interface)
- `tree-utils.mdx` — 11 snippets (find, findAll, filter, sectionsAtDepth, sectionsByHeading, splitBy, between, after, before, codeBlocks, textContent, inlineText, toMarkdown, flatten, isHeading, isCodeBlock, isTodoItem, extractTodoItems, type guards)
- `frontmatter.mdx` — 3 snippets (extractFrontmatter, splitFrontmatter, FrontmatterError)
- `yaml.mdx` — 3 snippets (parseYaml, stringifyYaml, YamlParseError)

**`docs/template/`:**
- `datamark-function.mdx` — 4 snippets (datamark() basic, schema, frontmatterSchema, docs/test)
- `frontmatter.mdx` — 6 snippets (reading frontmatter, validation, typed frontmatter, patterns)
- `parsing.mdx` — 11 snippets (document structure, finding sections, walking subsections, code blocks, lists, tables, inline text, todo items, positions)
- `stringify.mdx` — 11 snippets (import path, stringify contract, frontmatter, heading, codeBlock, list, blockquote, inline formatting, full document, round-trip)
- `testing.mdx` — 4 snippets (inline examples, .test(), frontmatter validation, CI)

**`docs/examples/`:**
- `basic-format.mdx` — 1 snippet
- `blog-post-format.mdx` — 1 snippet
- `todo-list-format.mdx` — 1 snippet
- `api-docs-format.mdx` — 1 snippet
- `changelog-format.mdx` — 1 snippet
- `recipe-format.mdx` — 1 snippet
- `meeting-notes-format.mdx` — 1 snippet
- `index.mdx` — 0 snippets (just cards)

**`docs/explanation/`:**
- `ast.mdx` — 6 snippets (Node types, SectionNode, document tree, type guards, positions, tree walking)
- `validation.mdx` — 3 snippets (StandardSchemaV1, validateData, error handling)

**`docs/` root:**
- `index.mdx` — 1 snippet (10-second demo)
- `quickstart.mdx` — 2 snippets

**`blog/`:**
- `writing-a-format.mdx` — multiple snippets
- `inline-examples-testing.mdx` — multiple snippets

### Existing example formats (`packages/documentation/src/data/example-formats.ts`)
7 complete format definitions (Plan, Blog Post, Todo List, API Doc, Changelog, Recipe, Meeting Notes) — each with parse + stringify + markdown inputs.

### Test setup
- Uses `bun:test` (`describe`, `test`, `expect`)
- Tests live in `packages/datamark/src/*.test.ts`
- Run via `bun test` in `packages/datamark`

### Documentation build
- Fumadocs with MDX
- Components in `packages/documentation/src/components/`
- Vite build with prerendering
- Types checked via `bun run types:check`
