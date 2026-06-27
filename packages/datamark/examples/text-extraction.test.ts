import { describe, test, expect } from "bun:test";
import { fullBodyText, serialized } from "./text-extraction";

describe("text-extraction example", () => {
  test("textContent extracts all text recursively", () => {
    expect(fullBodyText).toContain("Hello");
    expect(fullBodyText).toContain("paragraph");
    expect(fullBodyText).toContain("const x = 1");
  });

  test("toMarkdown serializes blocks back to markdown", () => {
    expect(serialized).toContain("# Hello");
    expect(serialized).toContain("paragraph");
  });
});
