// ============================================================================
// Shared changelog parsing & serialization utilities
// ============================================================================

import type {
  InlineNode,
  ListNode,
  ListItemNode,
  ParagraphNode,
} from "datamark/parse";
import {
  inlineText,
  textContent,
  findAll,
  sectionsAtDepth,
} from "datamark/parse";
import type { InlineNode } from "datamark/parse";
import { toMarkdown } from "datamark/stringify";
import type { Change, ChangeCategory } from "./types";

// ============================================================================
// Version heading extraction
// ============================================================================

const KEEP_A_CHANGELOG_RE =
  /^\[(?<version>Unreleased|[^\]]+)\]\s*(?:-\s*(?<date>\d{4}-\d{2}-\d{2}))?\s*(?<yanked>\[YANKED\])?\s*$/i;

const CONVENTIONAL_RE =
  /^\[?(?<version>[^\]\s()]+)\]?\s*(?:\((?<date>\d{4}-\d{2}-\d{2})\))?\s*$/;

const CONVENTIONAL_WITH_URL_RE =
  /^\[?(?<version>[^\]\s()]+)\]?\s*\((?<url>[^)]+)\)\s*(?:\((?<date>\d{4}-\d{2}-\d{2})\))?\s*$/;

const GITHUB_RELEASES_RE =
  /^v?(?<version>[\d.]+[^\s()]*)\s*(?:\((?<date>[^)]+)\))?\s*$/;

export interface VersionInfo {
  version: string;
  date: string | null;
  yanked: boolean;
  url: string | null;
}

export function headingRawText(heading: any): string {
  return heading.children.map((c: any) => c.raw ?? c.value ?? "").join("");
}

/**
 * Extract a plain-text summary from inline nodes, omitting image alt text
 * (images are visual, their alt text should not pollute the text summary).
 */
export function inlineSummary(nodes: InlineNode[]): string {
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
          return inlineSummary(n.children);
        case "link":
          return inlineSummary(n.children);
        case "image":
          return "";
        case "br":
          return "\n";
        default:
          return "";
      }
    })
    .join("")
    .replace(/\n+/g, " ")
    .trim();
}

export function extractVersionInfo(headingText: string): VersionInfo | null {
  // Try Keep a Changelog: ## [1.2.3] - 2024-01-01 [YANKED]
  let m = KEEP_A_CHANGELOG_RE.exec(headingText);
  if (m) {
    return {
      version: m.groups!.version!,
      date: m.groups!.date ?? null,
      yanked: !!m.groups!.yanked,
      url: null,
    };
  }

  // Try GitHub Releases FIRST to catch v-prefixed versions before
  // the more general conventional regex consumes them.
  // ## v1.2.3 (2024-01-01)
  m = GITHUB_RELEASES_RE.exec(headingText);
  if (m) {
    return {
      version: m.groups!.version!,
      date: m.groups!.date ?? null,
      yanked: false,
      url: null,
    };
  }

  // Try Conventional without URL: ## [1.2.3] (2024-01-01) or ## 1.2.3 (2024-01-01)
  m = CONVENTIONAL_RE.exec(headingText);
  if (m) {
    return {
      version: m.groups!.version!,
      date: m.groups!.date ?? null,
      yanked: false,
      url: null,
    };
  }

  // Try Conventional with URL: ## [1.2.3](https://...) (2024-01-01)
  m = CONVENTIONAL_WITH_URL_RE.exec(headingText);
  if (m) {
    return {
      version: m.groups!.version!,
      date: m.groups!.date ?? null,
      yanked: false,
      url: m.groups!.url ?? null,
    };
  }

  return null;
}

// ============================================================================
// Category classification
// ============================================================================

