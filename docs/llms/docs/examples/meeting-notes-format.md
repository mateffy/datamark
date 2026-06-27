

import { Callout } from 'fumadocs-ui/components/callout';

This example parses meeting notes with a title containing the date, attendee lists, agenda items, and checkbox action items with owners. No frontmatter needed. It uses AST utilities (`inlineText`, `textContent`, `extractTodoItems`) for extraction and stringify primitives (`heading`, `list`) for reconstruction.

```typescript
import { datamark } from "datamark";
import { inlineText, textContent, extractTodoItems } from "datamark/parse";
import { heading, list } from "datamark/stringify";
import * as z from "zod";

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
            attendees.push(inlineText(item.children[0]?.children ?? []).trim());
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
            agenda.push(inlineText(item.children[0]?.children ?? []).trim());
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
        const match = t.text.match(/^([^:]+)\s*:\s*(.+)$/);
        if (match) {
          return {
            owner: match[1].trim(),
            text: match[2].trim(),
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

const meetingNotesMarkdown = `# Sprint Planning — 2026-06-20

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
```

```typescript
const result = MeetingNotesFormat.parse(meetingNotesMarkdown);
console.log(result.title);            // "Sprint Planning — 2026-06-20"
console.log(result.date);             // "2026-06-20"
console.log(result.attendees.length); // 3
console.log(result.actionItems[0].owner);     // "Alice"
console.log(result.actionItems[0].completed); // false
```

Key concepts [#key-concepts]

* **Date extraction from heading** — regex pulls the ISO date out of the title
* **`extractTodoItems()`** from the Parse SDK finds all checkbox items under the "Action Items" section
* **Owner parsing from checkbox text** — action items follow the pattern `Owner: Task description`
* **Ordered vs. unordered lists** — agenda uses numbered lists, attendees and action items use bullets
* **`list()`** from `datamark/stringify` with `ordered: true` reconstructs numbered lists correctly
