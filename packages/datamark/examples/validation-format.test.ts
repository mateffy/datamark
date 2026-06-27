import { describe, test, expect } from "bun:test";
import {
  MyFormat,
  BlogFormat,
  validBlogDoc,
  badAgeDoc,
  badFrontmatterDoc,
} from "./validation-format";
import { ValidationError } from "../src/parse";

describe("validation-format", () => {
  test("MyFormat returns typed data", () => {
    const result = MyFormat.parse(badAgeDoc);
    expect(result.name).toBe("Ada");
    expect(result.age).toBe(30);
  });

  test("BlogFormat validates frontmatter and extracts body", () => {
    const result = BlogFormat.parse(validBlogDoc);
    expect(result.meta.title).toBe("Hello");
    expect(result.meta.date).toBe("2024-01-01");
    expect(result.meta.author).toBe("Ada");
    expect(result.body).toContain("Body content here.");
  });

  test("BlogFormat throws ValidationError for bad frontmatter", () => {
    expect(() => BlogFormat.parse(badFrontmatterDoc)).toThrow(ValidationError);
  });
});
