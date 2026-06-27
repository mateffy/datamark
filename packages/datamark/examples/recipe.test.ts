import { describe, test, expect } from "bun:test";
import { RecipeFormat, recipeMarkdown } from "./recipe";

describe("recipe example", () => {
  test("parses frontmatter and title", () => {
    const result = RecipeFormat.parse(recipeMarkdown);
    expect(result.title).toBe("Pancakes");
    expect(result.prepTime).toBe("15 min");
    expect(result.servings).toBe(4);
  });

  test("parses ingredients", () => {
    const result = RecipeFormat.parse(recipeMarkdown);
    expect(result.ingredients).toHaveLength(4);
    expect(result.ingredients[0]).toBe("2 cups flour");
  });

  test("parses steps", () => {
    const result = RecipeFormat.parse(recipeMarkdown);
    expect(result.steps).toHaveLength(3);
    expect(result.steps[0]).toContain("Mix Dry Ingredients");
  });

  test("round-trips through stringify", () => {
    const data = RecipeFormat.parse(recipeMarkdown);
    const md = RecipeFormat.stringify(data);
    expect(md).toContain("---");
    expect(md).toContain("# Pancakes");
    expect(md).toContain("2 cups flour");
  });
});
