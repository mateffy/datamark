import { describe, test, expect } from "bun:test";
import {
  extractFrontmatter,
  splitFrontmatter,
  FrontmatterError,
} from "./frontmatter";

describe("extractFrontmatter", () => {
  test("extracts triple-dash frontmatter with body", () => {
    const result = extractFrontmatter("---\nfoo: bar\n---\nHello world");
    expect(result).toEqual({ frontmatter: "foo: bar", body: "Hello world" });
  });

  test("handles no trailing newline after closing fence", () => {
    const result = extractFrontmatter("---\nfoo: bar\n---");
    expect(result).toEqual({ frontmatter: "foo: bar", body: "" });
  });

  test("extracts triple-plus frontmatter with body", () => {
    const result = extractFrontmatter("+++\nfoo: bar\n+++\nHello world");
    expect(result).toEqual({ frontmatter: "foo: bar", body: "Hello world" });
  });

  test("tolerates extra whitespace on opening fence", () => {
    const result = extractFrontmatter("---   \nfoo: bar\n---\nHello world");
    expect(result).toEqual({ frontmatter: "foo: bar", body: "Hello world" });
  });

  test("handles multiline frontmatter", () => {
    const result = extractFrontmatter("---\nfoo: bar\nbaz: qux\n---\nHello world");
    expect(result).toEqual({ frontmatter: "foo: bar\nbaz: qux", body: "Hello world" });
  });

  test("returns null when no frontmatter is present", () => {
    const result = extractFrontmatter("Hello world");
    expect(result).toBeNull();
  });

  test("returns null when closing fence is missing", () => {
    const result = extractFrontmatter("---\nfoo: bar\nHello world");
    expect(result).toBeNull();
  });

  test("prefers triple-dash over triple-plus", () => {
    const result = extractFrontmatter(
      "---\nfoo: bar\n---\n+++\nbaz: qux\n+++\n"
    );
    expect(result).toEqual({ frontmatter: "foo: bar", body: "+++\nbaz: qux\n+++\n" });
  });

  test("handles empty frontmatter body", () => {
    const result = extractFrontmatter("---\n\n---\nbody text");
    expect(result).toEqual({ frontmatter: "", body: "body text" });
  });

  test("handles frontmatter with only whitespace", () => {
    const result = extractFrontmatter("---\n   \n---\nbody text");
    expect(result).toEqual({ frontmatter: "   ", body: "body text" });
  });
});

describe("splitFrontmatter", () => {
  test("splits correctly with valid fences", () => {
    const result = splitFrontmatter("---\nfoo: bar\n---\nHello world");
    expect(result).toEqual({ frontmatter: "foo: bar", body: "Hello world" });
  });

  test("returns full content as body when no opening fence", () => {
    const result = splitFrontmatter("Hello world");
    expect(result).toEqual({ frontmatter: "", body: "Hello world" });
  });

  test("returns full content as body when no closing fence", () => {
    const result = splitFrontmatter("---\nfoo: bar\nHello world");
    expect(result).toEqual({ frontmatter: "", body: "---\nfoo: bar\nHello world" });
  });

  test("handles empty frontmatter between fences", () => {
    const result = splitFrontmatter("---\n---\nbody text");
    expect(result).toEqual({ frontmatter: "", body: "body text" });
  });

  test("trims body whitespace", () => {
    const result = splitFrontmatter("---\nfoo: bar\n---\n  Hello world  \n");
    expect(result).toEqual({ frontmatter: "foo: bar", body: "Hello world" });
  });
});

describe("FrontmatterError", () => {
  test("has correct properties, name, message and cause", () => {
    const cause = new Error("cause");
    const err = new FrontmatterError("test message", cause);
    expect(err).toBeInstanceOf(FrontmatterError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("FrontmatterError");
    expect(err.message).toBe("test message");
    expect(err.cause).toBe(cause);
  });
});
