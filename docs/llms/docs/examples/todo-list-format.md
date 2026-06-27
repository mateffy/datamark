

import { Callout } from 'fumadocs-ui/components/callout';

This example parses a todo list with optional priorities and completion status. It uses the Parse SDK's `inlineText` and `extractTodoItems` for parsing, and stringify primitives (`heading`, `list`) for serialization.

```typescript
import { datamark } from "datamark";
import { inlineText, extractTodoItems } from "datamark/parse";
import { heading, list } from "datamark/stringify";
import * as z from "zod";

const TodoSchema = z.object({
  title: z.string(),
  items: z.array(
    z.object({
      text: z.string(),
      completed: z.boolean(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    })
  ),
});

const TodoFormat = datamark({
  schema: TodoSchema,

  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? inlineText(h1.heading.children) : "";
    const rawTodos = extractTodoItems(doc.root);

    const items = rawTodos.map((t) => {
      const match = t.text.match(/^\[(low|medium|high)\]\s*/);
      return {
        text: match ? t.text.slice(match[0].length) : t.text,
        completed: t.completed,
        priority: match ? (match[1] as "low" | "medium" | "high") : undefined,
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

const todoMarkdown = `# Today's Tasks

- [x] [high] Fix the critical bug
- [ ] [medium] Write unit tests
- [ ] Review pull request
- [x] Update documentation`;
```

```typescript
const result = TodoFormat.parse(todoMarkdown);
console.log(result.title); // "Today's Tasks"
console.log(result.items[0].priority); // "high"
```

Key concepts [#key-concepts]

* **`extractTodoItems()`** from the Parse SDK finds all checkbox items recursively
* The `text` field of a todo item can include a priority prefix like `[high]`
* **`list()`** from `datamark/stringify` builds the list string — no manual `\n` concatenation
