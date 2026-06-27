import { datamark } from "../src/index";
import { inlineText, textContent } from "../src/parse";
import { frontmatter, heading, list, paragraph } from "../src/stringify";
import * as z from "zod";

export const RecipeFrontmatterSchema = z.object({
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
});

export const RecipeSchema = z.object({
  title: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

export const RecipeFormat = datamark({
  frontmatterSchema: RecipeFrontmatterSchema,
  schema: RecipeSchema,

  parse(doc) {
    const fm = doc.frontmatter;
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? inlineText(h1.heading.children) : "";

    const subSections = h1
      ? (h1.children.filter((n: any) => n.type === "section") as any[])
      : [];

    const ingredientsSection = subSections.find(
      (s) => inlineText(s.heading.children).toLowerCase() === "ingredients"
    );
    const ingredients: string[] = [];
    if (ingredientsSection) {
      for (const child of ingredientsSection.children) {
        if (child.type === "list") {
          for (const item of child.children) {
            ingredients.push(inlineText(item.children[0]?.children ?? []).trim());
          }
        }
      }
    }

    const stepsSection = subSections.find(
      (s) => inlineText(s.heading.children).toLowerCase() === "steps"
    );
    const steps: string[] = [];
    if (stepsSection) {
      for (const stepSection of stepsSection.children.filter(
        (n: any) => n.type === "section"
      )) {
        const stepHeading = stepSection.heading
          ? inlineText(stepSection.heading.children)
          : "";
        const body = textContent(stepSection).trim();
        const bodyWithoutHeading = body
          .replace(new RegExp(`^${stepHeading}\\s*`), "")
          .trim();
        steps.push(`${stepHeading}\n\n${bodyWithoutHeading}`);
      }
    }

    return {
      title,
      prepTime: fm.prepTime,
      cookTime: fm.cookTime,
      servings: fm.servings,
      ingredients,
      steps,
    };
  },

  stringify(data) {
    let md =
      frontmatter({
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
      }) +
      heading(data.title) +
      "\n\n";
    md += heading("Ingredients", 2) + "\n\n" + list(data.ingredients) + "\n\n";
    md += heading("Steps", 2) + "\n\n";
    for (const step of data.steps) {
      const [stepHeading, ...bodyLines] = step.split("\n");
      md += heading(stepHeading, 3) + "\n\n" + paragraph(bodyLines.join("\n").trim()) + "\n\n";
    }
    return md;
  },
});

export const recipeMarkdown = `---
prepTime: 15 min
cookTime: 30 min
servings: 4
---
# Pancakes

## Ingredients

- 2 cups flour
- 2 eggs
- 1.5 cups milk
- 1 tbsp sugar

## Steps

### Mix Dry Ingredients

Whisk the flour and sugar together in a large bowl.

### Combine Wet Ingredients

Beat the eggs into the milk, then pour into the dry mix.

### Cook

Ladle onto a hot griddle. Flip when bubbles form.`;
