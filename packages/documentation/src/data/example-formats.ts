import { datamark, heading, splitBy, codeBlock, many, optional, until, rest, markdown, todoItem, isCodeBlock, isHeading } from "datamark";
import * as z from "zod";

export interface ExampleFormat {
  id: string;
  label: string;
  description: string;
  markdown: string;
  formatCode: string;
  parseFn: (markdown: string) => unknown;
  traceFn: (markdown: string) => unknown;
}

// ── Example 1: Plan ──────────────────────────────────────────────────────────

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
  schema: PlanSchema,
  description: "A project plan with frontmatter, title, and step sections.",
  examples: [
    {
      text: `---\nid: plan-001\n---\n# Q3 Roadmap\n\n## Step\n\nSet up the project.\n\n\`\`\`javascript\nnpm init -y\n\`\`\`\n\n## Step\n\nImplement the core features.`,
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
  *parse(doc) {
    const fm = yield* doc.consumeFrontmatter();
    const title = yield* doc.consume(heading(1));
    const sections = yield* doc.consume(splitBy(heading(2)));

    const steps = sections.map((section) => {
      const scripts = section
        .filter((n: any) => n.type === "code")
        .map((n: any) => n.value);
      const other = section.filter((n: any) => n.type !== "code");
      const description = other
        .map((n: any) => ("value" in n ? n.value : ""))
        .join("\n")
        .trim();
      return { description, scripts };
    });

    return { id: (fm as any)?.id ?? "", title: title.text, steps };
  },

  *stringify(doc, data) {
    yield* doc.emitFrontmatter({ id: data.id, title: data.title });
    yield* heading(1, data.title);
    for (const step of data.steps) {
      yield* heading(2, "Step");
      if (step.description) yield* markdown(step.description);
      for (const s of step.scripts) yield* codeBlock("javascript", s);
    }
  },
});

// ── Example 2: Blog Post ───────────────────────────────────────────────────

const BlogPostSchema = z.object({
  meta: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
  }),
  body: z.string(),
});

