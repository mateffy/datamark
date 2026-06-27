import { datamark } from "datamark";
import {
  inlineText,
  textContent,
  findAll,
  isCodeBlock,
  isHeading,
  extractTodoItems,
} from "datamark/parse";
import {
  frontmatter,
  heading,
  paragraph,
  codeBlock,
  list,
} from "datamark/stringify";
import * as z from "zod";

export interface ExampleFormat {
  id: string;
  label: string;
  description: string;
  markdown: string;
  formatCode: string;
  parseFn: (markdown: string) => unknown;
}

// ── Example 1: Plan ──────────────────────────────────────────────────────────

const FrontmatterSchema = z.object({ id: z.string() });

const PlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(
    z.object({
      description: z.string(),
      scripts: z.array(z.string()),
    })
  ),
});

const PlanFormat = datamark({
  frontmatterSchema: FrontmatterSchema,
  schema: PlanSchema,
  description: "A project plan with frontmatter, title, and step sections.",
  examples: [
    {
      text: `---
id: plan-001
---
# Q3 Roadmap

## Step

Set up the project.

\`\`\`javascript
npm init -y
\`\`\`

## Step

Implement the core features.`,
      data: {
        id: "plan-001",
        title: "Q3 Roadmap",
        steps: [
          { description: "Set up the project.", scripts: ["npm init -y"] },
          { description: "Implement the core features.", scripts: [] },
        ],
      },
    },
  ],
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

// ── Example 2: Blog Post ───────────────────────────────────────────────────

const BlogFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
});

const BlogPostSchema = z.object({
  meta: BlogFrontmatterSchema,
  body: z.string(),
});

const BlogPostFormat = datamark({
  frontmatterSchema: BlogFrontmatterSchema,
  schema: BlogPostSchema,
  parse(doc) {
    const meta = doc.frontmatter;
    const body = textContent(doc.root).trim();
    return { meta, body };
  },
  stringify(data) {
    return (
      frontmatter(data.meta) +
      paragraph(data.body) +
      "\n"
    );
  },
});

// ── Example 3: Todo List ───────────────────────────────────────────────────

const TodoListSchema = z.object({
  title: z.string(),
  items: z.array(
    z.object({
      text: z.string(),
      completed: z.boolean(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    })
  ),
});

const TodoListFormat = datamark({
  schema: TodoListSchema,
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? inlineText(h1.heading.children) : "";
    const rawTodos = extractTodoItems(doc.root);

    const items = rawTodos.map((t) => {
      const priorityMatch = t.text.match(/^\[(low|medium|high)\]\s*/);
      return {
        text: priorityMatch ? t.text.slice(priorityMatch[0].length) : t.text,
        completed: t.completed,
        priority: priorityMatch ? (priorityMatch[1] as any) : undefined,
      };
    });
    return { title, items };
  },
  stringify(data) {
    const items = data.items.map((item) => {
      const prefix = item.priority ? `[${item.priority}] ` : "";
      const checkbox = item.completed ? "[x]" : "[ ]";
      return `${checkbox} ${prefix}${item.text}`;
    });
    return heading(data.title) + "\n\n" + list(items) + "\n";
  },
});

// ── Example 4: API Doc ──────────────────────────────────────────────────────

const ApiDocSchema = z.object({
  endpoint: z.string(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  description: z.string(),
  params: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string(),
    })
  ),
  response: z.string(),
});

