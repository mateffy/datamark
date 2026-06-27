import { describe, test, expect } from "bun:test";
import { parseBlocks, parseBody } from "./tree";

describe("parseBlocks", () => {
  test("empty string returns empty array", () => {
    expect(parseBlocks("")).toEqual([]);
  });

  for (let d = 1; d <= 6; d++) {
    test(`single heading depth ${d}`, () => {
      const nodes = parseBlocks(`${"#".repeat(d)} Title`);
      expect(nodes).toHaveLength(1);
      expect(nodes[0]!.type).toBe("heading");
      expect((nodes[0] as any).depth).toBe(d);
    });
  }

  test("paragraph with strong", () => {
    const nodes = parseBlocks("**bold**");
    expect(nodes[0]!.type).toBe("paragraph");
    expect((nodes[0] as any).children[0].type).toBe("strong");
  });

  test("paragraph with em", () => {
    const nodes = parseBlocks("*italic*");
    expect(nodes[0]!.type).toBe("paragraph");
    expect((nodes[0] as any).children[0].type).toBe("em");
  });

  test("paragraph with codespan", () => {
    const nodes = parseBlocks("`code`");
    expect(nodes[0]!.type).toBe("paragraph");
    expect((nodes[0] as any).children[0].type).toBe("codespan");
  });

  test("paragraph with link", () => {
    const nodes = parseBlocks("[text](http://a.com)");
    expect(nodes[0]!.type).toBe("paragraph");
    expect((nodes[0] as any).children[0].type).toBe("link");
  });

  test("paragraph with image", () => {
    const nodes = parseBlocks("![alt](img.png)");
    expect(nodes[0]!.type).toBe("paragraph");
    expect((nodes[0] as any).children[0].type).toBe("image");
  });

  test("paragraph with del", () => {
    const nodes = parseBlocks("~~del~~");
    expect(nodes[0]!.type).toBe("paragraph");
    expect((nodes[0] as any).children[0].type).toBe("del");
  });

  test("paragraph with br", () => {
    const nodes = parseBlocks("a  \nb");
    expect(nodes[0]!.type).toBe("paragraph");
    const children = (nodes[0] as any).children;
    expect(children.some((c: any) => c.type === "br")).toBe(true);
  });

  test("paragraph with html", () => {
    const nodes = parseBlocks("a <br> b");
    expect(nodes[0]!.type).toBe("paragraph");
    expect((nodes[0] as any).children.some((c: any) => c.type === "html")).toBe(true);
  });

  test("paragraph with escape", () => {
    const nodes = parseBlocks("\\*");
    expect(nodes[0]!.type).toBe("paragraph");
    expect((nodes[0] as any).children[0].type).toBe("escape");
  });

  test("code block with lang and meta", () => {
    const nodes = parseBlocks("```ts foo\ncode\n```");
    expect(nodes[0]!.type).toBe("code");
    expect((nodes[0] as any).lang).toBe("ts");
    expect((nodes[0] as any).meta).toBe("foo");
  });

  test("blockquote with nested heading", () => {
    const nodes = parseBlocks("> # H");
    expect(nodes[0]!.type).toBe("blockquote");
    expect((nodes[0] as any).children[0].type).toBe("heading");
  });

  test("unordered list", () => {
    const nodes = parseBlocks("- a\n- b");
    expect(nodes[0]!.type).toBe("list");
    expect((nodes[0] as any).ordered).toBe(false);
    expect((nodes[0] as any).children).toHaveLength(2);
  });

  test("ordered list with start number", () => {
    const nodes = parseBlocks("2. a\n3. b");
    expect(nodes[0]!.type).toBe("list");
    expect((nodes[0] as any).ordered).toBe(true);
    expect((nodes[0] as any).start).toBe(2);
  });

  test("nested list", () => {
    const nodes = parseBlocks("- a\n  - b");
    expect(nodes[0]!.type).toBe("list");
    const outerItem = (nodes[0] as any).children[0];
    expect(outerItem.children.some((n: any) => n.type === "list")).toBe(true);
  });

  test("list item with block content", () => {
    const nodes = parseBlocks("- # H\n  ```\n  code\n  ```");
    expect(nodes[0]!.type).toBe("list");
    const item = (nodes[0] as any).children[0];
    expect(item.children.some((n: any) => n.type === "heading")).toBe(true);
    expect(item.children.some((n: any) => n.type === "code")).toBe(true);
  });

  test("table with header rows and align", () => {
    const nodes = parseBlocks("| a | b |\n|---|---|\n| c | d |");
    expect(nodes[0]!.type).toBe("table");
    expect((nodes[0] as any).children).toHaveLength(2); // header + 1 body row
    expect((nodes[0] as any).align).toEqual([null, null]);
  });

  test("html block", () => {
    const nodes = parseBlocks("<div>x</div>");
    expect(nodes[0]!.type).toBe("html");
  });

  test("hr", () => {
    const nodes = parseBlocks("---");
    expect(nodes[0]!.type).toBe("hr");
  });

  test("space", () => {
    const nodes = parseBlocks("\n\n");
    expect(nodes[0]!.type).toBe("space");
  });

  test("position tracking when parentText provided", () => {
    const nodes = parseBlocks("hello", "hello", 0);
    expect(nodes[0]!.position).toBeDefined();
    expect(nodes[0]!.position!.start.line).toBe(1);
  });

  test("position tracking baseOffset shifts positions", () => {
    const nodes = parseBlocks("hello", "xxx\nhello", 4);
    expect(nodes[0]!.position!.start.line).toBe(2);
    expect(nodes[0]!.position!.start.column).toBe(1);
    expect(nodes[0]!.position!.start.offset).toBe(4);
  });

  test("duplicate raw strings advance finds correct occurrence", () => {
    const nodes = parseBlocks("para\n\npara", "para\n\npara", 0);
    expect(nodes).toHaveLength(3);
    const paras = nodes.filter((n) => n.type === "paragraph");
    expect(paras[0]!.position!.start.offset).toBe(0);
    expect(paras[1]!.position!.start.offset).toBeGreaterThan(paras[0]!.position!.start.offset);
  });

  test("edge: empty code block", () => {
    const nodes = parseBlocks("```\n```");
    expect(nodes[0]!.type).toBe("code");
    expect((nodes[0] as any).value).toBe("");
  });

  test("edge: paragraph with only whitespace", () => {
    const nodes = parseBlocks("   ");
    expect(nodes[0]!.type).toBe("space");
  });

  test("edge: inline link with title", () => {
    const nodes = parseBlocks('[text](http://a.com "title")');
    expect(nodes[0]!.type).toBe("paragraph");
    const link = (nodes[0] as any).children[0];
    expect(link.type).toBe("link");
    expect(link.title).toBe("title");
  });

  test("parseBody is alias for parseBlocks", () => {
    expect(parseBody("# A")).toEqual(parseBlocks("# A"));
  });
});
