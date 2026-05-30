import { describe, test, expect } from "bun:test";
import type { BlockNode } from "../tree";
import { TemplateParseError } from "./types";
import {
  parse,
  heading,
  paragraph,
  codeBlock,
  optional,
  many,
  repeat,
  until,
  splitBy,
  rest,
  getCombinator,
} from "./parse";

describe("Basic parse", () => {
  test("parse frontmatter + heading + paragraph", () => {
    const parser = parse(function* (doc) {
      const fm = yield* doc.consumeFrontmatter();
      const h1 = yield* doc.consume(heading(1));
      const para = yield* doc.consume(paragraph());
      return { fm, h1, para };
    });
    const result = parser("---\nid: 1\n---\n\n# Title\n\ntext");
    expect(result.fm).toEqual({ id: 1 });
    expect(result.h1.type).toBe("heading");
    expect(result.para.type).toBe("paragraph");
  });

  test("generator return value", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(heading(1));
      return "done";
    });
    expect(parser("# Hello")).toBe("done");
  });

  test("consumeFrontmatter returns frontmatter", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consumeFrontmatter();
    });
    const result = parser("---\nid: 1\n---\n\n# Hello");
    expect(result).toEqual({ id: 1 });
  });

  test("consumeFrontmatter idempotent (call twice → same)", () => {
    const parser = parse(function* (doc) {
      const fm1 = yield* doc.consumeFrontmatter();
      const fm2 = yield* doc.consumeFrontmatter();
      return { fm1, fm2 };
    });
    const result = parser("---\nid: 1\n---\n\n# Hello");
    expect(result.fm1).toBe(result.fm2);
    expect(result.fm1).toEqual({ id: 1 });
  });

  test("consumeFrontmatter no frontmatter → null", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consumeFrontmatter();
    });
    expect(parser("# Hello")).toBeNull();
  });
});

describe("Matchers", () => {
  test("heading(1): matches H1", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(heading(1));
    });
    const result = parser("# Hello");
    expect(result.type).toBe("heading");
    expect(result.depth).toBe(1);
  });

  test("heading(2) predicate works", () => {
    const h2 = heading(2);
    const match: BlockNode = {
      type: "heading",
      depth: 2,
      children: [{ type: "text", value: "Hi", raw: "Hi" }],
      raw: "## Hi",
    };
    const noMatch: BlockNode = {
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: "Hi", raw: "Hi" }],
      raw: "# Hi",
    };
    expect(h2(match)).toBe(true);
    expect(h2(noMatch)).toBe(false);
  });

  test("heading no match → throws TemplateParseError", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(heading(1));
      return null;
    });
    expect(() => parser("text")).toThrow(TemplateParseError);
  });

  test("paragraph(): matches", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(paragraph());
    });
    const result = parser("text");
    expect(result.type).toBe("paragraph");
  });

  test("paragraph no match → throws", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(paragraph());
      return null;
    });
    expect(() => parser("# Hello")).toThrow(TemplateParseError);
  });

  test("codeBlock(): matches any", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(codeBlock());
    });
    const result = parser("```ts\ncode\n```");
    expect(result.type).toBe("code");
  });

  test('codeBlock({ lang: "ts" }) matches specific', () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(codeBlock({ lang: "ts" }));
    });
    const result = parser("```ts\ncode\n```");
    expect(result.lang).toBe("ts");
  });

  test("codeBlock wrong lang → throws", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(codeBlock({ lang: "ts" }));
      return null;
    });
    expect(() => parser("```js\ncode\n```")).toThrow(TemplateParseError);
  });

  test("codeBlock no code → throws", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(codeBlock());
      return null;
    });
    expect(() => parser("# Hello")).toThrow(TemplateParseError);
  });
});

