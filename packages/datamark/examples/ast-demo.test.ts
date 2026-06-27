import { describe, test, expect } from "bun:test";
import {
  doc,
  topSection,
  topSectionDepth,
  subSections,
  subSubSections,
  subSubDepth,
  paraDoc,
  firstSection,
  firstSectionType,
  firstSectionHeadingDepth,
  firstSectionChildType,
} from "./ast-demo";

describe("ast-demo", () => {
  test("doc parses with section tree", () => {
    expect(doc.root.type).toBe("section");
  });

  test("top section has heading depth 1", () => {
    expect(topSectionDepth).toBe(1);
  });

  test("subSections finds Section A and Section B", () => {
    expect(subSections.length).toBe(2);
  });

  test("subSubSections finds Subsection A1", () => {
    expect(subSubSections.length).toBe(1);
    expect(subSubDepth).toBe(3);
  });

  test("paraDoc node example works", () => {
    expect(firstSectionType).toBe("section");
    expect(firstSectionHeadingDepth).toBe(1);
    expect(firstSectionChildType).toBe("paragraph");
  });
});
