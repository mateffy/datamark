/**
 * Tree utility functions for working with datamark AST nodes.
 */

import type { BlockNode, InlineNode, HeadingNode, CodeNode } from "./tree";

// ============================================================================
// Node type guards
// ============================================================================

export function isHeading(node: BlockNode, depth?: number): node is HeadingNode {
  if (node.type !== "heading") return false;
  if (depth !== undefined) return node.depth === depth;
  return true;
}

export function isCodeBlock(node: BlockNode, lang?: string): node is CodeNode {
  if (node.type !== "code") return false;
  if (lang !== undefined) return node.lang === lang;
  return true;
}

export interface TodoItem {
  text: string;
  completed: boolean;
  raw: string;
}

export function isTodoItem(node: BlockNode): boolean {
  if (node.type !== "list") return false;
  return node.items.every((item) => {
    const first = item[0];
    if (!first || first.type !== "paragraph") return false;
    const text = inlineText(first.children);
    return /^\[[ xX]\]\s/.test(text);
  });
}

export function extractTodoItems(nodes: BlockNode[]): TodoItem[] {
  const items: TodoItem[] = [];

  function walk(ns: BlockNode[]) {
    for (const n of ns) {
      if (n.type === "list") {
        for (const item of n.items) {
          const first = item[0];
          if (first && first.type === "paragraph") {
            const text = inlineText(first.children);
            const match = text.match(/^\[([ xX])\]\s?(.*)$/);
            if (match) {
              items.push({
                text: match[2]!,
                completed: match[1]!.toLowerCase() === "x",
                raw: text,
              });
            }
          }
        }
      }
      if (n.type === "blockquote") walk(n.children);
    }
  }

  walk(nodes);
  return items;
}

// ============================================================================
// Predicates
// ============================================================================

export type NodePredicate = (node: BlockNode) => boolean;

// ============================================================================
// Find
// ============================================================================

/**
 * Find the first block node matching a predicate.
 */
export function find(
  nodes: BlockNode[],
  predicate: NodePredicate
): BlockNode | undefined {
  for (const node of nodes) {
    if (predicate(node)) return node;
    // Search inside blockquote and list items
    if (node.type === "blockquote") {
      const found = find(node.children, predicate);
      if (found) return found;
    }
    if (node.type === "list") {
      for (const item of node.items) {
        const found = find(item, predicate);
        if (found) return found;
      }
    }
  }
  return undefined;
}

/**
 * Find all block nodes matching a predicate (depth-first).
 */
export function findAll(
  nodes: BlockNode[],
  predicate: NodePredicate
): BlockNode[] {
  const results: BlockNode[] = [];
  for (const node of nodes) {
    if (predicate(node)) results.push(node);
    if (node.type === "blockquote") {
      results.push(...findAll(node.children, predicate));
    }
    if (node.type === "list") {
      for (const item of node.items) {
        results.push(...findAll(item, predicate));
      }
    }
  }
  return results;
}

/**
 * Filter top-level nodes by predicate (does not recurse into containers).
 */
export function filter(
  nodes: BlockNode[],
  predicate: NodePredicate
): BlockNode[] {
  return nodes.filter(predicate);
}

// ============================================================================
// Sections — split by headings
// ============================================================================

export interface Section {
  heading: HeadingNode | null;
  children: BlockNode[];
}

/**
 * Split block nodes into sections separated by headings at a given depth.
 * Each section contains the heading and all nodes until the next heading
 * at the same or lower depth.
 */
export function sections(
  nodes: BlockNode[],
  options: { by: "heading"; level: number }
): Section[] {
  const result: Section[] = [];
  let current: Section | null = null;

  for (const node of nodes) {
    if (node.type === "heading" && node.depth === options.level) {
      if (current) result.push(current);
      current = { heading: node, children: [] };
    } else {
      if (!current) {
        current = { heading: null, children: [] };
      }
      current.children.push(node);
    }
  }

  if (current) result.push(current);
  return result;
}

// ============================================================================
// Split by separator
// ============================================================================

/**
 * Split a flat array of block nodes by nodes matching a predicate.
 * Separator nodes are discarded.
 */
export function splitBy(
  nodes: BlockNode[],
  predicate: NodePredicate
): BlockNode[][] {
  const result: BlockNode[][] = [];
  let current: BlockNode[] = [];

  for (const node of nodes) {
    if (predicate(node)) {
      if (current.length > 0) {
        result.push(current);
        current = [];
      }
    } else {
      current.push(node);
    }
  }

  if (current.length > 0) {
    result.push(current);
  }

  return result;
}

// ============================================================================
// Between / After / Before
// ============================================================================

/**
 * Return nodes between the first node matching `start` (exclusive)
 * and the first node after that matching `end` (exclusive).
 * If `end` is not found, returns everything after `start`.
 */
export function between(
  nodes: BlockNode[],
  start: NodePredicate,
  end: NodePredicate
): BlockNode[] {
  const startIdx = nodes.findIndex(start);
  if (startIdx === -1) return [];

  const remaining = nodes.slice(startIdx + 1);
  const endIdx = remaining.findIndex(end);
  if (endIdx === -1) return remaining;

  return remaining.slice(0, endIdx);
}

