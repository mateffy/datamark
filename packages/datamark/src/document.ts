import {
  extractFrontmatter,
  splitFrontmatter,
} from "./frontmatter";
import { parseYaml, stringifyYaml } from "./yaml";
import { parseBlocks, buildSectionTree, type Document } from "./tree";
import { flatten, toMarkdown } from "./tree-utils";

/**
 * Parse a markdown string into a structured document with a typed tree.
 *
 * - Extracts and parses YAML frontmatter
 * - Returns a Document with a section tree rooted at `doc.root`
 *
 * Use tree utilities like `find()`, `findAll()`, `textContent()`, and
 * `flatten()` for working with the AST. The Format SDK provides a higher-level
 * wrapper for schema validation and declarative parsing.
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

  const blocks = parseBlocks(body, content, bodyOffset);
  const root = buildSectionTree(blocks);

  return {
    type: "document",
    frontmatter,
    root,
  };
}

/**
 * Serialize a document back into a markdown string.
 *
 * Frontmatter is emitted when present. The section tree is flattened
 * back into a flat array of block nodes before serialization.
 */
export function stringify(doc: Document): string {
  const lines: string[] = [];

  if (doc.frontmatter && Object.keys(doc.frontmatter).length > 0) {
    lines.push("---");
    lines.push(stringifyYaml(doc.frontmatter));
    lines.push("---");
    lines.push("");
  }

  const blocks = flatten(doc.root);
  const body = toMarkdown(blocks);
  if (body) {
    lines.push(body);
  }

  return lines.join("\n").trim() + "\n";
}
