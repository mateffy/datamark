/**
 * Position tracking utilities for working with source locations.
 */

export interface Position {
  /** 1-based line number */
  line: number;
  /** 1-based column number */
  column: number;
  /** 0-based character offset */
  offset: number;
}

export interface SourceSpan {
  /** Start position (inclusive) */
  start: Position;
  /** End position (exclusive) */
  end: Position;
}

/**
 * Build a lookup table mapping line number to the 0-based offset of its
 * first character. Used to quickly convert offsets to line/column pairs.
 */
export function buildNewlineIndex(text: string): number[] {
  const indices: number[] = [0]; // line 1 starts at offset 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      indices.push(i + 1);
    }
  }
  return indices;
}

/**
 * Convert a 0-based offset to a Position.
 */
export function offsetToPosition(
  offset: number,
  newlineIndex: number[]
): Position {
  let lo = 0;
  let hi = newlineIndex.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (newlineIndex[mid]! <= offset) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  const line = Math.max(1, lo);
  const lineStart = newlineIndex[line - 1] ?? 0;
  const column = offset - lineStart + 1;
  return { line, column, offset };
}

/**
 * Compute a SourceSpan from a raw string slice within a parent document.
 */
export function computeSpan(
  raw: string,
  baseOffset: number,
  parentText: string,
  newlineIndex: number[]
): SourceSpan | undefined {
  const idx = parentText.indexOf(raw, baseOffset);
  if (idx === -1) return undefined;

  return {
    start: offsetToPosition(idx, newlineIndex),
    end: offsetToPosition(idx + raw.length, newlineIndex),
  };
}
