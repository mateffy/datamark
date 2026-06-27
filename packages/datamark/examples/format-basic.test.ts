import { describe, test, expect } from "bun:test";
import { BasicFormat } from "./format-basic";

describe("format-basic example", () => {
  test("parses title from markdown", () => {
    const result = BasicFormat.parse("# Hello World\n\nBody");
    expect(result.title).toBe("Hello World");
  });

  test("schema validates output", () => {
    expect(() => BasicFormat.parse("No heading here")).not.toThrow();
  });
});