const ApiDocFormat = datamark({
  schema: ApiDocSchema,
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const headingText = h1 ? inlineText(h1.heading.children) : "";
    const parts = headingText.split(" ");
    const method = parts[0] as any;
    const endpoint = parts[1] ?? "";

    const sections = doc.root.children.filter((n) => n.type === "section") as any[];
    const topSection = sections[0];
    const subSections = topSection
      ? (topSection.children.filter((n: any) => n.type === "section") as any[])
      : [];

    let description = "";
    let response = "";
    let params: any[] = [];

    for (const section of subSections) {
      const headingText = section.heading
        ? inlineText(section.heading.children).toLowerCase()
        : "";

      if (headingText.includes("description")) {
        description = textContent(section).trim();
      }

      if (headingText.includes("parameters")) {
        const paramBlocks = findAll(section, (n) => isCodeBlock(n, "json"));
        for (const block of paramBlocks) {
          try {
            const parsed = JSON.parse((block as any).value);
            params.push(parsed);
          } catch {
            /* ignore */
          }
        }
      }

      if (headingText.includes("response")) {
        const respBlocks = findAll(section, (n) => isCodeBlock(n, "json"));
        if (respBlocks.length > 0) {
          response = (respBlocks[0] as any).value;
        }
      }
    }

    return { endpoint, method, description, params, response };
  },
  stringify(data) {
    let md = heading(`${data.method} ${data.endpoint}`) + "\n\n";
    md += heading("Description", 2) + "\n\n" + paragraph(data.description) + "\n\n";
    if (data.params.length > 0) {
      md += heading("Parameters", 2) + "\n\n";
      for (const p of data.params) {
        md += codeBlock(JSON.stringify(p, null, 2), "json") + "\n\n";
      }
    }
    md += heading("Response", 2) + "\n\n";
    md += codeBlock(data.response, "json") + "\n\n";
    return md;
  },
});

// ── Example 5: Changelog ────────────────────────────────────────────────────

const ChangelogSchema = z.object({
  versions: z.array(
    z.object({
      version: z.string(),
      date: z.string().optional(),
      changes: z.array(z.string()),
    })
  ),
});

const ChangelogFormat = datamark({
  schema: ChangelogSchema,
  description: "A versioned changelog with release dates and bullet lists.",
  examples: [
    {
      text: `# Changelog

## 1.2.0 — 2026-06-15

- Added dark mode support
- Fixed memory leak in parser
- Improved error messages

## 1.1.0 — 2026-05-01

- New table parsing
- Better frontmatter handling`,
      data: {
        versions: [
          {
            version: "1.2.0",
            date: "2026-06-15",
            changes: [
              "Added dark mode support",
              "Fixed memory leak in parser",
              "Improved error messages",
            ],
          },
          {
            version: "1.1.0",
            date: "2026-05-01",
            changes: ["New table parsing", "Better frontmatter handling"],
          },
        ],
      },
    },
  ],
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const versionSections = h1
      ? (h1.children.filter((n: any) => n.type === "section") as any[])
      : [];

    const versions = versionSections.map((section: any) => {
      const heading = inlineText(section.heading.children);
      const match = heading.match(/^(\S+)\s*(?:[—-]\s*(.+))?$/);
      const version = match?.[1] ?? heading;
      const date = match?.[2];

      const changes: string[] = [];
      for (const child of section.children) {
        if (child.type === "list") {
          for (const item of child.children) {
            changes.push(textContent(item).trim());
          }
        }
      }

      return { version, date, changes };
    });

    return { versions };
  },
  stringify(data) {
    let md = heading("Changelog") + "\n\n";
    for (const v of data.versions) {
      const datePart = v.date ? ` — ${v.date}` : "";
      md += heading(`${v.version}${datePart}`, 2) + "\n\n";
      md += list(v.changes) + "\n\n";
    }
    return md;
  },
});

// ── Example 6: Recipe ──────────────────────────────────────────────────────

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
  description: "A cooking recipe with frontmatter metadata, ingredients list, and step sections.",
  examples: [
    {
      text: `---
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

Ladle onto a hot griddle. Flip when bubbles form.`,
      data: {
        title: "Pancakes",
        prepTime: "15 min",
        cookTime: "30 min",
        servings: 4,
        ingredients: ["2 cups flour", "2 eggs", "1.5 cups milk", "1 tbsp sugar"],
        steps: [
          "Mix Dry Ingredients\n\nWhisk the flour and sugar together in a large bowl.",
          "Combine Wet Ingredients\n\nBeat the eggs into the milk, then pour into the dry mix.",
          "Cook\n\nLadle onto a hot griddle. Flip when bubbles form.",
        ],
      },
    },
  ],
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
            ingredients.push(textContent(item).trim());
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
        const heading = stepSection.heading
          ? inlineText(stepSection.heading.children)
          : "";
        const body = textContent(stepSection).trim();
        const bodyWithoutHeading = body
          .replace(new RegExp(`^${heading}\\s*`), "")
          .trim();
        steps.push(`${heading}\n\n${bodyWithoutHeading}`);
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

