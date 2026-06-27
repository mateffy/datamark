import type {
  Node,
  ParentNode,
  SectionNode,
  BlockNode,
  InlineNode,
  HeadingNode,
  CodeNode,
  ListNode,
  ListItemNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  BlockquoteNode,
} from "./tree";
import { isParentNode, isSection, isBlockNode, isInlineNode } from "./tree";

// ============================================================================
// Node type guards
// ============================================================================

export function isHeading(node: Node, depth?: number): node is HeadingNode {
  if (node.type !== "heading") return false;
  if (depth !== undefined) return (node as HeadingNode).depth === depth;
  return true;
}

export function isCodeBlock(node: Node, lang?: string): node is CodeNode {
  if (node.type !== "code") return false;
  if (lang !== undefined) return (node as CodeNode).lang === lang;
  return true;
}

export interface TodoItem {
  text: string;
  completed: boolean;
  raw: string;
}

export function isTodoItem(node: Node): boolean {
  if (node.type !== "list") return false;
  const list = node as ListNode;
  return list.children.every((item) => {
    const first = item.children[0];
    if (!first || first.type !== "paragraph") return false;
    const text = inlineText((first as any).children);
    return /^\[[ xX]\]\s/.test(text);
  });
}

export function extractTodoItems(node: Node | BlockNode[]): TodoItem[] {
  const items: TodoItem[] = [];

  function walk(n: Node) {
    if (n.type === "list") {
      for (const item of (n as ListNode).children) {
        const first = item.children[0];
        if (first && first.type === "paragraph") {
          const text = inlineText((first as any).children);
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
    if (isParentNode(n)) {
      for (const child of n.children) {
        walk(child);
      }
    }
    if (isSection(n) && n.heading) {
      walk(n.heading);
    }
  }

  if (Array.isArray(node)) {
    for (const n of node) walk(n);
  } else {
    walk(node);
  }
  return items;
}

// ============================================================================
// Predicates
// ============================================================================

export type NodePredicate = (node: Node) => boolean;

// ============================================================================
// Find
// ============================================================================

/**
 * Find the first node matching a predicate anywhere in the tree.
 */
export function find(node: Node, predicate: NodePredicate): Node | undefined;
export function find(nodes: Node[], predicate: NodePredicate): Node | undefined;
export function find(
  nodeOrNodes: Node | Node[],
  predicate: NodePredicate
): Node | undefined {
  const nodes = Array.isArray(nodeOrNodes) ? nodeOrNodes : [nodeOrNodes];
  for (const node of nodes) {
    if (predicate(node)) return node;
    if (isSection(node) && node.heading) {
      const found = find(node.heading, predicate);
      if (found) return found;
    }
    if (isParentNode(node)) {
      for (const child of node.children) {
        const found = find(child, predicate);
        if (found) return found;
      }
    }
  }
  return undefined;
}

/**
 * Find all nodes matching a predicate (depth-first).
 */
export function findAll(node: Node, predicate: NodePredicate): Node[];
export function findAll(nodes: Node[], predicate: NodePredicate): Node[];
export function findAll(
  nodeOrNodes: Node | Node[],
  predicate: NodePredicate
): Node[] {
  const nodes = Array.isArray(nodeOrNodes) ? nodeOrNodes : [nodeOrNodes];
  const results: Node[] = [];
  for (const node of nodes) {
    if (predicate(node)) results.push(node);
    if (isSection(node) && node.heading) {
      results.push(...findAll(node.heading, predicate));
    }
    if (isParentNode(node)) {
      for (const child of node.children) {
        results.push(...findAll(child, predicate));
      }
    }
  }
  return results;
}

/**
 * Filter top-level nodes by predicate (does not recurse into containers).
 */
export function filter(nodes: Node[], predicate: NodePredicate): Node[] {
  return nodes.filter(predicate);
}

// ============================================================================
// Sections
// ============================================================================

/**
 * Find all child sections at a given depth under a section node.
 */
export function sectionsAtDepth(
  section: SectionNode,
  depth: number
): SectionNode[] {
  return findAll(section, (n) => isSection(n) && n.heading?.depth === depth) as SectionNode[];
}

/**
 * Find all child sections whose heading text matches the given string.
 */
export function sectionsByHeading(
  section: SectionNode,
  text: string
): SectionNode[] {
  return findAll(
    section,
    (n) =>
      isSection(n) &&
      n.heading !== null &&
      inlineText(n.heading.children) === text
  ) as SectionNode[];
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
 * Extract all code blocks from a node or list of nodes (recursively).
 */
export function codeBlocks(node: Node, options?: { lang?: string }): CodeNode[];
export function codeBlocks(nodes: BlockNode[], options?: { lang?: string }): CodeNode[];
export function codeBlocks(
  nodeOrNodes: Node | BlockNode[],
  options?: { lang?: string }
): CodeNode[] {
  if (Array.isArray(nodeOrNodes)) {
    return findAll(nodeOrNodes, (n) => isCodeBlock(n, options?.lang)) as CodeNode[];
  }
  return findAll(nodeOrNodes, (n) => isCodeBlock(n, options?.lang)) as CodeNode[];
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
 * Extract plain text from any node (recursively, depth-first).
 */
export function textContent(node: Node): string;
export function textContent(nodes: BlockNode[]): string;
export function textContent(nodeOrNodes: Node | BlockNode[]): string {
  if (Array.isArray(nodeOrNodes)) {
    return nodeOrNodes
      .map((n) => textContent(n))
      .filter(Boolean)
      .join("\n");
  }

  const node = nodeOrNodes;

  if (isInlineNode(node)) {
    switch (node.type) {
      case "text":
      case "escape":
      case "codespan":
      case "html":
        return node.value;
      case "image":
        return node.alt;
      case "br":
        return "\n";
      default:
        return inlineText((node as ParentNode).children as InlineNode[]);
    }
  }

  if (isBlockNode(node)) {
    switch (node.type) {
      case "heading":
      case "paragraph":
        return inlineText(node.children);
      case "code":
        return node.value;
      case "blockquote":
        return textContent(node.children);
      case "list":
        return (node as ListNode).children
          .map((item) => textContent(item.children))
          .join("\n");
      case "table":
        return (node as TableNode).children
          .map((row) =>
            (row as TableRowNode).children
              .map((cell) => inlineText((cell as TableCellNode).children))
              .join(" ")
          )
          .join("\n");
      case "html":
        return node.value;
      case "hr":
      case "space":
        return "";
    }
  }

  if (isSection(node)) {
    const parts: string[] = [];
    if (node.heading) {
      parts.push(textContent(node.heading));
    }
    for (const child of node.children) {
      const t = textContent(child);
      if (t) parts.push(t);
    }
    return parts.join("\n");
  }

  return "";
}

// ============================================================================
// Flatten
// ============================================================================

/**
 * Recursively flatten a section tree back into a flat array of block nodes.
 */
export function flatten(section: SectionNode): BlockNode[] {
  const blocks: BlockNode[] = [];
  if (section.heading) {
    blocks.push(section.heading);
  }
  for (const child of section.children) {
    if (isSection(child)) {
      blocks.push(...flatten(child as SectionNode));
    } else if (isBlockNode(child)) {
      blocks.push(child as BlockNode);
    }
  }
  return blocks;
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
      return node.children
        .map((item, i) => {
          const prefix = node.ordered ? `${(node.start ?? 1) + i}. ` : "- ";
          const content = item.children
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
      const headerRow = node.children[0];
      const bodyRows = node.children.slice(1);
      const headerMd = headerRow
        ? `| ${headerRow.children.map((c) => inlineToMarkdown((c as TableCellNode).children)).join(" | ")} |`
        : "";
      const alignRow = `|${node.align.map((a) => {
        if (a === "left") return ":---";
        if (a === "center") return ":---:";
        if (a === "right") return "---:";
        return "---";
      }).join("|")}|`;
      const bodyMd = bodyRows.map(
        (row) =>
          `| ${row.children.map((c) => inlineToMarkdown((c as TableCellNode).children)).join(" | ")} |`
      );
      return [headerMd, alignRow, ...bodyMd].join("\n");
    }
    case "space":
      return "";
  }
}

/**
 * Convert block nodes or a single node back into a markdown string.
 *
 * For a SectionNode, it is first flattened. Joins nodes with double
 * newlines and trims surrounding whitespace.
 */
export function toMarkdown(node: Node): string;
export function toMarkdown(nodes: BlockNode[]): string;
export function toMarkdown(nodeOrNodes: Node | BlockNode[]): string {
  let nodes: BlockNode[];
  if (Array.isArray(nodeOrNodes)) {
    nodes = nodeOrNodes;
  } else if (isSection(nodeOrNodes)) {
    nodes = flatten(nodeOrNodes as SectionNode);
  } else if (isBlockNode(nodeOrNodes)) {
    nodes = [nodeOrNodes as BlockNode];
  } else {
    return "";
  }

  return nodes
    .map((n) => blockToMarkdown(n))
    .filter((s) => s !== "")
    .join("\n\n")
    .trim();
}
