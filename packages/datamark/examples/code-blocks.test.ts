import { describe, test, expect } from "bun:test";
import { allBlocks, typescriptBlocks, isTypescript } from "./code-blocks";

describe("code-blocks example", () => {
  test("codeBlocks extracts all code blocks", () => {
    expect(allBlocks.length).toBeGreaterThanOrEqual(1);
  });

  test("codeBlocks with lang filter", () => {
    expect(typescriptBlocks.length).toBe(1);
    expect(typescriptBlocks[0].lang).toBe("typescript");
  });

  test("isCodeBlock checks language", () => {
    expect(isTypescript).toBe(true);
  });
});
