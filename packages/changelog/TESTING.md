# @datamark/changelog — Testing

## Runner

Tests use Bun (`bun:test`) and are colocated with source files (`*.test.ts`).

```bash
# Run all tests in this package
bun test packages/changelog

# Run individual format tests
bun test packages/changelog/src/keep-a-changelog.test.ts
bun test packages/changelog/src/conventional-changelog.test.ts
bun test packages/changelog/src/github-releases.test.ts
bun test packages/changelog/src/common-changelog.test.ts
```

## Tested Areas Map

| Export | File | Tests | Status |
|--------|------|-------|--------|
| `keepAChangelog` | `keep-a-changelog.ts` | `keep-a-changelog.test.ts` | ✅ |
| `conventionalChangelog` | `conventional-changelog.ts` | `conventional-changelog.test.ts` | ✅ |
| `githubReleases` | `github-releases.ts` | `github-releases.test.ts` | ✅ |
| `commonChangelog` | `common-changelog.ts` | `common-changelog.test.ts` | ✅ |
| `extractVersionInfo` | `utils.ts` | Indirect (all formats) | ✅ |
| `classifyCategory` | `utils.ts` | Indirect (all formats) | ✅ |
| `parseChangeItem` | `utils.ts` | Indirect (all formats) | ✅ |
| `inlineSummary` | `utils.ts` | Indirect (all formats) | ✅ |
| `extractFootnoteReferences` | `utils.ts` | Indirect (all formats) | ✅ |

## Coverage Philosophy

Each format has:
- Happy-path parsing tests (minimal valid input)
- Round-trip parse → stringify → parse fidelity tests
- Complex real-world examples (Tailwind CSS, Axios) built into the format's `examples` array
- Edge cases: images in entries, links in entries, nested lists, blockquotes in list items, empty categories, yanked releases, missing dates, plain paragraphs without categories
- Self-tests via `format.test()` which validates all built-in examples against the Zod schema

## Known Coverage Gaps

- `headingRawText` on deeply nested inline structures (e.g., link inside strong inside em)
- `extractPreamble` with multiple h1 sections
- `extractVersionSummary` with deeply nested sub-sections before categories
- Large-scale performance tests on changelogs with 100+ versions

## Specialties & Watch-Outs

1. **Link reference headings**: When a changelog has footnote reference links like `[1.0.0]: url`, `marked` may parse `[1.0.0]` in headings as a link. We use `headingRawText` (joining `raw` values) instead of `inlineText` to preserve brackets for regex matching.

2. **Images in list items**: `marked` wraps list item inline tokens in an outer `text` token with nested `tokens`. A fix in `datamark`'s `tree.ts` flattens these so images and links are properly exposed in the AST.

3. **Summary extraction**: `inlineSummary` omits image alt text so that visual-only images don't pollute the text summary.

4. **Reference links**: The `datamark()` Format SDK does not expose the original markdown string to `parse()`. We wrap each format's `.parse()` to run `extractFootnoteReferences()` on the raw content and merge the result.
