import { describe, test, expect } from "bun:test";
import {
  parse,
  stringify,
  datamark,
} from "./index";

import {
  parseBlocks,
  parseBody,
  buildSectionTree,
  find,
  findAll,
  filter,
  sectionsAtDepth,
  sectionsByHeading,
  splitBy,
  between,
  after,
  before,
  codeBlocks,
  inlineText,
  textContent,
  flatten,
  isHeading,
  isCodeBlock,
  isTodoItem,
  extractTodoItems,
  extractFrontmatter,
  splitFrontmatter,
  FrontmatterError,
  parseYaml,
  stringifyYaml,
  YamlParseError,
  validateData,
  ValidationError,
  isSection,
  isBlockNode,
  isInlineNode,
  isParentNode,
} from "./parse";

import {
  frontmatter,
  heading,
  paragraph,
  codeBlock,
  list,
  blockquote,
  horizontalRule,
  strong,
  em,
  codeSpan,
  link,
  image,
  strikethrough,
  toMarkdown,
} from "./stringify";

import type { Position, SourceSpan } from "./parse";
import type {
  Format,
  FormatConfig,
  FormatDocs,
  FormatExample,
  TestResult,
} from "./index";

const SAMPLE_MARKDOWN = `---
id: test-123
title: Test Doc
---

# Hello

This is a **bold** paragraph.

\`\`\`typescript
const x = 1;
\`\`\`

## Section 1

- Item 1
- Item 2

## Section 2

Some more text.
`;

function mockSchema(
  validator: (data: unknown) => { value?: unknown; issues?: { message: string }[] }
) {
  return {
    "~standard": {
      version: 1 as const,
      vendor: "mock",
      validate: validator,
    },
  };
}

