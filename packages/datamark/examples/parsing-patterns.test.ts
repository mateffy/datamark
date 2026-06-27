import { describe, test, expect } from "bun:test";
import {
  doc,
  topSections,
  firstH1,
  h2Sections,
  paramSections,
  subSections,
  jsonBlocks,
  allCode,
  lists,
  tables,
  tableHeaders,
  introText,
  allText,
  todos,
  titleLine,
  groups,
  afterAuth,
  beforeParams,
  ApiFormat,
} from "./parsing-patterns";

describe("parsing-patterns", () => {
  test("doc is parsed correctly", () => {
    expect(doc.frontmatter).toEqual({ title: "API Reference" });
    expect(doc.root.type).toBe("section");
  });

  test("topSections finds all h2 subsections", () => {
    expect(topSections.length).toBeGreaterThanOrEqual(4);
  });

  test("firstH1 finds the title heading", () => {
    expect(firstH1).toBeDefined();
    expect((firstH1 as any).depth).toBe(1);
  });

  test("h2Sections finds sections at depth 2", () => {
    expect(h2Sections.length).toBeGreaterThanOrEqual(3);
  });

  test("paramSections finds Parameters section", () => {
    expect(paramSections.length).toBe(1);
  });

  test("subSections finds nested sections", () => {
    expect(subSections.length).toBeGreaterThanOrEqual(4);
  });

  test("jsonBlocks finds JSON code blocks", () => {
    expect(jsonBlocks.length).toBe(1);
    expect((jsonBlocks[0] as any).lang).toBe("json");
  });

  test("allCode finds all code blocks", () => {
    expect(allCode.length).toBe(1);
  });

  test("lists finds list nodes", () => {
    expect(lists.length).toBe(1);
  });

  test("tables finds table nodes", () => {
    expect(tables.length).toBe(1);
  });

  test("tableHeaders extracts header text", () => {
    expect(tableHeaders).toContain("Name");
    expect(tableHeaders).toContain("Type");
  });

  test("introText extracts inline text", () => {
    expect(introText).toContain("Introduction paragraph");
  });

  test("allText extracts all text recursively", () => {
    expect(allText).toContain("API Reference");
    expect(allText).toContain("Write tests");
  });

  test("todos extracts checkbox items", () => {
    expect(todos.length).toBe(2);
    expect(todos[0].text).toBe("Write tests");
    expect(todos[0].completed).toBe(false);
    expect(todos[1].text).toBe("Update docs");
    expect(todos[1].completed).toBe(true);
  });

  test("titleLine has position info", () => {
    expect(typeof titleLine).toBe("number");
    expect(titleLine).toBeGreaterThan(0);
  });

  test("splitBy groups blocks by h2", () => {
    expect(groups.length).toBeGreaterThanOrEqual(1);
  });

  test("after/before work correctly", () => {
    expect(Array.isArray(afterAuth)).toBe(true);
    expect(Array.isArray(beforeParams)).toBe(true);
  });

  test("ApiFormat parses correctly", () => {
    const result = ApiFormat.parse(`---
title: API Reference
---

# API Reference

## Endpoints

### GET /users

### POST /users

## Action Items

- [ ] Write tests
- [x] Update docs
`);
    expect(result.title).toBe("API Reference");
    expect(result.endpoints.length).toBeGreaterThanOrEqual(2);
    expect(result.todos.length).toBe(2);
  });
});