const BlogPostFormat = datamark({
  schema: BlogPostSchema,
  *parse(doc) {
    const fm = yield* doc.consumeFrontmatter();
    const meta = fm as any;
    const bodyNodes = yield* doc.consume(rest());
    const body = bodyNodes.map((n: any) => n.raw ?? "").join("\n").trim();
    return { meta, body };
  },
  *stringify(doc, data) {
    yield* doc.emitFrontmatter(data.meta);
    yield* markdown(data.body);
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
  *parse(doc) {
    const h1 = yield* doc.consume(heading(1));
    const nodes = yield* doc.consume(rest());
    const rawTodos = (() => {
      // Inline extractTodoItems logic for browser compatibility
      const items: Array<{ text: string; completed: boolean }> = [];
      function walk(ns: any[]) {
        for (const n of ns) {
          if (n.type === "list") {
            for (const item of n.items) {
              const first = item[0];
              if (first && first.type === "paragraph") {
                const text = first.children
                  .map((c: any) => (c.type === "text" ? c.value : ""))
                  .join("");
                const match = text.match(/^\[([ xX])\]\s?(.*)$/);
                if (match) {
                  items.push({
                    text: match[2]!,
                    completed: match[1]!.toLowerCase() === "x",
                  });
                }
              }
            }
          }
          if (n.type === "blockquote") walk(n.children);
        }
      }
      walk(nodes);
      return items;
    })();

    const items = rawTodos.map((t) => {
      const priorityMatch = t.text.match(/^\[(low|medium|high)\]\s*/);
      return {
        text: priorityMatch ? t.text.slice(priorityMatch[0].length) : t.text,
        completed: t.completed,
        priority: priorityMatch ? (priorityMatch[1] as any) : undefined,
      };
    });
    return { title: h1.text, items };
  },
  *stringify(doc, data) {
    yield* heading(1, data.title);
    for (const item of data.items) {
      const prefix = item.priority ? `[${item.priority}] ` : "";
      yield* todoItem(prefix + item.text, item.completed);
    }
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
  *parse(doc) {
    const h1 = yield* doc.consume(heading(1));
    const parts = h1.text.split(" ");
    const method = parts[0] as any;
    const endpoint = parts[1] ?? "";

    const sections = yield* doc.consume(splitBy(heading(2)));

    let description = "";
    let response = "";
    let params: any[] = [];

    for (const section of sections) {
      const headingNode = section.find((n: any) => n.type === "heading");
      const headingText = headingNode?.children
        ?.map((c: any) => (c.type === "text" ? c.value : ""))
        .join("")
        .toLowerCase() ?? "";

      if (headingText.includes("description")) {
        description = section
          .filter((n: any) => n.type === "paragraph")
          .map((n: any) =>
            n.children.map((c: any) => (c.type === "text" ? c.value : "")).join("")
          )
          .join("\n");
      }

      if (headingText.includes("parameters")) {
        const paramBlocks = section.filter((n: any) => isCodeBlock(n, "json"));
        for (const block of paramBlocks) {
          try {
            const parsed = JSON.parse(block.value);
            params.push(parsed);
          } catch {
            /* ignore */
          }
        }
      }

      if (headingText.includes("response")) {
        const respBlock = section.find((n: any) => isCodeBlock(n, "json"));
        response = respBlock?.value ?? "";
      }
    }

    return { endpoint, method, description, params, response };
  },
  *stringify(doc, data) {
    yield* heading(1, `${data.method} ${data.endpoint}`);
    yield* heading(2, "Description");
    yield* markdown(data.description);
    if (data.params.length > 0) {
      yield* heading(2, "Parameters");
      for (const p of data.params) {
        yield* codeBlock("json", JSON.stringify(p, null, 2));
      }
    }
    yield* heading(2, "Response");
    yield* codeBlock("json", data.response);
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

// ── Format code strings (for display) ──────────────────────────────────────

const planFormatCode = `const PlanFormat = datamark({
  schema: z.object({
    id: z.string(),
    title: z.string(),
    steps: z.array(z.object({
      description: z.string(),
      scripts: z.array(z.string()),
    })),
  }),

  *parse(doc) {
    const fm = yield* doc.consumeFrontmatter();
    const title = yield* doc.consume(heading(1));
    const sections = yield* doc.consume(splitBy(heading(2)));

    const steps = sections.map((section) => {
      const scripts = section
        .filter((n) => n.type === "code")
        .map((n) => n.value);
      const description = section
        .filter((n) => n.type !== "code")
        .map((n) => n.value)
        .join("\\n")
        .trim();
      return { description, scripts };
    });

    return { id: fm.id, title: title.text, steps };
  },
});`;

const blogFormatCode = `const BlogPostFormat = datamark({
  schema: z.object({
    meta: z.object({
      title: z.string(),
      date: z.string(),
      author: z.string(),
      tags: z.array(z.string()),
    }),
    body: z.string(),
  }),

  *parse(doc) {
    const fm = yield* doc.consumeFrontmatter();
    const bodyNodes = yield* doc.consume(rest());
    const body = bodyNodes
      .map((n) => n.raw)
      .join("\\n")
      .trim();
    return { meta: fm, body };
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

  *parse(doc) {
    const h1 = yield* doc.consume(heading(1));
    const nodes = yield* doc.consume(rest());
    const rawTodos = extractTodoItems(nodes);

    const items = rawTodos.map((t) => {
      const match = t.text.match(/^\\[(low|medium|high)\\]\\s*/);
      return {
        text: match ? t.text.slice(match[0].length) : t.text,
        completed: t.completed,
        priority: match ? match[1] : undefined,
      };
    });

    return { title: h1.text, items };
  },
});`;

const apiFormatCode = `const ApiDocFormat = datamark({
  schema: z.object({
    endpoint: z.string(),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    description: z.string(),
    params: z.array(z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string(),
    })),
    response: z.string(),
  }),

  *parse(doc) {
    const h1 = yield* doc.consume(heading(1));
    const [method, endpoint] = h1.text.split(" ");
    const sections = yield* doc.consume(splitBy(heading(2)));

    // Extract description, params, response from sections
    // ...

    return { endpoint, method, description, params, response };
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
    traceFn: (md) => PlanFormat.trace(md),
  },
  {
    id: "blog",
    label: "Blog Post",
    description: "Metadata + body content with tags",
    markdown: blogMarkdown,
    formatCode: blogFormatCode,
    parseFn: (md) => BlogPostFormat.parse(md),
    traceFn: (md) => BlogPostFormat.trace(md),
  },
  {
    id: "todo",
    label: "Todo List",
    description: "Checkbox items with optional priorities",
    markdown: todoMarkdown,
    formatCode: todoFormatCode,
    parseFn: (md) => TodoListFormat.parse(md),
    traceFn: (md) => TodoListFormat.trace(md),
  },
  {
    id: "api",
    label: "API Doc",
    description: "Endpoint documentation with parameters and responses",
    markdown: apiMarkdown,
    formatCode: apiFormatCode,
    parseFn: (md) => ApiDocFormat.parse(md),
    traceFn: (md) => ApiDocFormat.trace(md),
  },
];

export function getExampleById(id: string): ExampleFormat | undefined {
  return examples.find((e) => e.id === id);
}
