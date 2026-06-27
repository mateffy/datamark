import { describe, test, expect } from "bun:test";
import { parse, stringify } from "../src/index";
import { sampleDoc, sampleBlocks, sampleBody } from "./parse-and-stringify";

describe("parse-and-stringify example", () => {
  test("parse creates a document with root section", () => {
    expect(sampleDoc.type).toBe("document");
    expect(sampleDoc.root.type).toBe("section");
    expect(sampleDoc.root.children.length).toBeGreaterThan(0);
  });

  test("stringify serializes back to markdown", () => {
    const md = stringify(sampleDoc);
    expect(md).toContain("# Hello");
    expect(md).toContain("paragraph");
  });

  test("parseBlocks returns flat block nodes", () => {
    expect(sampleBlocks.length).toBeGreaterThanOrEqual(2);
    expect(sampleBlocks.some((n) => n.type === "heading")).toBe(true);
    expect(sampleBlocks.some((n) => n.type === "paragraph")).toBe(true);
  });

  test("parseBody returns blocks without frontmatter handling", () => {
    expect(sampleBody.length).toBeGreaterThanOrEqual(1);
  });
});
