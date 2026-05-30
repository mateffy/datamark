/**
 * Error thrown when frontmatter extraction or parsing fails.
 */
export class FrontmatterError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "FrontmatterError";
  }
}

/**
 * Extract YAML frontmatter from markdown content.
 * Supports `---` and `+++` style fences.
 * Returns null if no frontmatter is found.
 */
export function extractFrontmatter(content: string): {
  frontmatter: string;
  body: string;
} | null {
  const tripleDashMatch = content.match(
    /^---\s*\n([\s\S]*?)\n---\s*(?:\n([\s\S]*)|([\s\S]*))$/
  );
  if (tripleDashMatch) {
    return {
      frontmatter: tripleDashMatch[1]!,
      body: tripleDashMatch[2] ?? tripleDashMatch[3] ?? "",
    };
  }

  const triplePlusMatch = content.match(
    /^\+\+\+\s*\n([\s\S]*?)\n\+\+\+\s*(?:\n([\s\S]*)|([\s\S]*))$/
  );
  if (triplePlusMatch) {
    return {
      frontmatter: triplePlusMatch[1]!,
      body: triplePlusMatch[2] ?? triplePlusMatch[3] ?? "",
    };
  }

  return null;
}

/**
 * Split markdown content into frontmatter and body using line-by-line scanning.
 * More lenient than extractFrontmatter — handles missing closing fence.
 */
export function splitFrontmatter(content: string): {
  frontmatter: string;
  body: string;
} {
  const lines = content.split("\n");
  if (lines[0]?.trim() !== "---") {
    return { frontmatter: "", body: content };
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]!.trim() === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return { frontmatter: "", body: content };
  }

  const frontmatter = lines.slice(1, endIndex).join("\n");
  const body = lines
    .slice(endIndex + 1)
    .join("\n")
    .trim();

  return { frontmatter, body };
}