const CATEGORY_MAP: Record<string, ChangeCategory> = {
  added: "added",
  changed: "changed",
  deprecated: "deprecated",
  removed: "removed",
  fixed: "fixed",
  security: "security",
  "bug fixes": "bug fixes",
  "bug fix": "bug fixes",
  features: "features",
  feature: "features",
  "performance improvements": "performance improvements",
  performance: "performance improvements",
  "code refactoring": "code refactoring",
  refactoring: "code refactoring",
  reverts: "reverts",
  revert: "reverts",
  documentation: "documentation",
  docs: "documentation",
  tests: "tests",
  test: "tests",
  build: "build",
  ci: "ci",
  chore: "chore",
  style: "style",
};

export function classifyCategory(text: string): ChangeCategory {
  const key = text.toLowerCase().trim();
  return CATEGORY_MAP[key] ?? "other";
}

// ============================================================================
// Inline node analysis
// ============================================================================

function extractLinks(nodes: InlineNode[]): Change["links"] {
  const links: Change["links"] = [];
  for (const n of findAll(nodes, (x: any) => x.type === "link") as Extract<
    InlineNode,
    { type: "link" }
  >[]) {
    const link: Change["links"][number] = {
      text: inlineText(n.children),
      href: n.href,
    };
    if (n.title != null) link.title = n.title;
    links.push(link);
  }
  return links;
}

function extractImages(nodes: InlineNode[]): Change["images"] {
  const images: Change["images"] = [];
  for (const n of findAll(nodes, (x: any) => x.type === "image") as Extract<
    InlineNode,
    { type: "image" }
  >[]) {
    const img: Change["images"][number] = { alt: n.alt, src: n.src };
    if (n.title != null) img.title = n.title;
    images.push(img);
  }
  return images;
}

function extractReferences(text: string): string[] {
  const refs: string[] = [];
  const re = /#(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    refs.push(`#${m[1]}`);
  }
  return [...new Set(refs)];
}

function extractCommits(text: string): string[] {
  const commits: string[] = [];
  const re1 = /\(([a-f0-9]{7,40})\)/gi;
  const re2 = /`([a-f0-9]{7,40})`/gi;
  let m: RegExpExecArray | null;
  while ((m = re1.exec(text)) !== null) {
    commits.push(m[1]!.toLowerCase());
  }
  while ((m = re2.exec(text)) !== null) {
    commits.push(m[2]!.toLowerCase());
  }
  return [...new Set(commits)];
}

// ============================================================================
// List item → Change
// ============================================================================

export function parseChangeItems(list: ListNode): Change[] {
  return list.children.map((item) => parseChangeItem(item));
}

export function parseChangeItem(item: ListItemNode): Change {
  // Build markdown by serializing all block children of the list item
  const markdown = item.children
    .map((child) => toMarkdown(child as any))
    .filter((s) => s !== "")
    .join("\n\n");

  // Find the first paragraph for summary extraction
  let firstPara: ParagraphNode | null = null;
  for (const child of item.children) {
    if (child.type === "paragraph") {
      firstPara = child as ParagraphNode;
      break;
    }
  }

  const summary = firstPara
    ? inlineSummary(firstPara.children)
    : textContent(item.children).trim();

  // Gather all inline nodes across all children for link/image extraction
  const allInlineNodes: InlineNode[] = [];
  for (const child of item.children) {
    if ("children" in child && Array.isArray((child as any).children)) {
      if (child.type === "paragraph" || child.type === "heading") {
        allInlineNodes.push(...(child as any).children);
      } else if (child.type === "blockquote") {
        // Recursively collect inline nodes from blockquote children
        for (const bchild of (child as any).children) {
          if (
            "children" in bchild &&
            Array.isArray((bchild as any).children)
          ) {
            allInlineNodes.push(...(bchild as any).children);
          }
        }
      }
    }
  }

  return {
    summary,
    markdown,
    references: extractReferences(summary),
    commits: extractCommits(summary),
    links: extractLinks(allInlineNodes),
    images: extractImages(allInlineNodes),
  };
}