describe("Modifiers", () => {
  test("optional: matches → value", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(optional(heading(1)));
    });
    const result = parser("# Hello");
    expect(result).toBeTruthy();
    expect(result!.type).toBe("heading");
  });

  test("optional: no match → undefined (doesn't throw)", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(optional(heading(1)));
    });
    expect(parser("text")).toBeUndefined();
  });

  test("many: matches multiple", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(many(heading(1)));
    });
    const result = parser("# A\n\n# B\n\n# C");
    expect(result).toHaveLength(3);
  });

  test("many: matches once", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(many(heading(1)));
    });
    const result = parser("# A\ntext");
    expect(result).toHaveLength(1);
  });

  test("many: no match → []", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(many(heading(1)));
    });
    expect(parser("text")).toEqual([]);
  });

  test("repeat(2, heading(1)): matches twice", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(repeat(2, heading(1)));
    });
    const result = parser("# A\n\n# B\ntext");
    expect(result).toHaveLength(2);
  });

  test("repeat(2, heading(1)): only 1 available → throws", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(repeat(2, heading(1)));
      return null;
    });
    expect(() => parser("# A\ntext")).toThrow(TemplateParseError);
  });

  test("repeat(0, ...) → []", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(repeat(0, heading(1)));
    });
    expect(parser("# A")).toEqual([]);
  });

  test("until(heading(2)): consumes until match", () => {
    const parser = parse(function* (doc) {
      const before = yield* doc.consume(until(heading(2)));
      const h2 = yield* doc.consume(heading(2));
      return { before, h2 };
    });
    const result = parser("para1\n\npara2\n\n## H2\n\ntext");
    expect(result.before).toHaveLength(4);
    expect(result.h2.depth).toBe(2);
  });

  test("until(heading(2)): never matches → all", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(until(heading(2)));
    });
    const result = parser("para1\n\npara2");
    expect(result).toHaveLength(3);
  });

  test("until(heading(2)): matches first → []", () => {
    const parser = parse(function* (doc) {
      const before = yield* doc.consume(until(heading(2)));
      const h2 = yield* doc.consume(heading(2));
      return { before, h2 };
    });
    const result = parser("## H2\n\ntext");
    expect(result.before).toEqual([]);
    expect(result.h2.depth).toBe(2);
  });

  test("splitBy(heading(2)): splits correctly", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(splitBy(heading(2)));
    });
    const result = parser("intro\n\n## S1\n\na\n\n## S2\n\nb");
    expect(result).toHaveLength(3);
    expect(result[0]).toHaveLength(2);
    expect(result[1]).toHaveLength(3);
    expect(result[2]).toHaveLength(2);
  });

  test("splitBy(heading(2)): no separators → single group", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(splitBy(heading(2)));
    });
    const result = parser("a\n\nb");
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(3);
  });

  test("splitBy(heading(2)): leading separator → no empty first group", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(splitBy(heading(2)));
    });
    const result = parser("## A\n\ntext");
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
  });

  test("splitBy(heading(2)): trailing separator", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(splitBy(heading(2)));
    });
    const result = parser("text\n\n## A");
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
  });

  test("rest(): consumes all", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(heading(1));
      return yield* doc.consume(rest());
    });
    const result = parser("# H1\n\ntext\n\n```ts\ncode\n```");
    expect(result).toHaveLength(4);
  });

  test("rest(): with no nodes → []", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(heading(1));
      return yield* doc.consume(rest());
    });
    expect(parser("# Hello")).toEqual([]);
  });
});

describe("getCombinator", () => {
  test("from NodeMatcher", () => {
    const matcher = heading(1);
    const comb = getCombinator(matcher);
    expect(typeof comb).toBe("function");
  });

  test("from plain function", () => {
    const c = (nodes: BlockNode[]) => ({ value: "x", remaining: nodes });
    expect(getCombinator(c)).toBe(c);
  });

  test("from non-function → null", () => {
    expect(getCombinator(null as any)).toBeNull();
    expect(getCombinator("x" as any)).toBeNull();
  });
});

