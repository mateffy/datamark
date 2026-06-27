import { describe, test, expect } from "bun:test";
import { NoteFormat } from "./format-stringify";

describe("format-stringify example", () => {
  test("round-trips through parse and stringify", () => {
    const data = NoteFormat.parse("# Hello\n\nWorld");
    expect(data.title).toBe("Hello");
    expect(data.body).toBe("World");

    const md = NoteFormat.stringify(data);
    expect(md).toContain("# Hello");
    expect(md).toContain("World");
  });
});
