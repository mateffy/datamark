import * as yaml from "yaml";

/**
 * Error thrown when YAML parsing fails.
 */
export class YamlParseError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "YamlParseError";
  }
}

function convertUndefinedToNull(value: unknown): unknown {
  if (value === undefined) return null;
  if (Array.isArray(value)) {
    return value.map(convertUndefinedToNull);
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = convertUndefinedToNull(v);
    }
    return result;
  }
  return value;
}

/**
 * Parse a YAML string into a JavaScript value.
 * Uses the `yaml` library for spec-compliant parsing.
 * Empty input is normalized to an empty object for frontmatter convenience.
 */
export function parseYaml(content: string): unknown {
  const trimmed = content.trim();
  if (trimmed === "" || trimmed === "---") {
    return {};
  }

  try {
    return yaml.parse(trimmed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new YamlParseError(`Failed to parse YAML: ${msg}`, err);
  }
}

/**
 * Stringify a JavaScript value to a YAML string.
 * Uses the `yaml` library for spec-compliant serialization.
 * `undefined` values are converted to `null` before serialization.
 */
export function stringifyYaml(value: unknown): string {
  const cleaned = convertUndefinedToNull(value);
  return yaml.stringify(cleaned).trimEnd();
}
