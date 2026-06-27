import { describe, test, expect } from "bun:test";
import { BlogPostFormat, blogPostMarkdown } from "./blog-post";

describe("blog-post example", () => {
  test("parses frontmatter and body", () => {
    const result = BlogPostFormat.parse(blogPostMarkdown);
    expect(result.meta.title).toBe("Hello World");
    expect(result.meta.author).toBe("Ada");
    expect(result.body).toContain("first paragraph");
  });

  test("round-trips through stringify", () => {
    const data = BlogPostFormat.parse(blogPostMarkdown);
    const md = BlogPostFormat.stringify(data);
    expect(md).toContain("---");
    expect(md).toContain("title: Hello World");
    expect(md).toContain("This is the first paragraph");
  });

  test("parse after stringify yields same title", () => {
    const data = BlogPostFormat.parse(blogPostMarkdown);
    const md = BlogPostFormat.stringify(data);
    const roundTrip = BlogPostFormat.parse(md);
    expect(roundTrip.meta.title).toBe(data.meta.title);
  });
});
