import { describe, test, expect } from "bun:test";
import {
  fm, h1, h2, p, cb, bulletList, orderedList, quote, hr,
  bold, italic, code, a, img, del,
} from "./builders";

describe("builders example", () => {
  test("frontmatter contains YAML", () => {
    expect(fm).toContain("---");
    expect(fm).toContain("title: Hello");
  });

  test("heading includes depth", () => {
    expect(h1).toBe("# Title");
    expect(h2).toBe("## Subtitle");
  });

  test("paragraph returns text", () => {
    expect(p).toBe("A paragraph of text.");
  });

  test("codeBlock includes language", () => {
    expect(cb).toContain("```typescript");
    expect(cb).toContain("const x = 1;");
  });

  test("list builds bullet and ordered", () => {
    expect(bulletList).toBe("- First\n- Second");
    expect(orderedList).toBe("1. A\n2. B");
  });

  test("blockquote prefixes lines", () => {
    expect(quote).toBe("> A wise quote.");
  });

  test("horizontalRule", () => {
    expect(hr).toBe("---");
  });

  test("inline formatting", () => {
    expect(bold).toBe("**bold**");
    expect(italic).toBe("*italic*");
    expect(code).toBe("`code`");
    expect(a).toBe("[text](https://example.com)");
    expect(img).toBe("![alt](img.png)");
    expect(del).toBe("~~deleted~~");
  });
});
