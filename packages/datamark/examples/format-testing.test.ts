import { describe, test, expect } from "bun:test";
import { TestedFormat } from "./format-testing";

describe("format-testing example", () => {
  test("inline examples pass validation", () => {
    const result = TestedFormat.test();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });
});
