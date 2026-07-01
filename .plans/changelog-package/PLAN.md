# @datamark/changelog Implementation Plan

> **Status:** DRAFT
> **Plan:** `./.plans/changelog-package/PLAN.md`
> **Last updated:** 2026-07-02

---

## Goal

Create a new `@datamark/changelog` package containing predefined, robust Markdown changelog `Format` definitions that parse and stringify the most common changelog conventions used in open source.

## Approach

Build on top of the existing `datamark` core package's `datamark()` Format SDK. Each changelog format is a `Format<T>` object with a Zod schema for validation, a parse function that transforms the AST into structured data, and a stringify function that serializes back to Markdown.

Four formats are implemented based on real-world research:
1. **Keep a Changelog** — the de-facto standard (`## [1.2.3] - 2024-01-01`, `### Added`, etc.)
2. **Conventional Changelog (Angular)** — commit-convention based with type prefixes and scopes
3. **GitHub Releases** — heading style `## v1.0.0 (2024-01-01)` with compare URLs
4. **Common Changelog** — stricter subset of Keep a Changelog with footnote link references

A shared `ChangelogEntry` / `ChangelogChange` type model underlies all formats. A robust `utils.ts` module provides regex-based version heading extraction, category classification, and inline parsing (links, images, references) that all formats reuse.

Tests are colocated, exhaustive, and cover happy paths, edge cases (images in entries, nested lists, empty categories, yanked releases, missing dates), and round-trip parse→stringify→parse fidelity.

## Tech stack & conventions

- **Runtime / test runner:** Bun (`bun:test`)
- **Schema validation:** Zod v4 (peer/dev dep, already used in `datamark`)
- **Markdown parsing:** `datamark` core (marked-based AST)
- **Colocation:** Tests live beside source (`*.test.ts`)
- **No new runtime deps** beyond `datamark` and `zod` (already in workspace)

---

## Context & orientation

The `datamark` core package (`packages/datamark`) exports:
- `datamark(config)` — creates a `Format<T>` with `.parse()`, `.stringify()`, `.test()`, `.docs()`
- `parse()` — parses markdown string → `Document` (frontmatter + section tree)
- Tree utilities (`findAll`, `sectionsAtDepth`, `inlineText`, `textContent`, etc.) for AST traversal
- Stringify utilities (`heading`, `list`, `link`, `image`, etc.) for building markdown

The new package lives at `packages/changelog` and imports from `datamark`.

---

## Scope

**In scope:**
- `packages/changelog/package.json`
- `packages/changelog/src/index.ts`
- `packages/changelog/src/types.ts`
- `packages/changelog/src/utils.ts`
- `packages/changelog/src/keep-a-changelog.ts` (+ `.test.ts`)
- `packages/changelog/src/conventional-changelog.ts` (+ `.test.ts`)
- `packages/changelog/src/github-releases.ts` (+ `.test.ts`)
- `packages/changelog/src/common-changelog.ts` (+ `.test.ts`)
- `packages/changelog/TESTING.md`
- Update root `package.json` workspaces if needed

**Out of scope:**
- CLI tooling for changelog generation
- Git log parsing / commit message analysis
- Documentation website updates (but will mention it exists)

**Forbidden:**
- Do NOT add dependencies other than `datamark` and `zod`.
- Do NOT modify `packages/datamark` source.

---

## Acceptance criteria

- `bun test packages/changelog` passes with ≥ 60 tests across all formats.
- Each format's `.test()` method (from the Format SDK) also passes on its built-in examples.
- The package exports at least 4 format objects.
- Complex markdown (images, nested inline links, code spans, blockquotes inside list items) is parsed without data loss.
- Round-trip parse→stringify produces semantically equivalent markdown for valid inputs.

---

## Phases & tasks

### Phase 1: Package scaffolding

Create the package skeleton, dependencies, and shared types.

#### Task 1.1: Package manifest and shared code
**Files:**
- Create: `packages/changelog/package.json`
- Create: `packages/changelog/src/types.ts`
- Create: `packages/changelog/src/utils.ts`
- Create: `packages/changelog/src/index.ts`

