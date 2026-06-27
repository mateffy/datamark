import { describe, test, expect } from "bun:test";
import { isHeading } from "../src/parse";
import { h2Sections, subSection, groups, afterH1, beforeFirstH2 } from "./section-navigation";

describe("section-navigation example", () => {
  test("sectionsAtDepth finds h2 sections", () => {
    expect(h2Sections.length).toBeGreaterThanOrEqual(1);
    expect(h2Sections.every((s) => s.heading?.depth === 2)).toBe(true);
  });

  test("sectionsByHeading matches exact text", () => {
    expect(subSection.length).toBeGreaterThanOrEqual(1);
    expect(subSection[0].heading).toBeDefined();
  });

  test("splitBy groups blocks by heading", () => {
    expect(groups.length).toBeGreaterThan(0);
  });

  test("after returns nodes after predicate", () => {
    expect(afterH1.length).toBeGreaterThan(0);
  });

  test("before returns nodes before predicate", () => {
    expect(beforeFirstH2.some((n) => isHeading(n, 1))).toBe(true);
  });
});
