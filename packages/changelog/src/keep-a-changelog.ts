// ============================================================================
// Keep a Changelog format
//
// Based on https://keepachangelog.com/en/1.1.0/
//
//   import { keepAChangelog } from "@datamark/changelog";
//
//   const data = keepAChangelog.parse(markdown);
//   const md   = keepAChangelog.stringify(data);
// ============================================================================

import { z } from "zod";
import { datamark } from "datamark";
import { sectionsAtDepth, inlineText } from "datamark/parse";
import { heading, paragraph } from "datamark/stringify";
import type { Changelog, Release, Change } from "./types";
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

function parseKeepAChangelog(doc: any): Changelog {
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

    if (!info) continue; // skip non-version h2s

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

    // Also scan non-section children at depth-2 level for lists directly under the version
    // (some changelogs put lists directly under h2 without h3 categories)
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

function stringifyKeepAChangelog(data: Changelog): string {
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

  // Reference links
  if (Object.keys(data.references).length > 0) {
    for (const [label, url] of Object.entries(data.references)) {
      lines.push(`[${label}]: ${url}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

// ============================================================================
// Base format (without reference extraction)
// ============================================================================

const baseFormat = datamark({
  description:
    "Keep a Changelog format — the de-facto standard for open source changelogs. " +
    "Versions are ## [X.Y.Z] - YYYY-MM-DD. Categories: Added, Changed, Deprecated, " +
    "Removed, Fixed, Security.",

  schema: ChangelogSchema,

  parse: parseKeepAChangelog,

  stringify: stringifyKeepAChangelog,

  examples: [
    // Minimal example
    {
      text: `# Changelog

## [Unreleased]

## [1.0.0] - 2024-01-15

### Added

- Initial release.
`,
      data: {
        title: "Changelog",
        preamble: null,
        releases: [
          {
            version: "Unreleased",
            date: null,
            yanked: false,
            url: null,
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
            summary: null,
          },
          {
            version: "1.0.0",
            date: "2024-01-15",
            yanked: false,
            url: null,
            categories: {
              added: [
                {
                  summary: "Initial release.",
                  markdown: "Initial release.",
                  references: [],
                  commits: [],
                  links: [],
                  images: [],
                },
              ],
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
            summary: null,
          },
        ],
        references: {},
      },
    },

    // Complex example with images, links, references, yanked
    {
      text: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New dark mode support with automatic switching.
- Support for \`async\` iterators in the core API.

### Fixed

- Resolved memory leak in batch processor (#142).

## [1.1.0] - 2024-06-12

### Added

- Added user profiles with avatars.
  ![avatar preview](https://example.com/avatar.png "User avatar")
- Bulk export to CSV.

### Changed

- Updated the [dashboard layout](https://example.com/docs/dashboard) for better readability.

### Security

- Fixed XSS vulnerability in markdown renderer (CVE-2024-1234).

## [1.0.1] - 2024-03-10 [YANKED]

### Fixed

- Hotfix for login redirect.

## [1.0.0] - 2024-01-15

### Added

- Initial release with core features.

[unreleased]: https://github.com/org/repo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/org/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/org/repo/releases/tag/v1.0.0
`,
      data: {
        title: "Changelog",
        preamble:
          "All notable changes to this project will be documented in this file.\n" +
          "The format is based on Keep a Changelog,\n" +
          "and this project adheres to Semantic Versioning.",
        releases: [
          {
            version: "Unreleased",
            date: null,
            yanked: false,
            url: null,
            summary: null,
            categories: {
              added: [
                {
                  summary: "New dark mode support with automatic switching.",
                  markdown: "New dark mode support with automatic switching.",
                  references: [],
                  commits: [],
                  links: [],
                  images: [],
                },
                {
                  summary: "Support for async iterators in the core API.",
                  markdown: "Support for `async` iterators in the core API.",
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
          {
            version: "1.1.0",
            date: "2024-06-12",
            yanked: false,
            url: null,
            summary: null,
            categories: {
              added: [
                {
                  summary: "Added user profiles with avatars.",
                  markdown:
                    'Added user profiles with avatars.\n![avatar preview](https://example.com/avatar.png "User avatar")',
                  references: [],
                  commits: [],
                  links: [],
                  images: [
                    {
                      alt: "avatar preview",
                      src: "https://example.com/avatar.png",
                      title: "User avatar",
                    },
                  ],
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
              changed: [
                {
                  summary: "Updated the dashboard layout for better readability.",
                  markdown:
                    "Updated the [dashboard layout](https://example.com/docs/dashboard) for better readability.",
                  references: [],
                  commits: [],
                  links: [
                    {
                      text: "dashboard layout",
                      href: "https://example.com/docs/dashboard",
                    },
                  ],
                  images: [],
                },
              ],
              deprecated: [],
              removed: [],
              fixed: [],
              security: [
                {
                  summary: "Fixed XSS vulnerability in markdown renderer (CVE-2024-1234).",
                  markdown:
                    "Fixed XSS vulnerability in markdown renderer (CVE-2024-1234).",
                  references: [],
                  commits: [],
                  links: [],
                  images: [],
                },
              ],
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
            version: "1.0.1",
            date: "2024-03-10",
            yanked: true,
            url: null,
            summary: null,
            categories: {
              added: [],
              changed: [],
              deprecated: [],
              removed: [],
              fixed: [
                {
                  summary: "Hotfix for login redirect.",
                  markdown: "Hotfix for login redirect.",
                  references: [],
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
          {
            version: "1.0.0",
            date: "2024-01-15",
            yanked: false,
            url: null,
            summary: null,
            categories: {
              added: [
                {
                  summary: "Initial release with core features.",
                  markdown: "Initial release with core features.",
                  references: [],
                  commits: [],
                  links: [],
                  images: [],
                },
              ],
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
        ],
        references: {},
      },
    },
  ],
});

// ============================================================================
// Exported format with reference-link extraction
// ============================================================================

export const keepAChangelog: typeof baseFormat = {
  ...baseFormat,
  parse(content: string) {
    const result = baseFormat.parse(content) as Changelog;
    const references = extractFootnoteReferences(content);
    return { ...result, references };
  },
};