/**
 * Return all nodes after the first node matching a predicate (exclusive).
 */
export function after(
  nodes: BlockNode[],
  predicate: NodePredicate
): BlockNode[] {
  const idx = nodes.findIndex(predicate);
  if (idx === -1) return [];
  return nodes.slice(idx + 1);
}

/**
 * Return all nodes before the first node matching a predicate (exclusive).
 */
export function before(
  nodes: BlockNode[],
  predicate: NodePredicate
): BlockNode[] {
  const idx = nodes.findIndex(predicate);
  if (idx === -1) return [...nodes];
  return nodes.slice(0, idx);
}

// ============================================================================
// Extractors
// ============================================================================

/**
 * Extract all code blocks from a list of nodes (recursively).
 */
export function codeBlocks(nodes: BlockNode[]): CodeNode[] {
  return findAll(nodes, (n) => n.type === "code") as CodeNode[];
}

/**
 * Extract plain text from inline nodes.
 */
export function inlineText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case "text":
        case "escape":
        case "codespan":
        case "html":
          return n.value;
        case "strong":
        case "em":
        case "del":
          return inlineText(n.children);
        case "link":
          return inlineText(n.children);
        case "image":
          return n.alt;
        case "br":
          return "\n";
        default:
          return "";
      }
    })
    .join("");
}

/**
 * Extract plain text from block nodes (recursively, depth-first).
 */
export function textContent(nodes: BlockNode[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case "heading":
        case "paragraph":
          return inlineText(n.children);
        case "code":
          return n.value;
        case "blockquote":
          return textContent(n.children);
        case "list":
          return n.items
            .map((item) => textContent(item))
            .join("\n");
        case "table":
          return n.rows
            .map((row) =>
              row.map((cell) => inlineText(cell.children)).join(" ")
            )
            .join("\n");
        case "html":
          return n.value;
        case "hr":
        case "space":
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

// ============================================================================
// Serialization
// ============================================================================

function inlineToMarkdown(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case "text":
          return n.value;
        case "escape":
          return `\\${n.value}`;
        case "strong":
          return `**${inlineToMarkdown(n.children)}**`;
        case "em":
          return `*${inlineToMarkdown(n.children)}*`;
        case "codespan":
          return "`" + n.value + "`";
        case "link":
          return `[${inlineToMarkdown(n.children)}](${n.href}${n.title ? ` "${n.title}"` : ""})`;
        case "image":
          return `![${n.alt}](${n.src}${n.title ? ` "${n.title}"` : ""})`;
        case "br":
          return "\n";
        case "del":
          return `~~${inlineToMarkdown(n.children)}~~`;
        case "html":
          return n.value;
        default:
          return "";
      }
    })
    .join("");
}

function blockToMarkdown(node: BlockNode): string {
  switch (node.type) {
    case "heading": {
      const prefix = "#".repeat(node.depth) + " ";
      return prefix + inlineToMarkdown(node.children);
    }
    case "paragraph":
      return inlineToMarkdown(node.children);
    case "code": {
      const tag = "```" + (node.lang ?? "") + (node.meta ? ` ${node.meta}` : "");
      return `${tag}\n${node.value}\n\`\`\``;
    }
    case "blockquote":
      return node.children
        .map((child) => {
          const md = blockToMarkdown(child);
          return md
            .split("\n")
            .map((line) => "> " + line)
            .join("\n");
        })
        .join("\n\n");
    case "hr":
      return "---";
    case "list": {
      return node.items
        .map((item, i) => {
          const prefix = node.ordered ? `${(node.start ?? 1) + i}. ` : "- ";
          const content = item
            .map((child) => blockToMarkdown(child))
            .join("\n");
          return (
            prefix +
            content
              .split("\n")
              .map((line, idx) => (idx === 0 ? line : `  ${line}`))
              .join("\n")
          );
        })
        .join("\n");
    }
    case "html":
      return node.value;
    case "table": {
      const headerRow = `| ${node.header.map((c) => inlineToMarkdown(c.children)).join(" | ")} |`;
      const alignRow = `|${node.align.map((a) => {
        if (a === "left") return ":---";
        if (a === "center") return ":---:";
        if (a === "right") return "---:";
        return "---";
      }).join("|")}|`;
      const bodyRows = node.rows.map(
        (row) =>
          `| ${row.map((c) => inlineToMarkdown(c.children)).join(" | ")} |`
      );
      return [headerRow, alignRow, ...bodyRows].join("\n");
    }
    case "space":
      return "";
  }
}

/**
 * Convert block nodes back into a markdown string.
 * Joins nodes with double newlines and trims surrounding whitespace.
 */
export function toMarkdown(nodes: BlockNode[]): string {
  return nodes
    .map((n) => blockToMarkdown(n))
    .filter((s) => s !== "")
    .join("\n\n")
    .trim();
}
