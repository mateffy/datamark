import { describe, test, expect } from "bun:test";
import { extracted, split, noFrontmatter } from "./frontmatter";

describe("frontmatter example", () => {
  test("extractFrontmatter extracts YAML fence", () => {
    expect(extracted).toBeDefined();
    expect(extracted!.frontmatter).toContain("title: Hello");
  });

  test("splitFrontmatter separates frontmatter and body", () => {
    expect(split.frontmatter).toContain("title: Hello");
    expect(split.body).toContain("# Body");
  });

  test("splitFrontmatter handles missing frontmatter", () => {
    expect(noFrontmatter.frontmatter).toBe("");
    expect(noFrontmatter.body).toContain("# No frontmatter");
  });
});
