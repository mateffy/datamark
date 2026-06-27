

import { Callout } from 'fumadocs-ui/components/callout';

This example parses a recipe with typed frontmatter metadata (prep time, cook time, servings), an ingredients list, and step-by-step instructions organized in subsections. It uses AST utilities (`inlineText`, `textContent`) for extraction and stringify primitives (`frontmatter`, `heading`, `list`, `paragraph`) for reconstruction.

```typescript
import { datamark } from "datamark";
import { inlineText, textContent } from "datamark/parse";
import { frontmatter, heading, list, paragraph } from "datamark/stringify";
import * as z from "zod";

const RecipeFrontmatterSchema = z.object({
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
});

const RecipeSchema = z.object({
  title: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

const RecipeFormat = datamark({
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

const recipeMarkdown = `---
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
```

```typescript
const result = RecipeFormat.parse(recipeMarkdown);
console.log(result.title);        // "Pancakes"
console.log(result.servings);     // 4
console.log(result.ingredients);  // ["2 cups flour", ...]
console.log(result.steps.length); // 3
```

Key concepts [#key-concepts]

* **`frontmatterSchema`** validates frontmatter before `parse` runs — bad YAML or missing fields throw `ValidationError` immediately
* **`frontmatter()`** from `datamark/stringify` serializes the metadata back to YAML with proper escaping
* **Section lookup by heading text** — `subSections.find(s => inlineText(s.heading.children).toLowerCase() === "ingredients")`
* **Nested subsections** — the "Steps" section contains `###` subsections, each parsed as a step
* **Heading removal from body** — `textContent(stepSection)` includes the heading, so we strip it with a regex
