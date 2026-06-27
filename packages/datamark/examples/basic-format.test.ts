import { describe, test, expect } from "bun:test";
import { BasicFormat, basicMarkdown } from "./basic-format";

describe("basic-format example", () => {
  test("parses title and body", () => {
    const result = BasicFormat.parse(basicMarkdown);
    expect(result.title).toBe("Hello");
    expect(result.body).toBe("This is the body.");
  });

  test("round-trips through stringify", () => {
    const data = BasicFormat.parse(basicMarkdown);
    const md = BasicFormat.stringify(data);
    expect(md).toContain("# Hello");
    expect(md).toContain("This is the body.");
  });

  test("parse after stringify yields same data", () => {
    const data = BasicFormat.parse(basicMarkdown);
    const md = BasicFormat.stringify(data);
    const roundTrip = BasicFormat.parse(md);
    expect(roundTrip.title).toBe(data.title);
    expect(roundTrip.body).toBe(data.body);
  });
});
