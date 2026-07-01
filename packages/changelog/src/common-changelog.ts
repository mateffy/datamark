// ============================================================================
// Common Changelog format
//
// Based on https://common-changelog.org/
//
// A stricter subset of Keep a Changelog with summary paragraphs,
// footnote reference links, and standardized structure.
// ============================================================================

import { z } from "zod";
import { datamark } from "datamark";
import { sectionsAtDepth, inlineText } from "datamark/parse";
import { heading, paragraph } from "datamark/stringify";
import type { Changelog, Release } from "./types";
import {
  extractVersionInfo,
  classifyCategory,
  parseChangeItems,
  buildChangesMarkdown,
  buildVersionHeading,
  buildCategoryHeading,
  emptyCategories,
  extractFootnoteReferences,
  findH1Section,
  extractPreamble,
  extractVersionSummary,
  headingRawText,
} from "./utils";

// ============================================================================
// Schemas
// ============================================================================

const ChangeSchema = z.object({
  summary: z.string(),
  markdown: z.string(),
  references: z.array(z.string()),
  commits: z.array(z.string()),
  links: z.array(
    z.object({
      text: z.string(),
      href: z.string(),
      title: z.string().optional(),
    })
  ),
  images: z.array(
    z.object({
      alt: z.string(),
      src: z.string(),
      title: z.string().optional(),
    })
  ),
});

const ReleaseSchema = z.object({
  version: z.string(),
  date: z.string().nullable(),
  yanked: z.boolean(),
  url: z.string().nullable(),
  categories: z.record(z.array(ChangeSchema)),
  summary: z.string().nullable(),
});

const ChangelogSchema = z.object({
  title: z.string(),
  preamble: z.string().nullable(),
  releases: z.array(ReleaseSchema),
  references: z.record(z.string()),
});

// ============================================================================
// Parse
// ============================================================================

function parseCommonChangelog(doc: any): Changelog {
  const root = doc.root;
  const h1Section = findH1Section(root);
  const title = h1Section?.heading
    ? inlineText(h1Section.heading.children)
    : "Changelog";

  const preamble = h1Section ? extractPreamble(h1Section) : null;

  const releases: Release[] = [];
  const versionSections = sectionsAtDepth(root, 2);

  for (const section of versionSections) {
    const headingText = section.heading
      ? headingRawText(section.heading)
      : "";
    const info = extractVersionInfo(headingText);

    if (!info) continue;

    const summary = extractVersionSummary(section);

    const categories = emptyCategories();
    const categorySections = sectionsAtDepth(section, 3);

    for (const catSection of categorySections) {
      const catHeading = catSection.heading
        ? headingRawText(catSection.heading)
        : "";
      const category = classifyCategory(catHeading);

      for (const child of catSection.children) {
        if (child.type === "list") {
          const changes = parseChangeItems(child as any);
          categories[category].push(...changes);
        }
      }
    }

    for (const child of section.children) {
      if (child.type === "list") {
        const changes = parseChangeItems(child as any);
        categories.other.push(...changes);
      }
    }

    releases.push({
      version: info.version,
      date: info.date,
      yanked: info.yanked,
      url: info.url,
      categories,
      summary,
    });
  }

  return {
    title,
    preamble,
    releases,
    references: {},
  };
}

// ============================================================================
// Stringify
// ============================================================================

function stringifyCommonChangelog(data: Changelog): string {
  const lines: string[] = [];

  lines.push(heading(data.title, 1));
  lines.push("");

  if (data.preamble) {
    lines.push(paragraph(data.preamble));
    lines.push("");
  }

  for (const release of data.releases) {
    lines.push(
      buildVersionHeading(release.version, release.date, release.yanked, release.url, "keep")
    );
    lines.push("");

    if (release.summary) {
      lines.push(paragraph(release.summary));
      lines.push("");
    }

    for (const [category, changes] of Object.entries(release.categories)) {
      if (changes.length === 0) continue;
      lines.push(buildCategoryHeading(category as any));
      lines.push("");
      lines.push(buildChangesMarkdown(changes));
      lines.push("");
    }
  }

  if (Object.keys(data.references).length > 0) {
    for (const [label, url] of Object.entries(data.references)) {
      lines.push(`[${label}]: ${url}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

// ============================================================================
// Base format
// ============================================================================

const baseFormat = datamark({
  description:
    "Common Changelog format — a stricter subset of Keep a Changelog. " +
    "Emphasizes per-release summaries, reference links, and clean structure.",

  schema: ChangelogSchema,

  parse: parseCommonChangelog,

  stringify: stringifyCommonChangelog,

  examples: [
    {
      text: `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.1.0] - 2024-06-12

This release adds user profiles and improves the dashboard.

### Added

- User profiles with avatars.
- Bulk export to CSV.

### Fixed

- Resolved memory leak in batch processor (#142).

[unreleased]: https://github.com/org/repo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/org/repo/compare/v1.0.0...v1.1.0
`,
      data: {
        title: "Changelog",
        preamble: "All notable changes to this project will be documented in this file.",
        releases: [
          {
            version: "Unreleased",
            date: null,
            yanked: false,
            url: null,
            summary: null,
            categories: {
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
            },
          },
          {
            version: "1.1.0",
            date: "2024-06-12",
            yanked: false,
            url: null,
            summary: "This release adds user profiles and improves the dashboard.",
            categories: {
              added: [
                {
                  summary: "User profiles with avatars.",
                  markdown: "User profiles with avatars.",
                  references: [],
                  commits: [],
                  links: [],
                  images: [],
                },
                {
                  summary: "Bulk export to CSV.",
                  markdown: "Bulk export to CSV.",
                  references: [],
                  commits: [],
                  links: [],
                  images: [],
                },
              ],
              changed: [],
              deprecated: [],
              removed: [],
              fixed: [
                {
                  summary: "Resolved memory leak in batch processor (#142).",
                  markdown: "Resolved memory leak in batch processor (#142).",
                  references: ["#142"],
                  commits: [],
                  links: [],
                  images: [],
                },
              ],
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
            },
          },
        ],
        references: {},
      },
    },
  ],
});

// ============================================================================
// Exported format with reference-link extraction
// ============================================================================

export const commonChangelog: typeof baseFormat = {
  ...baseFormat,
  parse(content: string) {
    const result = baseFormat.parse(content) as Changelog;
    const references = extractFootnoteReferences(content);
    return { ...result, references };
  },
};
