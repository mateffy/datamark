import { describe, test, expect } from "bun:test";
import { ApiDocFormat, apiMarkdown } from "./api-docs";

describe("api-docs example", () => {
  test("parses endpoint and method", () => {
    const result = ApiDocFormat.parse(apiMarkdown);
    expect(result.method).toBe("GET");
    expect(result.endpoint).toBe("/users");
  });

  test("parses description", () => {
    const result = ApiDocFormat.parse(apiMarkdown);
    expect(result.description).toContain("paginated list of users");
  });

  test("parses parameters from JSON code blocks", () => {
    const result = ApiDocFormat.parse(apiMarkdown);
    expect(result.params).toHaveLength(2);
    expect(result.params[0].name).toBe("limit");
  });

  test("parses response from JSON code block", () => {
    const result = ApiDocFormat.parse(apiMarkdown);
    expect(result.response).toContain("Ada Lovelace");
  });

  test("round-trips through stringify", () => {
    const data = ApiDocFormat.parse(apiMarkdown);
    const md = ApiDocFormat.stringify(data);
    expect(md).toContain("# GET /users");
    expect(md).toContain("```json");
  });
});
