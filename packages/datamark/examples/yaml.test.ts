import { describe, test, expect } from "bun:test";
import { parsed, stringified, nestedParsed } from "./yaml";

describe("yaml example", () => {
  test("parseYaml parses YAML to object", () => {
    expect(parsed.title).toBe("Hello");
    expect(parsed.tags).toEqual(["a", "b"]);
  });

  test("stringifyYaml serializes object to YAML", () => {
    expect(stringified).toContain("title: Hello");
    expect(stringified).toContain("tags:");
  });

  test("parseYaml handles nested objects", () => {
    expect(nestedParsed.meta.author).toBe("Ada");
  });
});