// ── Example 7: Meeting Notes ───────────────────────────────────────────────

const MeetingNotesSchema = z.object({
  title: z.string(),
  date: z.string(),
  attendees: z.array(z.string()),
  agenda: z.array(z.string()),
  actionItems: z.array(
    z.object({
      text: z.string(),
      completed: z.boolean(),
      owner: z.string().optional(),
    })
  ),
});

const MeetingNotesFormat = datamark({
  schema: MeetingNotesSchema,
  description: "Meeting notes with attendees, agenda, and tracked action items.",
  examples: [
    {
      text: `# Sprint Planning — 2026-06-20

## Attendees

- Alice (Engineering)
- Bob (Product)
- Carol (Design)

## Agenda

1. Review last sprint
2. Plan next sprint
3. Estimate stories

## Action Items

- [ ] Alice: Set up CI pipeline
- [x] Bob: Update product roadmap
- [ ] Carol: Design system review`,
      data: {
        title: "Sprint Planning — 2026-06-20",
        date: "2026-06-20",
        attendees: ["Alice (Engineering)", "Bob (Product)", "Carol (Design)"],
        agenda: ["Review last sprint", "Plan next sprint", "Estimate stories"],
        actionItems: [
          { text: "Set up CI pipeline", completed: false, owner: "Alice" },
          { text: "Update product roadmap", completed: true, owner: "Bob" },
          { text: "Design system review", completed: false, owner: "Carol" },
        ],
      },
    },
  ],
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const headingText = h1 ? inlineText(h1.heading.children) : "";
    const dateMatch = headingText.match(/\d{4}-\d{2}-\d{2}/);
    const title = headingText;
    const date = dateMatch ? dateMatch[0] : "";

    const subSections = h1
      ? (h1.children.filter((n: any) => n.type === "section") as any[])
      : [];

    const attendeesSection = subSections.find(
      (s) => inlineText(s.heading.children).toLowerCase() === "attendees"
    );
    const attendees: string[] = [];
    if (attendeesSection) {
      for (const child of attendeesSection.children) {
        if (child.type === "list") {
          for (const item of child.children) {
            attendees.push(textContent(item).trim());
          }
        }
      }
    }

    const agendaSection = subSections.find(
      (s) => inlineText(s.heading.children).toLowerCase() === "agenda"
    );
    const agenda: string[] = [];
    if (agendaSection) {
      for (const child of agendaSection.children) {
        if (child.type === "list") {
          for (const item of child.children) {
            agenda.push(textContent(item).trim());
          }
        }
      }
    }

    const actionSection = subSections.find(
      (s) => inlineText(s.heading.children).toLowerCase() === "action items"
    );
    let actionItems: any[] = [];
    if (actionSection) {
      const rawTodos = extractTodoItems(actionSection);
      actionItems = rawTodos.map((t) => {
        const match = t.text.match(/^([^(]+)\(([^)]+)\)\s*:\s*(.+)$/);
        if (match) {
          return {
            owner: match[1].trim(),
            text: match[3].trim(),
            completed: t.completed,
          };
        }
        return { text: t.text, completed: t.completed };
      });
    }

    return { title, date, attendees, agenda, actionItems };
  },
  stringify(data) {
    let md = heading(data.title) + "\n\n";
    md += heading("Attendees", 2) + "\n\n" + list(data.attendees) + "\n\n";
    md += heading("Agenda", 2) + "\n\n" + list(data.agenda, true) + "\n\n";
    md += heading("Action Items", 2) + "\n\n";
    const actionItems = data.actionItems.map((item) => {
      const prefix = item.owner ? `${item.owner}: ` : "";
      const checkbox = item.completed ? "[x]" : "[ ]";
      return `${checkbox} ${prefix}${item.text}`;
    });
    md += list(actionItems) + "\n";
    return md;
  },
});

// ── Markdown inputs ─────────────────────────────────────────────────────────

const planMarkdown = `---
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

const blogMarkdown = `---
title: Hello World
date: 2026-05-30
author: Ada
tags: [typescript, markdown]
---

This is the first paragraph of the blog post.

## Subheading

