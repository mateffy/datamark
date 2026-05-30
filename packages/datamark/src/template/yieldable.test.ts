import { describe, test, expect } from "bun:test";
import { YieldableSymbol, isYieldable } from "./types";
import {
  createYieldable,
  createEmitYieldable,
  getYieldableRun,
  getYieldableEmit,
  getCombinatorName,
  getYieldableMeta,
} from "./yieldable";

describe("createYieldable", () => {
  test("has YieldableSymbol", () => {
    const y = createYieldable("test", "Test", () => null);
    expect((y as any)[YieldableSymbol]).toBe(true);
  });

  test("correct _tag", () => {
    const y = createYieldable("myTag", "MyTag", () => null);
    expect((y as any)._tag).toBe("myTag");
  });

  test("iterable protocol works with yield*", () => {
    const y = createYieldable<string>("test", "Test", () => ({
      value: "result",
      remaining: [],
    }));
    function* gen() {
      const result = yield* y;
      return result;
    }
    const g = gen();
    const step1 = g.next();
    expect(step1.value).toBe(y);
    const step2 = g.next("injected");
    expect(step2.done).toBe(true);
    expect(step2.value).toBe("injected");
  });

  test("stores combinator name", () => {
    const y = createYieldable("test", "myCombinator", () => null);
    expect(getCombinatorName(y)).toBe("myCombinator");
  });
});

describe("Fluent metadata", () => {
  test(".description() attaches meta", () => {
    const y = createYieldable("test", "Test", () => null).description(
      "A description"
    );
    expect(getYieldableMeta(y)?.description).toBe("A description");
  });

  test(".examples() attaches meta", () => {
    const y = createYieldable("test", "Test", () => null).examples([
      "ex1",
      "ex2",
    ]);
    expect(getYieldableMeta(y)?.examples).toEqual(["ex1", "ex2"]);
  });

  test("chaining .description().examples()", () => {
    const y = createYieldable("test", "Test", () => null)
      .description("Desc")
      .examples(["a"]);
    const meta = getYieldableMeta(y);
    expect(meta?.description).toBe("Desc");
    expect(meta?.examples).toEqual(["a"]);
  });
});

describe("getYieldableRun", () => {
  test("returns correct function", () => {
    const run = () => ({ value: "x", remaining: [] as any[] });
    const y = createYieldable("test", "Test", run as any);
    expect(getYieldableRun(y)).toBe(run);
  });

  test("on non-yieldable → undefined", () => {
    expect(getYieldableRun({} as any)).toBeUndefined();
  });

  test("on emit yieldable → undefined", () => {
    const y = createEmitYieldable("test", () => {});
    expect(getYieldableRun(y)).toBeUndefined();
  });
});

describe("getYieldableEmit", () => {
  test("returns correct function", () => {
    const emitFn = () => {};
    const y = createEmitYieldable("test", emitFn);
    expect(getYieldableEmit(y)).toBe(emitFn);
  });

  test("on parse yieldable → undefined", () => {
    const y = createYieldable("test", "Test", () => null);
    expect(getYieldableEmit(y)).toBeUndefined();
  });
});

describe("getCombinatorName", () => {
  test("returns correct name", () => {
    const y = createYieldable("test", "customName", () => null);
    expect(getCombinatorName(y)).toBe("customName");
  });

  test("on non-yieldable → undefined", () => {
    expect(getCombinatorName({} as any)).toBeUndefined();
  });
});

describe("getYieldableMeta", () => {
  test("returns metadata object", () => {
    const y = createYieldable("test", "Test", () => null)
      .description("d")
      .examples(["e"]);
    const meta = getYieldableMeta(y);
    expect(meta).toBeDefined();
    expect(meta?.description).toBe("d");
    expect(meta?.examples).toEqual(["e"]);
  });

  test("on non-yieldable → undefined", () => {
    expect(getYieldableMeta({} as any)).toBeUndefined();
  });
});

describe("createEmitYieldable", () => {
  test("has symbol", () => {
    const y = createEmitYieldable("test", () => {});
    expect((y as any)[YieldableSymbol]).toBe(true);
  });

  test("correct _tag", () => {
    const y = createEmitYieldable("emitTag", () => {});
    expect((y as any)._tag).toBe("emitTag");
  });

  test("stores emit function", () => {
    const fn = () => {};
    const y = createEmitYieldable("test", fn);
    expect(getYieldableEmit(y)).toBe(fn);
  });

  test("iterable protocol", () => {
    const y = createEmitYieldable("test", () => {});
    function* gen() {
      const result = yield* y;
      return result;
    }
    const g = gen();
    const step1 = g.next();
    expect(step1.value).toBe(y);
    const step2 = g.next("injected");
    expect(step2.done).toBe(true);
    expect(step2.value).toBe("injected");
  });
});

describe("isYieldable", () => {
  test("true for parse and emit yieldables", () => {
    expect(isYieldable(createYieldable("x", "X", () => null))).toBe(true);
    expect(isYieldable(createEmitYieldable("x", () => {}))).toBe(true);
  });

  test("false for plain object, primitive, null, and object with wrong symbol value", () => {
    expect(isYieldable({})).toBe(false);
    expect(isYieldable(42)).toBe(false);
    expect(isYieldable("hello")).toBe(false);
    expect(isYieldable(null)).toBe(false);
    expect(isYieldable(undefined)).toBe(false);
    expect(isYieldable({ [YieldableSymbol]: false })).toBe(false);
  });
});