**Steps:**
- Write `package.json` with name `@datamark/changelog`, type `"module"`, deps on `datamark` and `zod`.
- Write `types.ts`: `Changelog`, `Release`, `Change`, `ChangeCategory` types.
- Write `utils.ts`: `extractVersionInfo(headingText)`, `parseChangeItems(listNode)`, `classifyCategory(headingText)`, `buildChangesMarkdown(changes)`, `normalizeDate(dateStr)`.
- Write `index.ts`: re-export formats and types.

### Phase 2: Keep a Changelog format

The most widely used format. Versions are `## [X.Y.Z] - YYYY-MM-DD` or `## [Unreleased]`. Categories are `### Added`, `### Changed`, `### Deprecated`, `### Removed`, `### Fixed`, `### Security`. Supports `[YANKED]` marker.

#### Task 2.1: Implementation + exhaustive tests
**Files:**
- Create: `packages/changelog/src/keep-a-changelog.ts`
- Create: `packages/changelog/src/keep-a-changelog.test.ts`

**Steps:**
- Implement parse that walks depth-2 sections (version headings) then depth-3 sections (category headings).
- Extract version from `[version]` brackets, date after `-`, detect `[YANKED]`.
- Parse each list item as a `Change`, preserving inline nodes (links, images, code).
- Implement stringify.
- Write tests: simple changelog, multiple versions, unreleased, yanked, images in entries, nested links, empty categories, missing dates, complex real-world examples.

### Phase 3: Conventional Changelog format

Based on Angular/Conventional Commits conventions. Categories like `### Bug Fixes`, `### Features`, `### Performance Improvements`, `### Reverts`. Entries often include commit hashes and issue refs.

#### Task 3.1: Implementation + tests
**Files:**
- Create: `packages/changelog/src/conventional-changelog.ts`
- Create: `packages/changelog/src/conventional-changelog.test.ts`

**Steps:**
- Implement parse supporting heading styles like `## [1.0.0](url) (YYYY-MM-DD)` or `## 1.0.0 (YYYY-MM-DD)`.
- Support categories: Bug Fixes, Features, Performance Improvements, Code Refactoring, Reverts, Documentation, Tests, Build, CI, Chore, Style.
- Parse inline commit references like `([abc123](url))` and issue refs `(#123)`.
- Tests include Axios-style real-world examples with images in contributor sections.

### Phase 4: GitHub Releases format

Simpler format with `## v1.0.0` or `## v1.0.0 (2024-01-01)` headings and flexible categories.

#### Task 4.1: Implementation + tests
**Files:**
- Create: `packages/changelog/src/github-releases.ts`
- Create: `packages/changelog/src/github-releases.test.ts`

**Steps:**
- Parse `## vX.Y.Z` headings with optional date in parens.
- Flexible category detection (any h3 heading).
- Support PR links like `([#123](url))` inline.
- Round-trip tests.

### Phase 5: Common Changelog format

Stricter Keep a Changelog subset with footnote reference links at the bottom.

#### Task 5.1: Implementation + tests
**Files:**
- Create: `packages/changelog/src/common-changelog.ts`
- Create: `packages/changelog/src/common-changelog.test.ts`

**Steps:**
- Similar to Keep a Changelog but requires reference links for versions.
- Support summary paragraphs before categories.
- Tests for footnote link preservation.

### Phase 6: Validation & documentation

#### Task 6.1: Final validation
- Run all tests: `bun test packages/changelog`
- Ensure `bun test` from repo root also picks them up.
- Write `TESTING.md`.

---

## Progress

**This section is maintained by the implementing agent.**

### Phase completion
- [ ] Phase 1: Package scaffolding
- [ ] Phase 2: Keep a Changelog
- [ ] Phase 3: Conventional Changelog
- [ ] Phase 4: GitHub Releases
- [ ] Phase 5: Common Changelog
- [ ] Phase 6: Validation & docs

### Session log
*(no entries yet)*
