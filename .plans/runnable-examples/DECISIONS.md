# Decisions Log

## 2026-06-27: Main entry exports

**Decision:** `datamark` main entry exports ONLY `datamark`, `parse`, `stringify`, and their directly associated types (`Document`, `Format`, `FormatConfig`, etc.).

**Rationale:** User wants a clean three-import mental model. Everything AST-related goes to `datamark/parse`. Everything serialization-related goes to `datamark/stringify`.

**Consequence:** Breaking change to existing API. All tree utilities, type guards, frontmatter/yaml functions move out of main entry.

## 2026-06-27: Where does `toMarkdown` go?

**Decision:** `toMarkdown` goes to `datamark/stringify` since it serializes AST back to Markdown.

**Rationale:** It's the inverse of `parse`. The user said "anything meant to turn it back into markdown is stringification."

## 2026-06-27: Where do frontmatter/yaml functions go?

**Decision:** 
- `extractFrontmatter`, `splitFrontmatter`, `FrontmatterError` → `datamark/parse` (reading from source)
- `parseYaml`, `YamlParseError` → `datamark/parse` (reading/parsing)
- `stringifyYaml` → `datamark/stringify` (writing/serializing)

## 2026-06-27: Where does validation go?

**Decision:** `validateData`, `ValidationError` → `datamark/parse`.

**Rationale:** Validation happens on parsed data before it's returned. It's part of the parsing pipeline.

## 2026-06-27: Where do tree types go?

**Decision:** All tree types (`Node`, `SectionNode`, `BlockNode`, etc.) go to `datamark/parse`.

**Rationale:** These describe the shape of parsed data. You need them to write `parse()` functions.

**Exception:** `Document` type is also re-exported from `datamark` main since it's the return type of `parse()`.
