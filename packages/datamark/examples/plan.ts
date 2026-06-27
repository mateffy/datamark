import { datamark } from "../src/index";
import { findAll, inlineText, textContent, isCodeBlock } from "../src/parse";
import { frontmatter, heading, paragraph, codeBlock } from "../src/stringify";
import * as z from "zod";

export const PlanFrontmatterSchema = z.object({ id: z.string() });

export const PlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(
    z.object({
      description: z.string(),
      scripts: z.array(z.string()),
    })
  ),
});

export const PlanFormat = datamark({
  frontmatterSchema: PlanFrontmatterSchema,
  schema: PlanSchema,

  parse(doc) {
    const id = doc.frontmatter.id;
    const titleSection = doc.root.children.find((n) => n.type === "section") as any;
    const title = titleSection ? inlineText(titleSection.heading.children) : "";

    const steps = titleSection
      ? (titleSection.children.filter((n: any) => n.type === "section") as any[]).map(
          (section) => {
            const scripts = findAll(section, (n) => isCodeBlock(n, "javascript")).map(
              (n: any) => n.value
            );
            const description = textContent(section).trim();
            return { description, scripts };
          }
        )
      : [];

    return { id, title, steps };
  },

  stringify(data) {
    let md = frontmatter({ id: data.id }) + heading(data.title) + "\n\n";
    for (const step of data.steps) {
      md += heading("Step", 2) + "\n\n" + paragraph(step.description) + "\n\n";
      for (const script of step.scripts) {
        md += codeBlock(script, "javascript") + "\n\n";
      }
    }
    return md;
  },
});

export const planMarkdown = `---
id: plan-001
---
# Q3 Roadmap

## Step

Set up the project.

\`\`\`javascript
npm init -y
\`\`\`

## Step

Implement the core features.`;
