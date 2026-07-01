import { describe, test, expect } from "bun:test";
import { keepAChangelog } from "./keep-a-changelog";

describe("keepAChangelog", () => {
  // --------------------------------------------------------------------------
  // Happy path: minimal valid changelog
  // --------------------------------------------------------------------------
  test("parses a minimal changelog", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- Initial release.
`;
    const result = keepAChangelog.parse(md);
    expect(result.title).toBe("Changelog");
    expect(result.releases).toHaveLength(1);
    expect(result.releases[0]!.version).toBe("1.0.0");
    expect(result.releases[0]!.date).toBe("2024-01-15");
    expect(result.releases[0]!.yanked).toBe(false);
    expect(result.releases[0]!.categories.added).toHaveLength(1);
    expect(result.releases[0]!.categories.added[0]!.summary).toBe(
      "Initial release."
    );
  });

  // --------------------------------------------------------------------------
  // Round-trip fidelity
  // --------------------------------------------------------------------------
  test("round-trips a simple changelog", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- Initial release.
`;
    const parsed = keepAChangelog.parse(md);
    const serialized = keepAChangelog.stringify(parsed);
    const reparsed = keepAChangelog.parse(serialized);
    expect(reparsed.releases).toHaveLength(parsed.releases.length);
    expect(reparsed.releases[0]!.version).toBe(parsed.releases[0]!.version);
    expect(reparsed.releases[0]!.categories.added[0]!.summary).toBe(
      parsed.releases[0]!.categories.added[0]!.summary
    );
  });

  // --------------------------------------------------------------------------
  // Unreleased section
  // --------------------------------------------------------------------------
  test("parses unreleased section with no date", () => {
    const md = `# Changelog

## [Unreleased]

### Added

- Work in progress feature.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.version).toBe("Unreleased");
    expect(result.releases[0]!.date).toBeNull();
    expect(result.releases[0]!.categories.added[0]!.summary).toBe(
      "Work in progress feature."
    );
  });

  // --------------------------------------------------------------------------
  // Yanked releases
  // --------------------------------------------------------------------------
  test("detects yanked releases", () => {
    const md = `# Changelog

## [1.0.1] - 2024-03-10 [YANKED]

### Fixed

- Hotfix.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.yanked).toBe(true);
  });

  // --------------------------------------------------------------------------
  // All standard categories
  // --------------------------------------------------------------------------
  test("parses all six standard categories", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added
- New thing.

### Changed
- Modified thing.

### Deprecated
- Old thing.

### Removed
- Deleted thing.

### Fixed
- Bug fix.

### Security
- CVE fix.
`;
    const result = keepAChangelog.parse(md);
    const cats = result.releases[0]!.categories;
    expect(cats.added).toHaveLength(1);
    expect(cats.changed).toHaveLength(1);
    expect(cats.deprecated).toHaveLength(1);
    expect(cats.removed).toHaveLength(1);
    expect(cats.fixed).toHaveLength(1);
    expect(cats.security).toHaveLength(1);
  });

  // --------------------------------------------------------------------------
  // Images in change entries
  // --------------------------------------------------------------------------
  test("extracts images from change entries", () => {
    const md = `# Changelog

## [1.1.0] - 2024-06-12

### Added

- Added user profiles with avatars.
  ![avatar preview](https://example.com/avatar.png "User avatar")
`;
    const result = keepAChangelog.parse(md);
    const change = result.releases[0]!.categories.added[0]!;
    expect(change.images).toHaveLength(1);
    expect(change.images[0]!.alt).toBe("avatar preview");
    expect(change.images[0]!.src).toBe("https://example.com/avatar.png");
    expect(change.images[0]!.title).toBe("User avatar");
  });

  // --------------------------------------------------------------------------
  // Links in change entries
  // --------------------------------------------------------------------------
  test("extracts links from change entries", () => {
    const md = `# Changelog

## [1.1.0] - 2024-06-12

### Changed

- Updated the [dashboard](https://example.com/dash "Docs") layout.
`;
    const result = keepAChangelog.parse(md);
    const change = result.releases[0]!.categories.changed[0]!;
    expect(change.links).toHaveLength(1);
    expect(change.links[0]!.text).toBe("dashboard");
    expect(change.links[0]!.href).toBe("https://example.com/dash");
    expect(change.links[0]!.title).toBe("Docs");
  });

  // --------------------------------------------------------------------------
  // Issue / PR references
  // --------------------------------------------------------------------------
  test("extracts issue references", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Fixed

- Resolved bug (#42, #43).
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.categories.fixed[0]!.references).toEqual([
      "#42",
      "#43",
    ]);
  });

  // --------------------------------------------------------------------------
  // Code spans in entries
  // --------------------------------------------------------------------------
  test("preserves code spans in markdown field", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- Support for \`async\` iterators.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.categories.added[0]!.markdown).toContain(
      "`async`"
    );
  });

  // --------------------------------------------------------------------------
  // Preamble extraction
  // --------------------------------------------------------------------------
  test("extracts preamble text", () => {
    const md = `# Changelog

All notable changes.

Based on Keep a Changelog.

## [1.0.0] - 2024-01-15

### Added

- First.
`;
    const result = keepAChangelog.parse(md);
    expect(result.preamble).toContain("All notable changes");
    expect(result.preamble).toContain("Based on Keep a Changelog");
  });

  // --------------------------------------------------------------------------
  // Reference links
  // --------------------------------------------------------------------------
  test("extracts footnote reference links", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- Release.

[1.0.0]: https://github.com/org/repo/releases/tag/v1.0.0
[unreleased]: https://github.com/org/repo/compare/v1.0.0...HEAD
`;
    const result = keepAChangelog.parse(md);
    expect(result.references["1.0.0"]).toBe(
      "https://github.com/org/repo/releases/tag/v1.0.0"
    );
    expect(result.references.unreleased).toBe(
      "https://github.com/org/repo/compare/v1.0.0...HEAD"
    );
  });

  // --------------------------------------------------------------------------
  // Multiple versions
  // --------------------------------------------------------------------------
  test("parses multiple versions in order", () => {
    const md = `# Changelog

## [Unreleased]

## [1.1.0] - 2024-06-01

### Added
- Feature.

## [1.0.0] - 2024-01-01

### Added
- First.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases).toHaveLength(3);
    expect(result.releases[0]!.version).toBe("Unreleased");
    expect(result.releases[1]!.version).toBe("1.1.0");
    expect(result.releases[2]!.version).toBe("1.0.0");
  });

  // --------------------------------------------------------------------------
  // Empty categories are omitted on stringify
  // --------------------------------------------------------------------------
  test("stringify omits empty categories", () => {
    const data = keepAChangelog.parse(`# Changelog
## [1.0.0] - 2024-01-15
### Added
- One.
`);
    const md = keepAChangelog.stringify(data);
    expect(md).toContain("### Added");
    expect(md).not.toContain("### Changed");
    expect(md).not.toContain("### Deprecated");
  });

  // --------------------------------------------------------------------------
  // Lists without category heading go to "other"
  // --------------------------------------------------------------------------
  test("uncategorized lists go to other category", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

- Something random.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.categories.other).toHaveLength(1);
    expect(result.releases[0]!.categories.other[0]!.summary).toBe(
      "Something random."
    );
  });

  // --------------------------------------------------------------------------
  // Real-world complex example (Tailwind-style)
  // --------------------------------------------------------------------------
  test("handles tailwindcss-style dense changelog", () => {
    const md = `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

- Allow \`@tailwindcss/cli\` in \`--watch\` mode to use polling with \`--poll\` when filesystem events are unreliable or unavailable ([#20297](https://github.com/tailwindlabs/tailwindcss/pull/20297))

## [4.3.2] - 2026-06-26

### Fixed

- Support bare spacing values for \`auto-rows-*\` and \`auto-cols-*\` utilities ([#20229](https://github.com/tailwindlabs/tailwindcss/pull/20229))
- Prevent \`@tailwindcss/cli\` in \`--watch\` mode from crashing on Windows when \`@source\` points to a directory that doesn't exist ([#20242](https://github.com/tailwindlabs/tailwindcss/pull/20242))

### Changed

- Generate \`0\` instead of \`calc(var(--spacing) * 0)\` for spacing utilities like \`m-0\` and \`left-0\` ([#20196](https://github.com/tailwindlabs/tailwindcss/pull/20196))
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases).toHaveLength(2);
    expect(result.releases[0]!.version).toBe("Unreleased");
    expect(result.releases[1]!.version).toBe("4.3.2");
    expect(result.releases[1]!.categories.fixed).toHaveLength(2);
    expect(result.releases[1]!.categories.changed).toHaveLength(1);
    expect(result.releases[1]!.categories.fixed[0]!.links[0]!.href).toBe(
      "https://github.com/tailwindlabs/tailwindcss/pull/20229"
    );
  });

  // --------------------------------------------------------------------------
  // Built-in examples pass self-test
  // --------------------------------------------------------------------------
  test("built-in examples pass .test()", () => {
    const result = keepAChangelog.test();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  // --------------------------------------------------------------------------
  // Summary paragraph before categories
  // --------------------------------------------------------------------------
  test("parses summary paragraph before categories", () => {
    const md = `# Changelog

## [2.0.0] - 2024-01-01

This is a major rewrite with breaking changes.

### Added

- New API.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.summary).toBe(
      "This is a major rewrite with breaking changes."
    );
  });

  // --------------------------------------------------------------------------
  // Nested lists inside change entries
  // --------------------------------------------------------------------------
  test("handles nested list items in change entries", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- Major feature:
  - Sub-item one.
  - Sub-item two.
`;
    const result = keepAChangelog.parse(md);
    const change = result.releases[0]!.categories.added[0]!;
    expect(change.markdown).toContain("Sub-item one");
    expect(change.markdown).toContain("Sub-item two");
  });

  // --------------------------------------------------------------------------
  // Multiple images in single entry
  // --------------------------------------------------------------------------
  test("extracts multiple images from a single entry", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- Before ![before](https://a.com/before.png) and after ![after](https://a.com/after.png).
`;
    const result = keepAChangelog.parse(md);
    const change = result.releases[0]!.categories.added[0]!;
    expect(change.images).toHaveLength(2);
    expect(change.images[0]!.alt).toBe("before");
    expect(change.images[1]!.alt).toBe("after");
  });

  // --------------------------------------------------------------------------
  // Blockquote inside list item
  // --------------------------------------------------------------------------
  test("preserves blockquote inside list item", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- Feature with quote:
  > Important note about usage.
`;
    const result = keepAChangelog.parse(md);
    const change = result.releases[0]!.categories.added[0]!;
    expect(change.markdown).toContain("> Important note about usage.");
  });

  // --------------------------------------------------------------------------
  // Missing date
  // --------------------------------------------------------------------------
  test("handles version heading without date", () => {
    const md = `# Changelog

## [1.0.0]

### Added

- Release.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.version).toBe("1.0.0");
    expect(result.releases[0]!.date).toBeNull();
  });

  // --------------------------------------------------------------------------
  // Entry with no list (just paragraph under heading)
  // --------------------------------------------------------------------------
  test("handles non-list content under version as summary", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

Just a plain paragraph.

### Added

- Real entry.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.categories.added).toHaveLength(1);
    expect(result.releases[0]!.summary).toBe("Just a plain paragraph.");
  });

  // --------------------------------------------------------------------------
  // Version with no categories at all — plain paragraph only
  // --------------------------------------------------------------------------
  test("handles version with only a plain paragraph and no categories", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

Just a plain paragraph with no categories.
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.version).toBe("1.0.0");
    expect(result.releases[0]!.summary).toBe(
      "Just a plain paragraph with no categories."
    );
    expect(result.releases[0]!.categories.added).toHaveLength(0);
  });

  // --------------------------------------------------------------------------
  // Complex inline formatting: bold, italic, code, links mixed
  // --------------------------------------------------------------------------
  test("preserves mixed inline formatting in markdown", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- **Bold** and *italic* and \`code\` and [link](https://a.com) together.
`;
    const result = keepAChangelog.parse(md);
    const change = result.releases[0]!.categories.added[0]!;
    expect(change.markdown).toContain("**Bold**");
    expect(change.markdown).toContain("*italic*");
    expect(change.markdown).toContain("`code`");
    expect(change.markdown).toContain("[link](https://a.com)");
    expect(change.summary).toBe("Bold and italic and code and link together.");
    expect(change.links[0]!.href).toBe("https://a.com");
  });

  // --------------------------------------------------------------------------
  // Entry with commit hash reference
  // --------------------------------------------------------------------------
  test("extracts commit hashes", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Fixed

- Bug fix ([a1b2c3d](https://github.com/org/repo/commit/a1b2c3d)).
`;
    const result = keepAChangelog.parse(md);
    expect(result.releases[0]!.categories.fixed[0]!.commits).toEqual([
      "a1b2c3d",
    ]);
  });
});
