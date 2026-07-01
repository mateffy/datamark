import { describe, test, expect } from "bun:test";
import { githubReleases } from "./github-releases";

describe("githubReleases", () => {
  test("parses v-prefixed version with date", () => {
    const md = `# Changelog

## v1.0.0 (2024-01-15)

### Added

- Initial release.
`;
    const result = githubReleases.parse(md);
    expect(result.releases[0]!.version).toBe("1.0.0");
    expect(result.releases[0]!.date).toBe("2024-01-15");
  });

  test("parses version without date", () => {
    const md = `# Changelog

## v2.0.0

### Fixed

- Bug fix.
`;
    const result = githubReleases.parse(md);
    expect(result.releases[0]!.version).toBe("2.0.0");
    expect(result.releases[0]!.date).toBeNull();
  });

  test("handles flexible category names", () => {
    const md = `# Changelog

## v1.0.0 (2024-01-15)

### What's Changed
- Feature A.

### Fixed
- Bug B.
`;
    const result = githubReleases.parse(md);
    expect(result.releases[0]!.categories.other).toHaveLength(1);
    expect(result.releases[0]!.categories.fixed).toHaveLength(1);
  });

  test("extracts PR links", () => {
    const md = `# Changelog

## v1.0.0 (2024-01-15)

### What's Changed

- New dashboard by @user in [#1](https://github.com/org/repo/pull/1)
`;
    const result = githubReleases.parse(md);
    const change = result.releases[0]!.categories.other[0]!;
    expect(change.links[0]!.href).toBe("https://github.com/org/repo/pull/1");
    expect(change.references).toEqual(["#1"]);
  });

  test("round-trips a changelog", () => {
    const md = `# Changelog

## v1.0.0 (2024-01-15)

### Added

- First.
`;
    const parsed = githubReleases.parse(md);
    const serialized = githubReleases.stringify(parsed);
    const reparsed = githubReleases.parse(serialized);
    expect(reparsed.releases[0]!.version).toBe("1.0.0");
  });

  test("built-in examples pass .test()", () => {
    const result = githubReleases.test();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });
});
