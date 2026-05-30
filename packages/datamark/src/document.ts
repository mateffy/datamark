import {
  extractFrontmatter,
  splitFrontmatter,
  FrontmatterError,
} from "./frontmatter";
import { parseYaml, stringifyYaml, YamlParseError } from "./yaml";
import { parseBody, type BlockNode, type Document } from "./tree";
import {
  validateFrontmatter,
  validateData,
  ValidationError,
  type StandardSchemaV1,
} from "./validation";
import { toMarkdown } from "./tree-utils";

export interface ParseOptions<TFrontmatter = Record<string, unknown>> {
  /**
   * Optional Standard Schema validator for frontmatter.
   * When provided, parsed frontmatter is validated and typed.
   */
  frontmatterSchema?: StandardSchemaV1<any, TFrontmatter>;
  /**
   * Name of the frontmatter property to use as the document title.
   * @default "title"
   */
  titleProperty?: string;
  /**
   * Whether to fall back to the first H1 heading if no title in frontmatter.
   * @default true
   */
  titleFromHeading?: boolean;
}

/**
 * Parse a markdown string into a structured document with a typed tree.
 *
 * - Extracts and parses YAML frontmatter
 * - Validates frontmatter with an optional Standard Schema
 * - Auto-detects title from frontmatter or first H1
 * - Returns a tree of block nodes (headings, paragraphs, code blocks, etc.)
 *
 * @example
 * ```ts
 * import { parse } from "datamark";
 * import * as z from "zod";
 *
 * const Schema = z.object({ id: z.string(), title: z.string() });
 * const doc = parse(content, { frontmatterSchema: Schema });
 * // doc.frontmatter is typed as { id: string; title: string } | null
 * // doc.title is string | null
 * // doc.children is BlockNode[]
 * ```
 */
export function parse<TFrontmatter = Record<string, unknown>>(
  content: string,
  options?: ParseOptions<TFrontmatter>
): Document {
  const titleProp = options?.titleProperty ?? "title";
  const useHeadingFallback = options?.titleFromHeading ?? true;

  const extracted = extractFrontmatter(content);

  let frontmatter: TFrontmatter | null = null;
  let body = content;
  let bodyOffset = 0;

  if (extracted) {
    const raw = parseYaml(extracted.frontmatter) as Record<string, unknown>;
    frontmatter = validateFrontmatter(raw, options?.frontmatterSchema);
    body = extracted.body;
    // frontmatter + ---\n + body → body starts after frontmatter block
    bodyOffset = content.indexOf(body);
  } else {
    const split = splitFrontmatter(content);
    if (split.frontmatter) {
      const raw = parseYaml(split.frontmatter) as Record<string, unknown>;
      frontmatter = validateFrontmatter(raw, options?.frontmatterSchema);
      body = split.body;
      bodyOffset = content.indexOf(body);
    }
  }

  const children = parseBody(body, content, bodyOffset);

  // Title detection: frontmatter[titleProperty] → first H1
  let title: string | null = null;
  const fm = frontmatter as Record<string, unknown> | null;
  if (fm && typeof fm[titleProp] === "string") {
    title = fm[titleProp] as string;
  } else if (useHeadingFallback) {
    const h1 = children.find(
      (n): n is import("./tree").HeadingNode =>
        n.type === "heading" && n.depth === 1
    );
    if (h1) {
      title = h1.children.map((c) => (c.type === "text" ? c.value : "")).join("");
    }
  }

  return {
    type: "document",
    frontmatter: fm,
    title,
    children,
  };
}

/**
 * Serialize a document back into a markdown string.
 *
 * Frontmatter is emitted when present. Children are serialized as markdown.
 * The title is NOT automatically injected — if you want an H1 title,
 * add it to `doc.children` before stringifying.
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

export {
  extractFrontmatter,
  splitFrontmatter,
  FrontmatterError,
  parseYaml,
  stringifyYaml,
  YamlParseError,
  validateFrontmatter,
  validateData,
  ValidationError,
  type StandardSchemaV1,
};
