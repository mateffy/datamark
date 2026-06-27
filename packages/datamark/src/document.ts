import {
  extractFrontmatter,
  splitFrontmatter,
} from "./frontmatter";
import { parseYaml, stringifyYaml } from "./yaml";
import { parseBody, type Document } from "./tree";
import { toMarkdown } from "./tree-utils";

/**
 * Parse a markdown string into a structured document with a typed tree.
 *
 * - Extracts and parses YAML frontmatter
 * - Returns a tree of block nodes (headings, paragraphs, code blocks, etc.)
 *
 * Use the Format SDK for schema validation, title extraction, and declarative
 * parsing. This function is a low-level building block.
 */
export function parse(content: string): Document {
  const extracted = extractFrontmatter(content);

  let frontmatter: Record<string, unknown> | null = null;
  let body = content;
  let bodyOffset = 0;

  if (extracted) {
    frontmatter = parseYaml(extracted.frontmatter) as Record<string, unknown>;
    body = extracted.body;
    bodyOffset = content.indexOf(body);
  } else {
    const split = splitFrontmatter(content);
    if (split.frontmatter) {
      frontmatter = parseYaml(split.frontmatter) as Record<string, unknown>;
      body = split.body;
      bodyOffset = content.indexOf(body);
    }
  }

  const children = parseBody(body, content, bodyOffset);

  return {
    type: "document",
    frontmatter,
    children,
  };
}

/**
 * Serialize a document back into a markdown string.
 *
 * Frontmatter is emitted when present. Children are serialized as markdown.
 */
export function stringify(doc: Document): string {
  const lines: string[] = [];

  if (doc.frontmatter && Object.keys(doc.frontmatter).length > 0) {
    lines.push("---");
    lines.push(stringifyYaml(doc.frontmatter));
    lines.push("---");
    lines.push("");
  }

  const body = toMarkdown(doc.children);
  if (body) {
    lines.push(body);
  }

  return lines.join("\n").trim() + "\n";
}
