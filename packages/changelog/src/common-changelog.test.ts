import { describe, test, expect } from "bun:test";
import { commonChangelog } from "./common-changelog";

describe("commonChangelog", () => {
  test("parses release with summary paragraph", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

This is a major release.

### Added

- First feature.
`;
    const result = commonChangelog.parse(md);
    expect(result.releases[0]!.summary).toBe("This is a major release.");
  });

  test("extracts reference links", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- Release.

[1.0.0]: https://github.com/org/repo/releases/tag/v1.0.0
`;
    const result = commonChangelog.parse(md);
    expect(result.references["1.0.0"]).toBe(
      "https://github.com/org/repo/releases/tag/v1.0.0"
    );
  });

  test("round-trips a changelog", () => {
    const md = `# Changelog

## [1.0.0] - 2024-01-15

### Added

- First.
`;
    const parsed = commonChangelog.parse(md);
    const serialized = commonChangelog.stringify(parsed);
    const reparsed = commonChangelog.parse(serialized);
    expect(reparsed.releases[0]!.version).toBe("1.0.0");
  });

  test("built-in examples pass .test()", () => {
    const result = commonChangelog.test();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });
});
