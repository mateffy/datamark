import { describe, test, expect } from "bun:test";
import { FrontmatterFormat, frontmatterMarkdown } from "./format-frontmatter";

describe("format-frontmatter example", () => {
  test("parses typed frontmatter", () => {
    const result = FrontmatterFormat.parse(frontmatterMarkdown);
    expect(result.version).toBe("1.0.0");
    expect(result.author).toBe("Ada");
  });

  test("rejects invalid frontmatter", () => {
    expect(() =>
      FrontmatterFormat.parse("---\nversion: 1.0.0\n---\n\n# No author")
    ).toThrow();
  });
});
