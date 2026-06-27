import { describe, test, expect } from "bun:test";
import { firstH1, allHeadings, allCodeBlocks, paragraphs } from "./tree-query";

describe("tree-query example", () => {
  test("find returns first matching node", () => {
    expect(firstH1).toBeDefined();
    expect(firstH1!.type).toBe("heading");
  });

  test("findAll returns all matching nodes", () => {
    expect(allHeadings.length).toBeGreaterThanOrEqual(2);
  });

  test("findAll with isCodeBlock filters by language", () => {
    expect(allCodeBlocks.length).toBe(1);
    expect(allCodeBlocks[0].type).toBe("code");
    expect((allCodeBlocks[0] as any).lang).toBe("typescript");
  });

  test("filter returns top-level matches only", () => {
    expect(paragraphs.every((n) => n.type === "paragraph")).toBe(true);
  });
});
