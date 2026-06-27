# datamark

> A toolkit for creating Markdown-based file formats and mapping AST nodes (headings, code blocks, todos, …) to structured data.

Build custom data formats out of Markdown. Describe the structure of your document once — frontmatter, headings, code blocks, lists — and get typed, validated objects back. Parse and serialize with the same declarative definition.

Ideal for plan files, conversation threads, specification documents, or any domain format where human readability matters. Two dependencies. Full roundtrip fidelity.

---

## 10-second demo

```typescript
import { datamark, heading, markdown, todoItem, inlineText, textContent, extractTodoItems, splitByCombinator } from "datamark";
import * as z from "zod";

const Plan = datamark({
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.union([z.null(), z.number(), z.literal("done")]),
    steps: z.array(z.object({
      title: z.string(),
      description: z.string(),
      tasks: z.array(z.object({ text: z.string(), completed: z.boolean() })),
      completed: z.boolean(),
    })),
  }),

  *parse(doc) {
    const fm = yield* doc.frontmatter();
    const title = yield* doc.consume(heading(1));
    const description = yield* doc.consume(rest());

    const steps = yield* doc.consume(splitByCombinator(heading(2)), function* (subdoc) {
      const h2 = yield* subdoc.consume(heading(2));
      const tasks = extractTodoItems(subdoc.remaining);
      const body = yield* subdoc.consume(rest());
      return {
        title: inlineText(h2.children),
        description: textContent(body),
        tasks,
        completed: tasks.every((t) => t.completed),
      };
    });

    return {
      id: (fm as any)?.id ?? "",
      title: inlineText(title.children),
      description: textContent(description),
      status: (fm as any)?.status ?? null,
      steps,
    };
  },

  *stringify(doc, data) {
    yield* doc.emitFrontmatter({ id: data.id, status: data.status });
    yield* heading(1, data.title);
    if (data.description) yield* markdown(data.description);
    for (const step of data.steps) {
      yield* heading(2, step.title);
      if (step.description) yield* markdown(step.description);
      for (const task of step.tasks) {
        yield* todoItem(task.text, task.completed);
      }
    }
  },
});

const doc = Plan.parse(`---
id: PLAN-001
status: 1
---

# Migration Plan

Migrate the legacy system to the new platform.

## Step 1: Set up environment

Prepare the staging environment.

- [x] Install dependencies
- [ ] Configure CI/CD

## Step 2: Deploy

Deploy to production.

- [ ] Run migration script
`);

// doc.steps[0].title === "Step 1: Set up environment"
// doc.steps[0].completed === false (one task unchecked)
// doc.status === 1 (current step index)

const md = Plan.stringify(doc); // roundtrip back to Markdown
```

## How it works

1. **Parse** Markdown into a typed AST.
2. **Consume** nodes declaratively with combinators like `heading(1)`, `splitByCombinator(heading(2))`, or `doc.consume(until(heading(2)))`.
3. **Validate** the result against any Standard Schema (Zod, Valibot, ArkType, …).
4. **Serialize** back with the same `stringify` generator.

## Why Markdown-native?

Markdown renders everywhere, diffs cleanly in git, and stays readable for humans and LLMs. datamark lets you treat it as a first-class data format instead of escaping everything into JSON.

## Installation

```bash
npm install datamark
# or
bun add datamark
```

## Documentation

| What you need | Link |
|---------------|------|
| Get started in 5 minutes | [Quickstart](https://datamark.md/docs/quickstart) |
| Understand the architecture | [Format SDK](https://datamark.md/docs/explanation/template-system) |
| Query and traverse the AST | [AST SDK](https://datamark.md/docs/core) |
| See real-world examples | [Examples](https://datamark.md/docs/examples) |
| Compare to alternatives | [Comparisons](https://datamark.md/compare) |
| Full API reference | [datamark.md/docs](https://datamark.md/docs) |

## License

MIT
