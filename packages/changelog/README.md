# `@datamark/changelog`

Predefined changelog formats for the datamark format system. Four ready-to-use `datamark()` formats with full Zod schemas, bidirectional parse/stringify, and round-trip fidelity against real-world changelogs.

| Format | Import | Heading style | Best for |
|---|---|---|---|
| **Keep a Changelog** | `keepAChangelog` | `## [1.2.3] - 2024-01-01` | Open source projects following [keepachangelog.com](https://keepachangelog.com/) |
| **Conventional** | `conventionalChangelog` | `## [1.2.3](compare-url) (2024-01-01)` | Angular / [conventional-commits](https://www.conventionalcommits.org/) style |
| **GitHub Releases** | `githubReleases` | `## v1.2.3 (2024-01-01)` | GitHub Releases UI mirrors |
| **Common Changelog** | `commonChangelog` | `## [1.2.3] - 2024-01-01` with summaries | [common-changelog.org](https://common-changelog.org/) style |

---

## Quick start

```bash
npm install @datamark/changelog
# or
bun add @datamark/changelog
```

```typescript
import { keepAChangelog } from "@datamark/changelog";

const data = keepAChangelog.parse(markdown);
const md   = keepAChangelog.stringify(data);

// Self-test built-in examples against the Zod schema
const result = keepAChangelog.test();
console.log(result.passed); // true
```

Every format returns the same `Changelog` data model (see below). Parse a file, mutate the typed data, stringify it back.

---

## Data model

```typescript
interface Changelog {
  title: string;
  preamble: string | null;
  releases: Release[];
  references: Record<string, string>;
}

interface Release {
  version: string;
  date: string | null;
  yanked: boolean;
  url: string | null;
  summary: string | null;
  categories: Record<ChangeCategory, Change[]>;
}

interface Change {
  summary: string;
  markdown: string;
  references: string[];
  commits: string[];
  links: Array<{ text: string; href: string; title?: string }>;
  images: Array<{ alt: string; src: string; title?: string }>;
}

type ChangeCategory =
  | "added" | "changed" | "deprecated" | "removed" | "fixed" | "security"
  | "bug fixes" | "features" | "performance improvements"
  | "code refactoring" | "reverts" | "documentation"
  | "tests" | "build" | "ci" | "chore" | "style" | "other";
```

- **`summary`** — plain text of the change entry, omitting image alt text (images are visual; their alt text should not pollute text extraction).
- **`markdown`** — full Markdown string of the list item, suitable for round-tripping. Preserves inline formatting: `**bold**`, `*italic*`, `` `code` ``, `[links](url)`, `![images](url)`, blockquotes, and nested lists.
- **`references`** — issue/PR references like `#123` extracted from `(#123)` patterns.
- **`commits`** — short commit hashes like `abc1234` extracted from `([abc1234](url))` or `` `abc1234` `` patterns.
- **`references`** (top-level) — footnote link definitions `[1.0.0]: url` extracted from raw markdown (the `datamark()` SDK does not expose raw text to `parse()`, so each format wraps `.parse()` to scan the original string).

---

## Format reference

### Keep a Changelog

```typescript
import { keepAChangelog } from "@datamark/changelog";

const data = keepAChangelog.parse(`
# Changelog

## [1.1.0] - 2024-06-12

### Added

- Added user profiles with avatars.
  ![avatar preview](https://example.com/avatar.png "User avatar")
- Bulk export to CSV.

### Fixed

- Resolved memory leak in batch processor (#142).

## [1.0.1] - 2024-03-10 [YANKED]

### Fixed

- Hotfix for login redirect.
`);

// Yanked release
console.log(data.releases[1].yanked); // true

// Image extraction
const change = data.releases[0].categories.added[0];
console.log(change.images[0].src);   // "https://example.com/avatar.png"
console.log(change.images[0].alt);   // "avatar preview"
console.log(change.images[0].title); // "User avatar"

// Issue reference
console.log(data.releases[0].categories.fixed[0].references); // ["#142"]
```

Detects `[YANKED]`, the six standard categories, unreleased sections, and footnote reference links at the bottom.

### Conventional Changelog

```typescript
import { conventionalChangelog } from "@datamark/changelog";

const data = conventionalChangelog.parse(`
## [1.13.3](https://github.com/axios/axios/compare/v1.13.2...v1.13.3) (2026-01-20)

### Bug Fixes

- **http2:** Use port 443 for HTTPS connections by default. ([#7256](https://github.com/axios/axios/issues/7256)) ([d7e6065](https://github.com/axios/axios/commit/d7e6065))

### Features

- add \`undefined\` as a value in AxiosRequestConfig ([#5560](https://github.com/axios/axios/issues/5560)) ([095033c](https://github.com/axios/axios/commit/095033c))

### Reverts

- Revert "fix: silentJSONParsing=false should throw on invalid JSON" ([#7298](https://github.com/axios/axios/issues/7298)) ([a4230f5](https://github.com/axios/axios/commit/a4230f5))
`);

console.log(data.releases[0].version);  // "1.13.3"
console.log(data.releases[0].date);     // "2026-01-20"
console.log(data.releases[0].url);      // "https://github.com/axios/axios/compare/v1.13.2...v1.13.3"

const bugFix = data.releases[0].categories["bug fixes"][0];
console.log(bugFix.commits);            // ["d7e6065"]
console.log(bugFix.references);         // ["#7256"]
console.log(bugFix.links[0].href);      // "https://github.com/axios/axios/issues/7256"
```

Categories: Bug Fixes, Features, Performance Improvements, Code Refactoring, Reverts, Documentation, Tests, Build, CI, Chore, Style. Handles compare URLs, commit hashes, scoped entries (`**http2:** fix...`), and issue/PR references.

### GitHub Releases

```typescript
import { githubReleases } from "@datamark/changelog";

const data = githubReleases.parse(`
## v1.0.0 (2024-01-15)

### What's Changed

- New dashboard by @user in [#1](https://github.com/org/repo/pull/1)

### Fixed

- Resolved startup crash (#2)
`);

console.log(data.releases[0].version);  // "1.0.0"
console.log(data.releases[0].date);       // "2024-01-15"
console.log(data.releases[0].categories.fixed[0].references); // ["#2"]
```

Flexible category detection — any h3 heading becomes a category. `v`-prefixed versions. No-op on missing dates.

### Common Changelog

```typescript
import { commonChangelog } from "@datamark/changelog";

const data = commonChangelog.parse(`
# Changelog

## [1.1.0] - 2024-06-12

This release adds user profiles and improves the dashboard.

### Added

- User profiles with avatars.

[1.1.0]: https://github.com/org/repo/compare/v1.0.0...v1.1.0
`);

console.log(data.releases[0].summary);
// "This release adds user profiles and improves the dashboard."

console.log(data.references["1.1.0"]);
// "https://github.com/org/repo/compare/v1.0.0...v1.1.0"
```

Stricter subset of Keep a Changelog with per-release summary paragraphs and footnote link preservation.

---

## Shared utilities

Build your own changelog format by composing low-level utilities:

```typescript
import {
  extractVersionInfo,        // "[1.0.0] - 2024-01-01" -> { version, date, yanked, url }
  classifyCategory,          // "Bug Fixes" -> "bug fixes"
  parseChangeItem,         // ListItemNode -> Change
  buildVersionHeading,     // "keep" | "conventional" | "github" style
  buildCategoryHeading,    // "added" -> "### Added"
  buildChangesMarkdown,    // Change[] -> "- One\n- Two"
  extractFootnoteReferences, // raw markdown -> Record<string, string>
  headingRawText,          // join raw tokens from a heading (preserves brackets)
  inlineSummary,           // inline text without image alt text
} from "@datamark/changelog";
```

---

## Robustness

- **Images in list items** — parsed even on continuation lines. Required a fix to `datamark`'s `tree.ts` to flatten `marked`'s wrapped text tokens.
- **Links and code spans** — preserved in `markdown`, extracted in `links`.
- **Commit hashes** — `([abc1234](url))` and `` `abc1234` `` both captured.
- **Issue/PR references** — `(#123)` and `(#123, #456)` extracted.
- **Footnote reference links** — `[1.0.0]: url` at the bottom of the file.
- **Link-reference headings** — when `marked` parses `[1.0.0]` as a link due to a footnote definition, `headingRawText` reconstructs the brackets from `raw` values so regex matching still works.
- **Blockquotes in list items** — preserved in round-trip output.
- **Nested lists** — sub-items captured in `markdown`.
- **Yanked releases** — `[YANKED]` flag detected.
- **Missing dates** — handled as `null`.
- **Plain paragraphs without categories** — captured as `summary` or `other`.
- **Round-trip fidelity** — parse -> stringify -> parse produces equivalent data.

---

## Testing

Colocated with source (`*.test.ts`), Bun runner:

```bash
bun test packages/changelog
```

42 tests across 4 files. Every format includes happy-path, round-trip, real-world (Tailwind CSS / Axios), and edge-case coverage. Each format's built-in examples are self-tested via `format.test()` against its Zod schema.

---

## License

MIT
