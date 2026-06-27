import { describe, test, expect } from "bun:test";
import { PlanFormat, planMarkdown } from "./plan";

describe("plan example", () => {
  test("parses frontmatter id and title", () => {
    const result = PlanFormat.parse(planMarkdown);
    expect(result.id).toBe("plan-001");
    expect(result.title).toBe("Q3 Roadmap");
  });

  test("parses steps with scripts", () => {
    const result = PlanFormat.parse(planMarkdown);
    expect(result.steps).toHaveLength(2);
    expect(result.steps[0].description).toContain("Set up the project");
    expect(result.steps[0].scripts).toHaveLength(1);
    expect(result.steps[0].scripts[0]).toBe("npm init -y");
    expect(result.steps[1].scripts).toHaveLength(0);
  });

  test("round-trips through stringify", () => {
    const data = PlanFormat.parse(planMarkdown);
    const md = PlanFormat.stringify(data);
    expect(md).toContain("---");
    expect(md).toContain("id: plan-001");
    expect(md).toContain("# Q3 Roadmap");
    expect(md).toContain("```javascript");
  });
});
