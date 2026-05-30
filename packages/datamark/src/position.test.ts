import { describe, test, expect } from "bun:test";
import { buildNewlineIndex, offsetToPosition, computeSpan } from "./position";

describe("buildNewlineIndex", () => {
  test("empty string returns [0]", () => {
    expect(buildNewlineIndex("")).toEqual([0]);
  });

  test("single line without newline returns [0]", () => {
    expect(buildNewlineIndex("hello")).toEqual([0]);
  });

  test("multiple lines returns start offsets", () => {
    expect(buildNewlineIndex("a\nb\nc")).toEqual([0, 2, 4]);
  });

  test("windows-style \\r\\n only counts \\n", () => {
    expect(buildNewlineIndex("a\r\nb")).toEqual([0, 3]);
  });
});

describe("offsetToPosition", () => {
  const idx = buildNewlineIndex("hello\nworld\nfoo");

  test("offset 0 is line 1 column 1", () => {
    expect(offsetToPosition(0, idx)).toEqual({ line: 1, column: 1, offset: 0 });
  });

  test("line start offset", () => {
    expect(offsetToPosition(6, idx)).toEqual({ line: 2, column: 1, offset: 6 });
  });

  test("line end offset", () => {
    expect(offsetToPosition(10, idx)).toEqual({ line: 2, column: 5, offset: 10 });
  });

  test("middle of line", () => {
    expect(offsetToPosition(8, idx)).toEqual({ line: 2, column: 3, offset: 8 });
  });

  test("binary search on many lines", () => {
    const text = Array.from({ length: 100 }, (_, i) => `line${i}`).join("\n");
    const manyIdx = buildNewlineIndex(text);
    expect(offsetToPosition(manyIdx[50]!, manyIdx)).toEqual({
      line: 51,
      column: 1,
      offset: manyIdx[50]!,
    });
  });

  test("offset beyond text length still works", () => {
    expect(offsetToPosition(999, idx)).toEqual({
      line: idx.length,
      column: 999 - (idx[idx.length - 1] ?? 0) + 1,
      offset: 999,
    });
  });
});

describe("computeSpan", () => {
  const parent = "hello\nworld\nfoo";
  const idx = buildNewlineIndex(parent);

  test("finds raw and returns correct span", () => {
    const span = computeSpan("world", 0, parent, idx);
    expect(span).toEqual({
      start: { line: 2, column: 1, offset: 6 },
      end: { line: 2, column: 6, offset: 11 },
    });
  });

  test("with baseOffset finds correct occurrence", () => {
    const span = computeSpan("foo", 6, parent, idx);
    expect(span).toEqual({
      start: { line: 3, column: 1, offset: 12 },
      end: { line: 3, column: 4, offset: 15 },
    });
  });

  test("duplicate raw strings finds first after baseOffset", () => {
    const dup = "aaa\nbbb\nbbb";
    const dupIdx = buildNewlineIndex(dup);
    const span = computeSpan("bbb", 4, dup, dupIdx);
    expect(span!.start.offset).toBe(4);
    expect(span!.end.offset).toBe(7);
  });

  test("raw not found returns undefined", () => {
    expect(computeSpan("nope", 0, parent, idx)).toBeUndefined();
  });
});