More content here with **bold** text and a [link](https://example.com).`;

const todoMarkdown = `# Today's Tasks

- [x] [high] Fix the critical bug
- [ ] [medium] Write unit tests
- [ ] Review pull request
- [x] Update documentation`;

const apiMarkdown = `# GET /users

## Description

Returns a paginated list of users from the database.

## Parameters

\`\`\`json
{ "name": "limit", "type": "number", "required": false, "description": "Maximum number of results" }
\`\`\`

\`\`\`json
{ "name": "offset", "type": "number", "required": false, "description": "Pagination offset" }
\`\`\`

## Response

\`\`\`json
{ "users": [{ "id": 1, "name": "Ada Lovelace" }] }
\`\`\``;

const changelogMarkdown = `# Changelog

## 1.2.0 — 2026-06-15

- Added dark mode support
- Fixed memory leak in parser
- Improved error messages

## 1.1.0 — 2026-05-01

- New table parsing
- Better frontmatter handling`;

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

const meetingMarkdown = `# Sprint Planning — 2026-06-20

## Attendees

- Alice (Engineering)
- Bob (Product)
- Carol (Design)

## Agenda

1. Review last sprint
2. Plan next sprint
3. Estimate stories

## Action Items

- [ ] Alice: Set up CI pipeline
- [x] Bob: Update product roadmap
- [ ] Carol: Design system review`;

// ── Format code strings (for display) ──────────────────────────────────────

const planFormatCode = `const PlanFormat = datamark({
  frontmatterSchema: z.object({ id: z.string() }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    steps: z.array(z.object({
      description: z.string(),
      scripts: z.array(z.string()),
    })),
  }),

  parse(doc) {
    const id = doc.frontmatter.id; // typed as string
    const titleSection = doc.root.children.find(n => n.type === "section");
    const title = titleSection ? inlineText(titleSection.heading.children) : "";

    const steps = titleSection.children
      .filter(n => n.type === "section")
      .map(section => {
        const scripts = findAll(section, n => isCodeBlock(n, "javascript"))
          .map(n => n.value);
        const description = textContent(section).trim();
        return { description, scripts };
      });

    return { id, title, steps };
  },
});`;

const blogFormatCode = `const BlogPostFormat = datamark({
  frontmatterSchema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
  }),
  schema: z.object({
    meta: z.object({ title: z.string(), date: z.string(),
                     author: z.string(), tags: z.array(z.string()) }),
    body: z.string(),
  }),

  parse(doc) {
    const meta = doc.frontmatter; // typed
    const body = textContent(doc.root).trim();
    return { meta, body };
  },
});`;

const todoFormatCode = `const TodoListFormat = datamark({
  schema: z.object({
    title: z.string(),
    items: z.array(z.object({
      text: z.string(),
      completed: z.boolean(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    })),
  }),

  parse(doc) {
    const h1 = doc.root.children.find(n => n.type === "section");
    const title = h1 ? inlineText(h1.heading.children) : "";
    const rawTodos = extractTodoItems(doc.root);

    const items = rawTodos.map(t => {
      const match = t.text.match(/^\\[(low|medium|high)\\]\\s*/);
      return {
        text: match ? t.text.slice(match[0].length) : t.text,
        completed: t.completed,
        priority: match ? match[1] : undefined,
      };
    });

    return { title, items };
  },
});`;

const apiFormatCode = `const ApiDocFormat = datamark({
  schema: z.object({
    endpoint: z.string(),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    description: z.string(),
    params: z.array(z.object({
      name: z.string(), type: z.string(),
      required: z.boolean(), description: z.string(),
    })),
    response: z.string(),
  }),

  parse(doc) {
    const h1 = doc.root.children.find(n => n.type === "section");
    const [method, endpoint] = inlineText(h1.heading.children).split(" ");
    const subSections = h1.children.filter(n => n.type === "section");

    // Extract description, params, response from sections
    // ...

    return { endpoint, method, description, params, response };
  },
});`;

const changelogFormatCode = `const ChangelogFormat = datamark({
  schema: z.object({
    versions: z.array(z.object({
      version: z.string(),
      date: z.string().optional(),
      changes: z.array(z.string()),
    })),
  }),

  parse(doc) {
    const h1 = doc.root.children.find(n => n.type === "section");
    const versionSections = h1.children.filter(n => n.type === "section");

    return {
      versions: versionSections.map(section => {
        const heading = inlineText(section.heading.children);
        const match = heading.match(/^(\\S+)\\s*(?:[—-]\\s*(.+))?$/);
        const changes = [];
        for (const child of section.children) {
          if (child.type === "list") {
            for (const item of child.children) {
              changes.push(textContent(item).trim());
            }
          }
        }
        return {
          version: match?.[1] ?? heading,
          date: match?.[2],
          changes,
        };
      }),
    };
  },
});`;

const recipeFormatCode = `const RecipeFormat = datamark({
  frontmatterSchema: z.object({
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number(),
  }),
  schema: z.object({
    title: z.string(),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
  }),

  parse(doc) {
    const fm = doc.frontmatter; // typed as { prepTime, cookTime, servings }
    const h1 = doc.root.children.find(n => n.type === "section");
    const subSections = h1.children.filter(n => n.type === "section");

    const ingredientsSection = subSections.find(
      s => inlineText(s.heading.children).toLowerCase() === "ingredients"
    );
    const ingredients = [];
    // ...extract from list

    const stepsSection = subSections.find(
      s => inlineText(s.heading.children).toLowerCase() === "steps"
    );
    const steps = [];
    // ...extract from sub-sections

    return { title, prepTime: fm.prepTime, cookTime: fm.cookTime,
             servings: fm.servings, ingredients, steps };
  },
});`;

const meetingFormatCode = `const MeetingNotesFormat = datamark({
  schema: z.object({
    title: z.string(), date: z.string(),
    attendees: z.array(z.string()),
    agenda: z.array(z.string()),
    actionItems: z.array(z.object({
      text: z.string(), completed: z.boolean(), owner: z.string().optional(),
    })),
  }),

  parse(doc) {
    const h1 = doc.root.children.find(n => n.type === "section");
    const title = inlineText(h1.heading.children);
    const dateMatch = title.match(/\\d{4}-\\d{2}-\\d{2}/);

    const subSections = h1.children.filter(n => n.type === "section");
    // ...extract attendees, agenda, action items

    return { title, date: dateMatch?.[0] ?? "", attendees, agenda, actionItems };
  },
});`;

// ── Export all examples ──────────────────────────────────────────────────────

export const examples: ExampleFormat[] = [
  {
    id: "plan",
    label: "Plan",
    description: "A project plan with frontmatter, title, and step sections",
    markdown: planMarkdown,
    formatCode: planFormatCode,
    parseFn: (md) => PlanFormat.parse(md),
  },
  {
    id: "blog",
    label: "Blog Post",
    description: "Metadata + body content with tags",
    markdown: blogMarkdown,
    formatCode: blogFormatCode,
    parseFn: (md) => BlogPostFormat.parse(md),
  },
  {
    id: "todo",
    label: "Todo List",
    description: "Checkbox items with optional priorities",
    markdown: todoMarkdown,
    formatCode: todoFormatCode,
    parseFn: (md) => TodoListFormat.parse(md),
  },
  {
    id: "api",
    label: "API Doc",
    description: "Endpoint documentation with parameters and responses",
    markdown: apiMarkdown,
    formatCode: apiFormatCode,
    parseFn: (md) => ApiDocFormat.parse(md),
  },
  {
    id: "changelog",
    label: "Changelog",
    description: "Versioned changelog with release dates and bullet lists",
    markdown: changelogMarkdown,
    formatCode: changelogFormatCode,
    parseFn: (md) => ChangelogFormat.parse(md),
  },
  {
    id: "recipe",
    label: "Recipe",
    description: "Cooking recipe with frontmatter metadata and step sections",
    markdown: recipeMarkdown,
    formatCode: recipeFormatCode,
    parseFn: (md) => RecipeFormat.parse(md),
  },
  {
    id: "meeting",
    label: "Meeting Notes",
    description: "Meeting notes with attendees, agenda, and action items",
    markdown: meetingMarkdown,
    formatCode: meetingFormatCode,
    parseFn: (md) => MeetingNotesFormat.parse(md),
  },
];

export function getExampleById(id: string): ExampleFormat | undefined {
  return examples.find((e) => e.id === id);
}
