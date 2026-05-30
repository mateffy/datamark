import { describe, test, expect } from "bun:test";
import {
  parse,
  stringify,
  parseBody,
  find,
  findAll,
  filter,
  sections,
  splitBy,
  between,
  after,
  before,
  codeBlocks,
  inlineText,
  textContent,
  toMarkdown,
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
  validateFrontmatter,
  ValidationError,
  datamark,
  parseTemplate,
  emitTemplate,
  headingMatcher,
  paragraphMatcher,
  codeBlockMatcher,
  optional,
  many,
  repeat,
  until,
  rest,
  splitByCombinator,
  getCombinator,
  emitMarkdown,
  todoItem,
  emitHr,
} from "./index";
import type { Position, SourceSpan } from "./position";
import type {
  Format,
  FormatConfig,
  ParseTrace,
  FormatDocs,
  TestResult,
  TemplateParseError,
} from "./template";
import { TemplateParseError as TemplateParseErrorClass } from "./template/types";

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
  test("All public exports are defined", () => {
    expect(parse).toBeDefined();
    expect(stringify).toBeDefined();
    expect(parseBody).toBeDefined();
    expect(find).toBeDefined();
    expect(findAll).toBeDefined();
    expect(filter).toBeDefined();
    expect(sections).toBeDefined();
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
    expect(validateFrontmatter).toBeDefined();
    expect(ValidationError).toBeDefined();
    expect(datamark).toBeDefined();
    expect(parseTemplate).toBeDefined();
    expect(emitTemplate).toBeDefined();
    expect(headingMatcher).toBeDefined();
    expect(paragraphMatcher).toBeDefined();
    expect(codeBlockMatcher).toBeDefined();
    expect(optional).toBeDefined();
    expect(many).toBeDefined();
    expect(repeat).toBeDefined();
    expect(until).toBeDefined();
    expect(rest).toBeDefined();
    expect(splitByCombinator).toBeDefined();
    expect(getCombinator).toBeDefined();
    expect(emitMarkdown).toBeDefined();
    expect(todoItem).toBeDefined();
    expect(emitHr).toBeDefined();
  });

  test("Full workflow: parse markdown string, manipulate AST with findAll/isHeading, stringify back", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const headings = findAll(doc.children, (n) => isHeading(n));
    expect(headings.length).toBeGreaterThan(0);
    const output = stringify(doc);
    expect(output).toContain("# Hello");
    expect(output).toContain("Test Doc");
  });

  test("Full format workflow: datamark with parse+stringify roundtrip", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(headingMatcher(1));
        return { title: (h as any).children.map((c: any) => c.value).join("") };
      },
      *stringify(doc, data) {
        yield* headingMatcher(1, data.title);
      },
    });
    const result = format.parse("# Hello\n\nBody");
    const output = format.stringify(result);
    expect(output).toContain("# Hello");
  });

  test("Use codeBlocks on real parsed document", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const blocks = codeBlocks(doc.children);
    expect(blocks.length).toBe(1);
    expect(blocks[0]!.lang).toBe("typescript");
  });

  test("Use sections on real parsed document", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const secs = sections(doc.children, { by: "heading", level: 2 });
    expect(secs.length).toBeGreaterThanOrEqual(2);
    expect(secs.some((s) => s.heading?.depth === 2)).toBe(true);
  });

  test("Validate frontmatter with mock schema via parse()", () => {
    const schema = mockSchema((data) => {
      if (data && typeof data === "object" && "id" in data && "title" in data)
        return { value: data };
      return { issues: [{ message: "Missing fields" }] };
    });
    const doc = parse(SAMPLE_MARKDOWN, { frontmatterSchema: schema as any });
    expect(doc.frontmatter).toBeDefined();
    expect(doc.frontmatter!.id).toBe("test-123");
  });

  test("Trace real document via datamark", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(headingMatcher(1));
        return { title: (h as any).children.map((c: any) => c.value).join("") };
      },
    });
    const trace = format.trace(SAMPLE_MARKDOWN);
    expect(trace.document).toBeDefined();
    expect(trace.steps.length).toBeGreaterThan(0);
    expect(trace.result).toBeDefined();
  });

  test("Generate docs for real format", () => {
    const format = datamark({
      description: "A test format",
      *parse(doc) {
        const h = yield* doc.consume(headingMatcher(1));
        return { title: (h as any).children.map((c: any) => c.value).join("") };
      },
    });
    const docs = format.docs();
    expect(docs.description).toBe("A test format");
    expect(docs.steps.length).toBeGreaterThan(0);
  });

  test("Test format examples", () => {
    const format = datamark({
      examples: ["# Hello World"],
      *parse(doc) {
        const h = yield* doc.consume(headingMatcher(1));
        return { title: (h as any).children.map((c: any) => c.value).join("") };
      },
    });
    const result = format.test();
    expect(result.passed).toBe(true);
  });

  test("Invalid frontmatter YAML: error propagates correctly", () => {
    const badMd = "---\nnot yaml: [unclosed\n---\n\n# Hello";
    expect(() => parse(badMd)).toThrow(YamlParseError);
  });

  test("Schema validation failure: error propagates correctly", () => {
    const schema = mockSchema(() => ({ issues: [{ message: "Invalid" }] }));
    const md = "---\nid: 1\n---\n\n# Hello";
    expect(() => parse(md, { frontmatterSchema: schema as any })).toThrow(
      ValidationError
    );
  });

  test("parseBody from top level returns BlockNode[]", () => {
    const nodes = parseBody("# Hello\n\nParagraph");
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    expect(nodes.some((n) => n.type === "heading")).toBe(true);
    expect(nodes.some((n) => n.type === "paragraph")).toBe(true);
  });

  test("Position types exported (Position, SourceSpan)", () => {
    const pos: Position = { line: 1, column: 1, offset: 0 };
    const span: SourceSpan = { start: pos, end: pos };
    expect(pos.line).toBe(1);
    expect(span.start).toBeDefined();
  });

  test("Template types exported (Format, FormatConfig, etc.)", () => {
    const _checkFormat: Format<any> = {} as any;
    const _checkConfig: FormatConfig<any> = {} as any;
    const _checkTrace: ParseTrace<any> = {} as any;
    const _checkDocs: FormatDocs = {} as any;
    const _checkTest: TestResult = {} as any;
    expect(true).toBe(true);
  });

  test("Error classes have correct names", () => {
    expect(new FrontmatterError("msg").name).toBe("FrontmatterError");
    expect(new YamlParseError("msg").name).toBe("YamlParseError");
    expect(new ValidationError("msg", []).name).toBe("ValidationError");
    expect(new TemplateParseErrorClass("msg").name).toBe("TemplateParseError");
  });

  test("find / findAll / filter work on AST", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const firstHeading = find(doc.children, (n) => isHeading(n, 1));
    expect(firstHeading).toBeDefined();
    expect(firstHeading!.type).toBe("heading");

    const allHeadings = findAll(doc.children, (n) => n.type === "heading");
    expect(allHeadings.length).toBeGreaterThanOrEqual(3);

    const h2s = filter(doc.children, (n) => isHeading(n, 2));
    expect(h2s.length).toBe(2);
  });

  test("splitBy / between / after / before work on AST", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const groups = splitBy(doc.children, (n) => isHeading(n, 2));
    expect(groups.length).toBeGreaterThan(0);

    const afterH1 = after(doc.children, (n) => isHeading(n, 1));
    expect(afterH1.length).toBeGreaterThan(0);

    const beforeFirstH2 = before(doc.children, (n) => isHeading(n, 2));
    expect(beforeFirstH2.some((n) => isHeading(n, 1))).toBe(true);
  });

  test("inlineText / textContent extract text", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const firstPara = doc.children.find((n) => n.type === "paragraph");
    expect(firstPara).toBeDefined();
    const text = inlineText((firstPara as any).children);
    expect(text).toContain("bold");
  });

  test("toMarkdown serializes nodes", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const md = toMarkdown(doc.children);
    expect(md).toContain("# Hello");
    expect(md).toContain("bold");
  });

  test("isCodeBlock / isTodoItem / extractTodoItems work", () => {
    const doc = parse(SAMPLE_MARKDOWN);
    const code = find(doc.children, (n) => isCodeBlock(n, "typescript"));
    expect(code).toBeDefined();
    expect(code!.type).toBe("code");

    const todoMd = "- [ ] Todo A\n- [x] Todo B";
    const todoDoc = parse(todoMd);
    expect(isTodoItem(todoDoc.children[0]!)).toBe(true);
    const todos = extractTodoItems(todoDoc.children);
    expect(todos.length).toBe(2);
    expect(todos[0]!.completed).toBe(false);
    expect(todos[1]!.completed).toBe(true);
  });
});
