import { describe, test, expect } from "bun:test";
import { conventionalChangelog } from "./conventional-changelog";

describe("conventionalChangelog", () => {
  test("parses version with compare URL and date", () => {
    const md = `# Changelog

## [1.0.0](https://github.com/org/repo/compare/v0.1.0...v1.0.0) (2024-01-15)

### Features

- New feature.
`;
    const result = conventionalChangelog.parse(md);
    expect(result.releases[0]!.version).toBe("1.0.0");
    expect(result.releases[0]!.date).toBe("2024-01-15");
    expect(result.releases[0]!.url).toBe(
      "https://github.com/org/repo/compare/v0.1.0...v1.0.0"
    );
  });

  test("parses version without URL", () => {
    const md = `# Changelog

## [1.0.0] (2024-01-15)

### Bug Fixes

- Fixed crash.
`;
    const result = conventionalChangelog.parse(md);
    expect(result.releases[0]!.version).toBe("1.0.0");
    expect(result.releases[0]!.url).toBeNull();
  });

  test("extracts commit hashes and issue references", () => {
    const md = `# Changelog

## [1.0.0] (2024-01-15)

### Bug Fixes

- Fix leak ([#42](https://github.com/org/repo/issues/42)) ([a1b2c3d](https://github.com/org/repo/commit/a1b2c3d))
`;
    const result = conventionalChangelog.parse(md);
    const change = result.releases[0]!.categories["bug fixes"][0]!;
    expect(change.references).toEqual(["#42"]);
    expect(change.commits).toEqual(["a1b2c3d"]);
    expect(change.links).toHaveLength(2);
  });

  test("parses all conventional categories", () => {
    const md = `# Changelog

## [1.0.0] (2024-01-15)

### Bug Fixes
- Fix.

### Features
- Feat.

### Performance Improvements
- Perf.

### Code Refactoring
- Refactor.

### Reverts
- Revert.

### Documentation
- Docs.

### Tests
- Test.

### Build
- Build.

### CI
- CI.

### Chore
- Chore.

### Style
- Style.
`;
    const result = conventionalChangelog.parse(md);
    const cats = result.releases[0]!.categories;
    expect(cats["bug fixes"]).toHaveLength(1);
    expect(cats.features).toHaveLength(1);
    expect(cats["performance improvements"]).toHaveLength(1);
    expect(cats["code refactoring"]).toHaveLength(1);
    expect(cats.reverts).toHaveLength(1);
    expect(cats.documentation).toHaveLength(1);
    expect(cats.tests).toHaveLength(1);
    expect(cats.build).toHaveLength(1);
    expect(cats.ci).toHaveLength(1);
    expect(cats.chore).toHaveLength(1);
    expect(cats.style).toHaveLength(1);
  });

  test("handles scoped conventional entries", () => {
    const md = `# Changelog

## [1.0.0] (2024-01-15)

### Bug Fixes

- **http:** fixed a regression that caused the data stream to be interrupted.
- **types:** fixed env config types.
`;
    const result = conventionalChangelog.parse(md);
    expect(result.releases[0]!.categories["bug fixes"]).toHaveLength(2);
    expect(
      result.releases[0]!.categories["bug fixes"][0]!.summary
    ).toContain("http:");
  });

  test("round-trips a changelog", () => {
    const md = `# Changelog

## [1.0.0] (2024-01-15)

### Features

- First feature.
`;
    const parsed = conventionalChangelog.parse(md);
    const serialized = conventionalChangelog.stringify(parsed);
    const reparsed = conventionalChangelog.parse(serialized);
    expect(reparsed.releases[0]!.version).toBe("1.0.0");
    expect(reparsed.releases[0]!.categories.features[0]!.summary).toBe(
      "First feature."
    );
  });

  test("built-in examples pass .test()", () => {
    const result = conventionalChangelog.test();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });
});
