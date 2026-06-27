import { datamark } from "../src/index";
import { inlineText, extractTodoItems } from "../src/parse";
import { heading, list } from "../src/stringify";
import * as z from "zod";

export const TodoSchema = z.object({
  title: z.string(),
  items: z.array(
    z.object({
      text: z.string(),
      completed: z.boolean(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    })
  ),
});

export const TodoFormat = datamark({
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

export const todoMarkdown = `# Today's Tasks

- [x] [high] Fix the critical bug
- [ ] [medium] Write unit tests
- [ ] Review pull request
- [x] Update documentation`;
