import { describe, test, expect } from "bun:test";
import { TodoFormat, todoMarkdown } from "./todo-list";

describe("todo-list example", () => {
  test("parses title and todo items", () => {
    const result = TodoFormat.parse(todoMarkdown);
    expect(result.title).toBe("Today's Tasks");
    expect(result.items).toHaveLength(4);
    expect(result.items[0].text).toBe("Fix the critical bug");
    expect(result.items[0].completed).toBe(true);
    expect(result.items[0].priority).toBe("high");
  });

  test("round-trips through stringify", () => {
    const data = TodoFormat.parse(todoMarkdown);
    const md = TodoFormat.stringify(data);
    expect(md).toContain("# Today's Tasks");
    expect(md).toContain("[x] [high] Fix the critical bug");
  });
});
