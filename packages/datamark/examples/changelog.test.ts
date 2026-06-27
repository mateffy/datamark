import { describe, test, expect } from "bun:test";
import { ChangelogFormat, changelogMarkdown } from "./changelog";

describe("changelog example", () => {
  test("parses versions with dates", () => {
    const result = ChangelogFormat.parse(changelogMarkdown);
    expect(result.versions).toHaveLength(2);
    expect(result.versions[0].version).toBe("1.2.0");
    expect(result.versions[0].date).toBe("2026-06-15");
    expect(result.versions[0].changes).toHaveLength(3);
  });

  test("round-trips through stringify", () => {
    const data = ChangelogFormat.parse(changelogMarkdown);
    const md = ChangelogFormat.stringify(data);
    expect(md).toContain("# Changelog");
    expect(md).toContain("1.2.0");
    expect(md).toContain("Added dark mode support");
  });
});