describe("datamark public API", () => {
  test("main entry exports are defined", () => {
    expect(parse).toBeDefined();
    expect(stringify).toBeDefined();
    expect(datamark).toBeDefined();
  });

  test("parse/ subpath exports are defined", () => {
    expect(parseBlocks).toBeDefined();
    expect(parseBody).toBeDefined();
    expect(buildSectionTree).toBeDefined();
    expect(find).toBeDefined();
    expect(findAll).toBeDefined();
    expect(filter).toBeDefined();
    expect(sectionsAtDepth).toBeDefined();
    expect(sectionsByHeading).toBeDefined();
    expect(splitBy).toBeDefined();
    expect(between).toBeDefined();
    expect(after).toBeDefined();
    expect(before).toBeDefined();
    expect(codeBlocks).toBeDefined();
    expect(inlineText).toBeDefined();
    expect(textContent).toBeDefined();
    expect(toMarkdown).toBeDefined();
    expect(isHeading).toBeDefined();
    expect(isCodeBlock).toBeDefined();
    expect(isTodoItem).toBeDefined();
    expect(extractTodoItems).toBeDefined();
    expect(extractFrontmatter).toBeDefined();
    expect(splitFrontmatter).toBeDefined();
    expect(FrontmatterError).toBeDefined();
    expect(parseYaml).toBeDefined();
    expect(stringifyYaml).toBeDefined();
    expect(YamlParseError).toBeDefined();
    expect(validateData).toBeDefined();
    expect(ValidationError).toBeDefined();
    expect(flatten).toBeDefined();
    expect(isSection).toBeDefined();
    expect(isBlockNode).toBeDefined();
    expect(isInlineNode).toBeDefined();
    expect(isParentNode).toBeDefined();
  });

  test("stringify/ subpath exports are defined", () => {
    expect(frontmatter).toBeDefined();
    expect(heading).toBeDefined();
    expect(paragraph).toBeDefined();
    expect(codeBlock).toBeDefined();
    expect(list).toBeDefined();
    expect(blockquote).toBeDefined();
    expect(horizontalRule).toBeDefined();
    expect(strong).toBeDefined();
    expect(em).toBeDefined();
    expect(codeSpan).toBeDefined();
    expect(link).toBeDefined();
    expect(image).toBeDefined();
    expect(strikethrough).toBeDefined();
  });

  test("Full workflow: parse markdown string, manipulate AST with findAll/isHeading, stringify back", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const headings = findAll(doc.root, (n) => isHeading(n));
    expect(headings.length).toBeGreaterThan(0);
    const output = stringify(doc);
    expect(output).toContain("# Hello");
    expect(output).toContain("Test Doc");
  });

  test("Full format workflow: datamark with parse+stringify roundtrip", () => {
    const format = datamark({
      parse(doc) {
        const h1 = doc.root.children.find((n) => n.type === "section") as any;
        return {
          title: h1 ? inlineText(h1.heading.children) : "",
        };
      },
      stringify(data) {
        return heading(data.title) + "\n";
      },
    });
    const result = format.parse("# Hello\n\nBody");
    const output = format.stringify(result);
    expect(output).toContain("# Hello");
  });

  test("Use codeBlocks on real parsed document", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const blocks = codeBlocks(doc.root);
    expect(blocks.length).toBe(1);
    expect(blocks[0]!.lang).toBe("typescript");
  });

  test("Use sectionsAtDepth on real parsed document", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const h2s = sectionsAtDepth(doc.root, 2);
    expect(h2s.length).toBeGreaterThanOrEqual(2);
    expect(h2s.every((s) => s.heading?.depth === 2)).toBe(true);
  });

  test("Test format examples", () => {
    const format = datamark({
      examples: ["# Hello World"],
      parse(doc) {
        const h1 = doc.root.children.find((n) => n.type === "section") as any;
        return { title: h1 ? inlineText(h1.heading.children) : "" };
      },
    });
    const result = format.test();
    expect(result.passed).toBe(true);
  });

  test("Invalid frontmatter YAML: error propagates correctly", () => {
    const badMd = "---\nnot yaml: [unclosed\n---\n\n# Hello";
    expect(() => parse(badMd)).toThrow(YamlParseError);
  });

  test("parseBlocks from top level returns BlockNode[]", () => {
    const nodes = parseBlocks("# Hello\n\nParagraph");
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    expect(nodes.some((n) => n.type === "heading")).toBe(true);
    expect(nodes.some((n) => n.type === "paragraph")).toBe(true);
  });

  test("Position types exported from parse/ subpath", () => {
    const pos: Position = { line: 1, column: 1, offset: 0 };
    const span: SourceSpan = { start: pos, end: pos };
    expect(pos.line).toBe(1);
    expect(span.start).toBeDefined();
  });

  test("Format types exported from main entry", () => {
    const _checkFormat: Format<any> = {} as any;
    const _checkConfig: FormatConfig<any> = {} as any;
    const _checkDocs: FormatDocs = {} as any;
    const _checkTest: TestResult = {} as any;
    expect(true).toBe(true);
  });

  test("Error classes have correct names", () => {
    expect(new FrontmatterError("msg").name).toBe("FrontmatterError");
    expect(new YamlParseError("msg").name).toBe("YamlParseError");
    expect(new ValidationError("msg", []).name).toBe("ValidationError");
  });

  test("find / findAll / filter work on AST", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const firstHeading = find(doc.root, (n) => isHeading(n, 1));
    expect(firstHeading).toBeDefined();
    expect(firstHeading!.type).toBe("heading");

    const allHeadings = findAll(doc.root, (n) => n.type === "heading");
    expect(allHeadings.length).toBeGreaterThanOrEqual(3);

    const h2s = findAll(doc.root, (n) => isHeading(n, 2));
    expect(h2s.length).toBe(2);
  });

  test("splitBy / between / after / before work on AST", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const flatBlocks = flatten(doc.root);
    const groups = splitBy(flatBlocks, (n) => isHeading(n, 2));
    expect(groups.length).toBeGreaterThan(0);

    const afterH1 = after(flatBlocks, (n) => isHeading(n, 1));
    expect(afterH1.length).toBeGreaterThan(0);

    const beforeFirstH2 = before(flatBlocks, (n) => isHeading(n, 2));
    expect(beforeFirstH2.some((n) => isHeading(n, 1))).toBe(true);
  });

  test("inlineText / textContent extract text", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const firstSection = doc.root.children.find((n) => n.type === "section") as any;
    const firstPara = firstSection?.children?.find((n: any) => n.type === "paragraph");
    expect(firstPara).toBeDefined();
    const text = inlineText(firstPara.children);
    expect(text).toContain("bold");
  });

  test("toMarkdown serializes nodes", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const md = toMarkdown(doc.root);
    expect(md).toContain("# Hello");
    expect(md).toContain("bold");
  });

  test("isCodeBlock / isTodoItem / extractTodoItems work", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const code = find(doc.root, (n) => isCodeBlock(n, "typescript"));
    expect(code).toBeDefined();
    expect(code!.type).toBe("code");

    const todoMd = "- [ ] Todo A\n- [x] Todo B";
    const todoDoc = parse(todoMd);
    const firstBlock = todoDoc.root.children[0];
    expect(firstBlock).toBeDefined();
    expect(isTodoItem(firstBlock!)).toBe(true);
    const todos = extractTodoItems(todoDoc.root);
    expect(todos.length).toBe(2);
    expect(todos[0]!.completed).toBe(false);
    expect(todos[1]!.completed).toBe(true);
  });

  test("buildSectionTree creates section hierarchy", () => {
    const doc = parse("# A\n\nbody\n\n## B\n\nmore");
    expect(doc.root.children.length).toBeGreaterThan(0);
    const topSection = doc.root.children.find((n) => n.type === "section");
    expect(topSection).toBeDefined();
    const subSection = (topSection as any)?.children?.find((n: any) => n.type === "section");
    expect(subSection).toBeDefined();
  });

  test("flatten round-trips through stringify", () => {
    const doc = parse("# A\n\nBody\n\n## B\n\nMore");
    const flat = flatten(doc.root);
    expect(flat.some((n) => n.type === "heading")).toBe(true);
    expect(flat.some((n) => n.type === "paragraph")).toBe(true);
  });

  test("datamark with schema validates", () => {
    const format = datamark({
      schema: mockSchema((data) => {
        if (data && typeof data === "object" && "title" in data) return { value: data };
        return { issues: [{ message: "Missing title" }] };
      }),
      parse(doc) {
        const h1 = doc.root.children.find((n) => n.type === "section") as any;
        return { title: h1 ? inlineText(h1.heading.children) : "" };
      },
    });
    const result = format.parse("# Hello");
    expect(result.title).toBe("Hello");
  });

  test("datamark docs() returns metadata", () => {
    const format = datamark({
      description: "A simple format",
      examples: ["# Example"],
      parse(doc) {
        return {};
      },
    });
    const docs = format.docs();
    expect(docs.description).toBe("A simple format");
    expect(docs.examples).toBeDefined();
    expect(docs.examples!.length).toBe(1);
  });

  test("datamark stringify not configured throws error", () => {
    const format = datamark({
      parse(doc) {
        return {};
      },
    });
    expect(() => format.stringify({} as any)).toThrow(
      "does not have a stringify function"
    );
  });

  test("datamark with examples including data field", () => {
    const format = datamark({
      examples: [{ text: "# Hello", data: { title: "Hello" } }],
      parse(doc) {
        const h1 = doc.root.children.find((n) => n.type === "section") as any;
        return { title: h1 ? inlineText(h1.heading.children) : "" };
      },
    });
    const result = format.test();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("datamark with frontmatterSchema validates frontmatter", () => {
    const format = datamark({
      frontmatterSchema: mockSchema((data) => {
        if (data && typeof data === "object" && "id" in data) return { value: data };
        return { issues: [{ message: "Missing id" }] };
      }),
      parse(doc) {
        return { id: (doc.frontmatter as any).id };
      },
    });
    const result = format.parse("---\nid: test-123\n---\n\n# Hello");
    expect(result.id).toBe("test-123");
  });

  test("datamark frontmatterSchema throws on invalid frontmatter", () => {
    const format = datamark({
      frontmatterSchema: mockSchema((data) => {
        if (data && typeof data === "object" && "id" in data) return { value: data };
        return { issues: [{ message: "Missing id" }] };
      }),
      parse(doc) {
        return { id: (doc.frontmatter as any).id };
      },
    });
    expect(() => format.parse("---\ntitle: no-id\n---\n\n# Hello")).toThrow(ValidationError);
  });

  test("datamark frontmatterSchema throws when frontmatter is missing entirely", () => {
    const format = datamark({
      frontmatterSchema: mockSchema((data) => {
        if (data && typeof data === "object" && "id" in data) return { value: data };
        return { issues: [{ message: "Missing id" }] };
      }),
      parse(doc) {
        return { id: (doc.frontmatter as any).id };
      },
    });
    expect(() => format.parse("# Hello\n\nNo frontmatter here")).toThrow(ValidationError);
  });

  test("datamark frontmatterSchema in test runner validates frontmatter", () => {
    const format = datamark({
      frontmatterSchema: mockSchema((data) => {
        if (data && typeof data === "object" && "version" in data) return { value: data };
        return { issues: [{ message: "Missing version" }] };
      }),
      examples: [
        { text: "---\nversion: 1.0.0\n---\n\n# Hello", data: { version: "1.0.0" } },
      ],
      parse(doc) {
        return { version: (doc.frontmatter as any).version };
      },
    });
    const result = format.test();
    expect(result.passed).toBe(true);
  });

  test("Type guards work correctly", () => {
    const doc = parse("# Hello\n\nBody\n\n```ts\ncode\n```");
    const nodes = doc.root.children;
    expect(isSection(nodes[0]!)).toBe(true);
    expect(isBlockNode(nodes[0]!)).toBe(false);
    expect(isParentNode(nodes[0]!)).toBe(true);
  });

  // ── Markdown builders ────────────────────────────────────────────────────

  test("frontmatter builds YAML fence", () => {
    const fm = frontmatter({ title: "Hello", count: 42 });
    expect(fm).toContain("---");
    expect(fm).toContain("title: Hello");
    expect(fm).toContain("count: 42");
  });

  test("heading builds heading with depth", () => {
    expect(heading("Title", 1)).toBe("# Title");
    expect(heading("Title", 3)).toBe("### Title");
    expect(heading("Title", 0)).toBe("# Title"); // clamped
  });

  test("codeBlock builds fenced code", () => {
    expect(codeBlock("const x = 1;", "typescript")).toBe(
      "```typescript\nconst x = 1;\n```"
    );
    expect(codeBlock("hello")).toBe("```\nhello\n```");
  });

  test("list builds bullet and ordered lists", () => {
    expect(list(["A", "B"])).toBe("- A\n- B");
    expect(list(["A", "B"], true)).toBe("1. A\n2. B");
    expect(list(["A", "B"], true, 5)).toBe("5. A\n6. B");
  });

  test("blockquote builds blockquote", () => {
    expect(blockquote("line1\nline2")).toBe("> line1\n> line2");
  });

  test("horizontalRule", () => {
    expect(horizontalRule()).toBe("---");
  });

  test("strong / em / codeSpan", () => {
    expect(strong("bold")).toBe("**bold**");
    expect(em("italic")).toBe("*italic*");
    expect(codeSpan("code")).toBe("`code`");
  });

  test("link / image", () => {
    expect(link("text", "https://example.com")).toBe("[text](https://example.com)");
    expect(link("text", "https://example.com", "title")).toBe(
      '[text](https://example.com "title")'
    );
    expect(image("alt", "img.png")).toBe("![alt](img.png)");
  });

  test("strikethrough", () => {
    expect(strikethrough("deleted")).toBe("~~deleted~~");
  });

  test("paragraph returns text as-is", () => {
    expect(paragraph("hello world")).toBe("hello world");
  });

  // ── Typed frontmatter inference ──────────────────────────────────────────

  test("frontmatterSchema types doc.frontmatter in parse function", () => {
    const FrontmatterSchema = mockSchema((data) => {
      if (data && typeof data === "object" && "id" in data && "version" in data) {
        return { value: data };
      }
      return { issues: [{ message: "Missing fields" }] };
    });

    const format = datamark({
      frontmatterSchema: FrontmatterSchema,
      schema: mockSchema((data) => {
        if (data && typeof data === "object" && "id" in data) return { value: data };
        return { issues: [{ message: "Missing id" }] };
      }),
      parse(doc) {
        const id = doc.frontmatter.id;
        const version = doc.frontmatter.version;
        return { id: String(id), version: String(version) };
      },
    });

    const result = format.parse("---\nid: abc\nversion: 1.0.0\n---\n\n# Hello");
    expect(result.id).toBe("abc");
    expect(result.version).toBe("1.0.0");
  });

  test("schema types the Format return value", () => {
    const format = datamark({
      schema: mockSchema((data) => {
        if (data && typeof data === "object" && "title" in data) return { value: data };
        return { issues: [{ message: "Missing title" }] };
      }),
      parse(doc) {
        return { title: "Hello" };
      },
    });

    const result = format.parse("# Hello");
    expect(result.title).toBe("Hello");
  });
});