describe("Error paths", () => {
  test("Unknown yieldable in generator → TemplateParseError", () => {
    const { createEmitYieldable } = require("./yieldable");
    const parser = parse(function* (doc) {
      yield* createEmitYieldable("bad", () => {}) as any;
      return null;
    });
    expect(() => parser("# Hello")).toThrow(TemplateParseError);
  });

  test("Parse error includes position estimate", () => {
    const parser = parse(function* (doc) {
      yield* doc.consume(heading(1));
      yield* doc.consume(heading(1));
      return null;
    });
    expect(() => parser("# Hello\n\ntext")).toThrow("at position");
  });
});

describe("Interactions", () => {
  test("many(heading(1)) multiple H1s", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(many(heading(1)));
    });
    const result = parser("# A\n\n# B\n\n# C\ntext");
    expect(result).toHaveLength(3);
  });

  test("optional(many(heading(2)))", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(optional(many(heading(2))));
    });
    expect(parser("## A\n\n## B\ntext")).toHaveLength(2);
    expect(parser("text")).toEqual([]);
  });

  test("splitBy(heading(2)) then many(codeBlock())", () => {
    const parser = parse(function* (doc) {
      const groups = yield* doc.consume(splitBy(heading(2)));
      const remainingCodes = yield* doc.consume(many(codeBlock()));
      return { groups, remainingCodes };
    });
    const result = parser(
      "## S1\n\n```ts\na\n```\n\n## S2\n\n```ts\nb\n```"
    );
    expect(result.groups).toHaveLength(2);
    expect(result.remainingCodes).toEqual([]);
  });

  test("many(repeat(2, heading(1)))", () => {
    const parser = parse(function* (doc) {
      return yield* doc.consume(many(repeat(2, heading(1))));
    });
    const result = parser("# A\n\n# B\n\n# C\n\n# D\ntext");
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(2);
    expect(result[1]).toHaveLength(2);
  });

  test("until(heading(2)) then heading(2)", () => {
    const parser = parse(function* (doc) {
      const before = yield* doc.consume(until(heading(2)));
      const h2 = yield* doc.consume(heading(2));
      return { before, h2 };
    });
    const result = parser("para\n\n## H2\n\ntext");
    expect(result.before).toHaveLength(2);
    expect(result.h2.depth).toBe(2);
  });

  test("optional(heading(1)) then rest()", () => {
    const parser = parse(function* (doc) {
      const h1 = yield* doc.consume(optional(heading(1)));
      const restNodes = yield* doc.consume(rest());
      return { h1, restNodes };
    });
    const withH1 = parser("# Title\n\ntext");
    expect(withH1.h1).toBeTruthy();
    expect(withH1.restNodes).toHaveLength(2);
    const without = parser("text");
    expect(without.h1).toBeUndefined();
    expect(without.restNodes).toHaveLength(1);
  });

  test("splitBy(hr()) with multiple hrs", () => {
    const isHr = (n: BlockNode) => n.type === "hr";
    const parser = parse(function* (doc) {
      return yield* doc.consume(splitBy(isHr));
    });
    const result = parser("a\n\n---\n\nb\n\n---\n\nc");
    expect(result).toHaveLength(3);
    expect(result[0]).toHaveLength(2);
    expect(result[1]).toHaveLength(3);
    expect(result[2]).toHaveLength(2);
  });

  test("Chained consume calls advance cursor", () => {
    const parser = parse(function* (doc) {
      const h1 = yield* doc.consume(heading(1));
      const para = yield* doc.consume(paragraph());
      const code = yield* doc.consume(codeBlock());
      return { h1, para, code };
    });
    const result = parser(
      "# Title\n\ntext\n\n```ts\nconst x = 1;\n```"
    );
    expect(result.h1.type).toBe("heading");
    expect(result.para.type).toBe("paragraph");
    expect(result.code.type).toBe("code");
  });
});
