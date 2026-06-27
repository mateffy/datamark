import { stringifyYaml } from "./yaml";

export { stringifyYaml } from "./yaml";
export { toMarkdown } from "./tree-utils";

// ============================================================================
// Block builders
// ============================================================================

/**
 * Build a YAML frontmatter fence from a data object.
 *
 * ```typescript
 * import { frontmatter } from "datamark/stringify";
 *
 * frontmatter({ title: "Hello", tags: ["a", "b"] })
 * // "---\ntitle: Hello\ntags:\n  - a\n  - b\n---\n"
 * ```
 */
export function frontmatter(data: Record<string, unknown>): string {
  return `---\n${stringifyYaml(data)}\n---\n`;
}

/**
 * Build a Markdown heading.
 *
 * ```typescript
 * heading("Title", 2) // "## Title"
 * ```
 */
export function heading(text: string, depth: number = 1): string {
  if (depth < 1) depth = 1;
  if (depth > 6) depth = 6;
  return `${"#".repeat(depth)} ${text}`;
}

/**
 * Build a paragraph. Returns the text as-is (no wrapping needed).
 */
export function paragraph(text: string): string {
  return text;
}

/**
 * Build a fenced code block.
 *
 * ```typescript
 * codeBlock("const x = 1;", "typescript")
 * // "```typescript\nconst x = 1;\n```"
 * ```
 */
export function codeBlock(code: string, lang?: string): string {
  const fence = "```" + (lang ?? "");
  return `${fence}\n${code}\n\`\`\``;
}

/**
 * Build a list from an array of item strings.
 *
 * ```typescript
 * list(["First", "Second"])        // "- First\n- Second"
 * list(["A", "B"], true)           // "1. A\n2. B"
 * ```
 */
export function list(
  items: string[],
  ordered: boolean = false,
  start?: number
): string {
  if (ordered) {
    let n = start ?? 1;
    return items
      .map((item) => `${n++}. ${indentLines(item, "   ")}`)
      .join("\n");
  }
  return items.map((item) => `- ${indentLines(item, "  ")}`).join("\n");
}

/**
 * Build a blockquote from a text string.
 */
export function blockquote(text: string): string {
  return text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

/**
 * Build a horizontal rule.
 */
export function horizontalRule(): string {
  return "---";
}

// ============================================================================
// Inline builders
// ============================================================================

/**
 * Wrap text in bold.
 */
export function strong(text: string): string {
  return `**${text}**`;
}

/**
 * Wrap text in italics.
 */
export function em(text: string): string {
  return `*${text}*`;
}

/**
 * Wrap text in inline code.
 */
export function codeSpan(text: string): string {
  return "`" + text + "`";
}

/**
 * Build a Markdown link.
 */
export function link(text: string, href: string, title?: string): string {
  const titlePart = title ? ` "${title}"` : "";
  return `[${text}](${href}${titlePart})`;
}

/**
 * Build a Markdown image.
 */
export function image(alt: string, src: string, title?: string): string {
  const titlePart = title ? ` "${title}"` : "";
  return `![${alt}](${src}${titlePart})`;
}

/**
 * Build strikethrough text.
 */
export function strikethrough(text: string): string {
  return `~~${text}~~`;
}

// ============================================================================
// Utilities
// ============================================================================

function indentLines(text: string, indent: string): string {
  const lines = text.split("\n");
  return lines
    .map((line, i) => (i === 0 ? line : indent + line))
    .join("\n");
}
