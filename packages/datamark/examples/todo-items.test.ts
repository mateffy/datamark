import { describe, test, expect } from "bun:test";
import { firstIsTodo, todos } from "./todo-items";

describe("todo-items example", () => {
  test("isTodoItem identifies todo lists", () => {
    expect(firstIsTodo).toBe(true);
  });

  test("extractTodoItems returns all todos", () => {
    expect(todos.length).toBe(3);
    expect(todos[0].completed).toBe(true);
    expect(todos[1].completed).toBe(false);
    expect(todos[0].text).toBe("Done item");
  });
});