// ============================================================================
// Markdown builders
// ============================================================================

import {
  heading as mdHeading,
  list as mdList,
  link as mdLink,
  image as mdImage,
} from "datamark/stringify";

export { mdHeading, mdList, mdLink, mdImage };

export function buildChangesMarkdown(changes: Change[]): string {
  if (changes.length === 0) return "";
  return mdList(changes.map((c) => c.markdown));
}

export function buildVersionHeading(
  version: string,
  date: string | null,
  yanked: boolean,
  url: string | null,
  style: "keep" | "conventional" | "github"
): string {
  if (style === "keep") {
    const parts = [`[${version}]`];
    if (date) parts.push(`- ${date}`);
    if (yanked) parts.push("[YANKED]");
    return mdHeading(parts.join(" "), 2);
  }

  if (style === "conventional") {
    const versionPart = url ? mdLink(version, url) : version;
    const parts = [`[${versionPart}]`];
    if (date) parts.push(`(${date})`);
    return mdHeading(parts.join(" "), 2);
  }

  // github
  const parts = [`v${version}`];
  if (date) parts.push(`(${date})`);
  return mdHeading(parts.join(" "), 2);
}

export function buildCategoryHeading(category: ChangeCategory): string {
  const title =
    {
      "bug fixes": "Bug Fixes",
      "performance improvements": "Performance Improvements",
      "code refactoring": "Code Refactoring",
    }[category] ??
    category.charAt(0).toUpperCase() + category.slice(1);
  return mdHeading(title, 3);
}

export function emptyCategories(): Record<ChangeCategory, Change[]> {
  return {
    added: [],
    changed: [],
    deprecated: [],
    removed: [],
    fixed: [],
    security: [],
    "bug fixes": [],
    features: [],
    "performance improvements": [],
    "code refactoring": [],
    reverts: [],
    documentation: [],
    tests: [],
    build: [],
    ci: [],
    chore: [],
    style: [],
    other: [],
  };
}

// ============================================================================
// Reference link extraction from raw markdown
// ============================================================================

export function extractFootnoteReferences(content: string): Record<string, string> {
  const references: Record<string, string> = {};
  const refRe = /^\[(?<label>[^\]]+)\]:\s+(?<url>.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = refRe.exec(content)) !== null) {
    references[m.groups!.label!] = m.groups!.url!.trim();
  }
  return references;
}

// ============================================================================
// Section tree helpers for changelog preamble / summary
// ============================================================================

export function findH1Section(root: any): any | null {
  const h1s = sectionsAtDepth(root, 1);
  return h1s[0] ?? null;
}

export function extractPreamble(h1Section: any): string | null {
  if (!h1Section) return null;
  const firstH2Idx = h1Section.children.findIndex(
    (n: any) => n.type === "section" && n.heading?.depth === 2
  );
  if (firstH2Idx <= 0) return null;
  const preambleBlocks = h1Section.children.slice(0, firstH2Idx);
  const text = textContent(preambleBlocks).trim();
  return text || null;
}

export function extractVersionSummary(versionSection: any): string | null {
  const firstH3Idx = versionSection.children.findIndex(
    (n: any) => n.type === "section" && n.heading?.depth === 3
  );
  if (firstH3Idx <= 0) {
    // No h3 categories: check for plain paragraphs before any h2 sub-sections
    const firstSubSectionIdx = versionSection.children.findIndex(
      (n: any) => n.type === "section"
    );
    const blocks =
      firstSubSectionIdx === -1
        ? versionSection.children
        : versionSection.children.slice(0, firstSubSectionIdx);
    const nonSpace = blocks.filter((n: any) => n.type !== "space");
    if (nonSpace.length === 0) return null;
    const text = textContent(nonSpace).trim();
    return text || null;
  }
  const summaryBlocks = versionSection.children.slice(0, firstH3Idx);
  const text = textContent(summaryBlocks).trim();
  return text || null;
}
