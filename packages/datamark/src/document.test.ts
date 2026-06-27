import { describe, test, expect } from "bun:test";
import { parse, stringify } from "./document";
import { YamlParseError } from "./yaml";
import type { HeadingNode, ParagraphNode } from "./tree";

describe("parse", () => {
  test("parses full doc with frontmatter and body", () => {
    const doc = parse("---\ntitle: Hello\n---\n# Hello\n\nBody text");
    expect(doc.frontmatter).toEqual({ title: "Hello" });
    expect(doc.children.length).toBeGreaterThan(0);
  });

  test("parses doc without frontmatter", () => {
    const doc = parse("# Hello\n\nBody text");
    expect(doc.frontmatter).toBeNull();
    expect(doc.children.length).toBeGreaterThan(0);
  });

  test("parses doc with empty body", () => {
    const doc = parse("---\ntitle: Hello\n---");
    expect(doc.frontmatter).toEqual({ title: "Hello" });
    expect(doc.children).toEqual([]);
  });

  test("uses splitFrontmatter path for malformed closing fence", () => {
    const doc = parse("---\nfoo: bar\n  ---\n# Hello\n\nBody");
    expect(doc.frontmatter).toEqual({ foo: "bar" });
    expect(doc.children.length).toBeGreaterThan(0);
  });

  test("position tracking exists on children", () => {
    const doc = parse("# Hello\n\nBody text");
    for (const child of doc.children) {
      expect(child.position).toBeDefined();
      expect(child.position).toHaveProperty("start");
      expect(child.position).toHaveProperty("end");
    }
    const h1 = doc.children[0] as HeadingNode;
    expect(h1.position!.start.line).toBe(1);
    expect(h1.position!.start.column).toBe(1);
  });

  test("invalid YAML in frontmatter throws YamlParseError", () => {
    expect(() => parse("---\nfoo: [}\n---\n# Hello")).toThrow(
      YamlParseError
    );
  });
});

describe("stringify", () => {
  const heading: HeadingNode = {
    type: "heading",
    depth: 1,
    children: [{ type: "text", value: "Hello", raw: "Hello" }],
    raw: "# Hello",
  };

  const paragraph: ParagraphNode = {
    type: "paragraph",
    children: [{ type: "text", value: "Body", raw: "Body" }],
    raw: "Body",
  };

  test("stringifies doc with frontmatter", () => {
    const doc = {
      type: "document" as const,
      frontmatter: { title: "Hello" },
      children: [heading, paragraph],
    };
    const result = stringify(doc);
    expect(result).toContain("---");
    expect(result).toContain("title: Hello");
    expect(result).toContain("# Hello");
    expect(result).toContain("Body");
  });

  test("stringifies doc without frontmatter", () => {
    const doc = {
      type: "document" as const,
      frontmatter: null,
      children: [heading],
    };
    const result = stringify(doc);
    expect(result).toBe("# Hello\n");
  });

  test("stringifies children only", () => {
    const doc = {
      type: "document" as const,
      frontmatter: null,
      children: [paragraph],
    };
    expect(stringify(doc)).toBe("Body\n");
  });

  test("stringifies empty children", () => {
    const doc = {
      type: "document" as const,
      frontmatter: null,
      children: [],
    };
    expect(stringify(doc)).toBe("\n");
  });

  test("empty frontmatter object is not emitted", () => {
    const doc = {
      type: "document" as const,
      frontmatter: {},
      children: [heading],
    };
    const result = stringify(doc);
    expect(result).not.toContain("---");
    expect(result).toBe("# Hello\n");
  });

  test("adds trailing newline", () => {
    const doc = {
      type: "document" as const,
      frontmatter: null,
      children: [paragraph],
    };
    const result = stringify(doc);
    expect(result.endsWith("\n")).toBe(true);
  });
});

describe("roundtrip", () => {
  test("parse then stringify produces valid markdown", () => {
    const input = "---\ntitle: Hello\n---\n# Hello\n\nBody text";
    const doc = parse(input);
    const output = stringify(doc);
    expect(output).toContain("# Hello");
    expect(output).toContain("Body text");
    expect(output.endsWith("\n")).toBe(true);
  });

  test("frontmatter roundtrip preserves data", () => {
    const input = "---\nfoo: bar\n---\n# Hello";
    const doc = parse(input);
    const output = stringify(doc);
    const doc2 = parse(output);
    expect(doc2.frontmatter).toEqual({ foo: "bar" });
  });
});
