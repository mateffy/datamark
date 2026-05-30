import { describe, test, expect } from "bun:test";
import {
  parseYaml,
  stringifyYaml,
  YamlParseError,
} from "./yaml";

describe("parseYaml", () => {
  test('empty string and "---" both return empty object', () => {
    expect(parseYaml("")).toEqual({});
    expect(parseYaml("---")).toEqual({});
  });

  test("parses simple string", () => {
    expect(parseYaml("hello")).toBe("hello");
  });

  test("parses number types (int, float, scientific)", () => {
    expect(parseYaml("42")).toBe(42);
    expect(parseYaml("3.14")).toBe(3.14);
    expect(parseYaml("1e10")).toBe(10000000000);
  });

  test("parses boolean and null", () => {
    expect(parseYaml("true")).toBe(true);
    expect(parseYaml("false")).toBe(false);
    expect(parseYaml("null")).toBeNull();
  });

  test("parses object", () => {
    expect(parseYaml("foo: bar")).toEqual({ foo: "bar" });
  });

  test("parses nested object", () => {
    expect(parseYaml("foo:\n  bar: 1")).toEqual({ foo: { bar: 1 } });
  });

  test("parses array and array of objects", () => {
    expect(parseYaml("- 1\n- 2")).toEqual([1, 2]);
    expect(parseYaml("- foo: 1")).toEqual([{ foo: 1 }]);
  });

  test("parses literal block scalar", () => {
    expect(parseYaml("|\n  line 1\n  line 2")).toBe("line 1\nline 2\n");
  });

  test("parses folded block scalar", () => {
    expect(parseYaml(">\n  line 1\n  line 2")).toBe("line 1 line 2\n");
  });

  test("parses comments and quoted number-like string", () => {
    expect(parseYaml("foo: bar # comment")).toEqual({ foo: "bar" });
    expect(parseYaml('"42"')).toBe("42");
  });

  test("throws YamlParseError on invalid YAML", () => {
    expect(() => parseYaml("foo: [}")).toThrow(YamlParseError);
  });

  test("YamlParseError has correct name, message and cause", () => {
    try {
      parseYaml("foo: [}");
      expect.unreachable("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(YamlParseError);
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe("YamlParseError");
      expect(err.message).toContain("Failed to parse YAML");
      expect(err.cause).toBeDefined();
    }
  });
});

describe("stringifyYaml", () => {
  test("stringifies null", () => {
    expect(stringifyYaml(null)).toBe("null");
  });

  test("stringifies undefined as null", () => {
    expect(stringifyYaml(undefined)).toBe("null");
  });

  test("stringifies booleans", () => {
    expect(stringifyYaml(true)).toBe("true");
    expect(stringifyYaml(false)).toBe("false");
  });

  test("stringifies number", () => {
    expect(stringifyYaml(42)).toBe("42");
  });

  test("stringifies plain string", () => {
    expect(stringifyYaml("hello")).toBe("hello");
  });

  test("stringifies string needing quotes", () => {
    expect(stringifyYaml("hello: world")).toBe('"hello: world"');
  });

  test("stringifies multiline as literal block", () => {
    expect(stringifyYaml("line1\nline2")).toBe("|-\nline1\nline2");
  });

  test("stringifies arrays", () => {
    expect(stringifyYaml([])).toBe("[]");
    expect(stringifyYaml([1, 2])).toBe("- 1\n- 2");
  });

  test("stringifies objects", () => {
    expect(stringifyYaml({})).toBe("{}");
    expect(stringifyYaml({ a: 1 })).toBe("a: 1");
    expect(stringifyYaml({ a: { b: 1 } })).toBe("a:\n  b: 1");
    expect(stringifyYaml({ a: { b: { c: 1 } } })).toBe("a:\n  b:\n    c: 1");
  });

  test("converts undefined in object to null", () => {
    expect(stringifyYaml({ a: undefined })).toBe("a: null");
  });

  test("handles special characters", () => {
    expect(stringifyYaml("hello\\world")).toBe("hello\\world");
    expect(stringifyYaml("hello\tworld")).toBe("hello\tworld");
    expect(stringifyYaml("hello\rworld")).toBe('"hello\\rworld"');
  });

  test("throws on symbol", () => {
    expect(() => stringifyYaml(Symbol())).toThrow();
  });
});

describe("roundtrip", () => {
  test("simple object", () => {
    const value = { foo: "bar", num: 42 };
    expect(parseYaml(stringifyYaml(value))).toEqual(value);
  });

  test("array", () => {
    const value = [1, 2, 3];
    expect(parseYaml(stringifyYaml(value))).toEqual(value);
  });

  test("nested object", () => {
    const value = { a: { b: [1, 2] } };
    expect(parseYaml(stringifyYaml(value))).toEqual(value);
  });

  test("literal block content", () => {
    const value = { text: "line1\nline2" };
    expect(parseYaml(stringifyYaml(value))).toEqual(value);
  });

  test("empty nested object", () => {
    const value = { a: {} };
    expect(parseYaml(stringifyYaml(value))).toEqual(value);
  });

  test("nested arrays", () => {
    const value = [[1, 2], [3, 4]];
    expect(parseYaml(stringifyYaml(value))).toEqual(value);
  });
});
