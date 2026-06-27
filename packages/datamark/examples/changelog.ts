import { datamark } from "../src/index";
import { inlineText, textContent } from "../src/parse";
import { heading, list } from "../src/stringify";
import * as z from "zod";

export const ChangelogSchema = z.object({
  versions: z.array(
    z.object({
      version: z.string(),
      date: z.string().optional(),
      changes: z.array(z.string()),
    })
  ),
});

export const ChangelogFormat = datamark({
  schema: ChangelogSchema,

  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const versionSections = h1
      ? (h1.children.filter((n: any) => n.type === "section") as any[])
      : [];

    const versions = versionSections.map((section: any) => {
      const headingText = inlineText(section.heading.children);
      const match = headingText.match(/^(\S+)\s*(?:[—-]\s*(.+))?$/);
      const version = match?.[1] ?? headingText;
      const date = match?.[2];

      const changes: string[] = [];
      for (const child of section.children) {
        if (child.type === "list") {
          for (const item of child.children) {
            changes.push(inlineText(item.children[0]?.children ?? []).trim());
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

export const changelogMarkdown = `# Changelog

## 1.2.0 — 2026-06-15

- Added dark mode support
- Fixed memory leak in parser
- Improved error messages

## 1.1.0 — 2026-05-01

- New table parsing
- Better frontmatter handling`;
