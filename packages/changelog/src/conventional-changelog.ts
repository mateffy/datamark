// ============================================================================
// Conventional Changelog format (Angular / conventional-commits style)
//
// Versions: ## [1.0.0](https://github.com/org/repo/compare/v0.1.0...v1.0.0) (2024-01-01)
// Categories: Bug Fixes, Features, Performance Improvements, Reverts, etc.
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

function parseConventionalChangelog(doc: any): Changelog {
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

function stringifyConventionalChangelog(data: Changelog): string {
  const lines: string[] = [];

  lines.push(heading(data.title, 1));
  lines.push("");

  if (data.preamble) {
    lines.push(paragraph(data.preamble));
    lines.push("");
  }

  for (const release of data.releases) {
    lines.push(
      buildVersionHeading(
        release.version,
        release.date,
        release.yanked,
        release.url,
        "conventional"
      )
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
    "Conventional Changelog format based on Angular commit conventions. " +
    "Versions may include compare URLs. Categories follow conventional commits: " +
    "Bug Fixes, Features, Performance Improvements, Code Refactoring, Reverts, etc.",

  schema: ChangelogSchema,

  parse: parseConventionalChangelog,

  stringify: stringifyConventionalChangelog,

  examples: [
    {
      text: `# Changelog

## [1.13.3](https://github.com/axios/axios/compare/v1.13.2...v1.13.3) (2026-01-20)

### Bug Fixes

- **http2:** Use port 443 for HTTPS connections by default. ([#7256](https://github.com/axios/axios/issues/7256)) ([d7e6065](https://github.com/axios/axios/commit/d7e60653460480ffacecf85383012ca1baa6263e))
- **interceptor:** handle the error in the same interceptor ([#6269](https://github.com/axios/axios/issues/6269)) ([5945e40](https://github.com/axios/axios/commit/5945e40bb171d4ac4fc195df276cf952244f0f89))

### Features

- add \`undefined\` as a value in AxiosRequestConfig ([#5560](https://github.com/axios/axios/issues/5560)) ([095033c](https://github.com/axios/axios/commit/095033c626895ecdcda2288050b63dcf948db3bd))

### Reverts

- Revert "fix: silentJSONParsing=false should throw on invalid JSON" ([#7298](https://github.com/axios/axios/issues/7298)) ([a4230f5](https://github.com/axios/axios/commit/a4230f5581b3f58b6ff531b6dbac377a4fd7942a))

## [1.13.2](https://github.com/axios/axios/compare/v1.13.1...v1.13.2) (2025-11-04)

### Bug Fixes

- **http:** fix 'socket hang up' bug for keep-alive requests when using timeouts; ([#7206](https://github.com/axios/axios/issues/7206)) ([8d37233](https://github.com/axios/axios/commit/8d372335f5c50ecd01e8615f2468a9eb19703117))

### Performance Improvements

- **http:** fix early loop exit; ([#7202](https://github.com/axios/axios/issues/7202)) ([12c314b](https://github.com/axios/axios/commit/12c314b603e7852a157e93e47edb626a471ba6c5))
`,
      data: {
        title: "Changelog",
        preamble: null,
        releases: [
          {
            version: "1.13.3",
            date: "2026-01-20",
            yanked: false,
            url: "https://github.com/axios/axios/compare/v1.13.2...v1.13.3",
            summary: null,
            categories: {
              added: [],
              changed: [],
              deprecated: [],
              removed: [],
              fixed: [],
              security: [],
              "bug fixes": [
                {
                  summary:
                    "http2: Use port 443 for HTTPS connections by default. (#7256) (d7e6065)",
                  markdown:
                    "**http2:** Use port 443 for HTTPS connections by default. ([#7256](https://github.com/axios/axios/issues/7256)) ([d7e6065](https://github.com/axios/axios/commit/d7e60653460480ffacecf85383012ca1baa6263e))",
                  references: ["#7256"],
                  commits: ["d7e6065"],
                  links: [
                    {
                      text: "#7256",
                      href: "https://github.com/axios/axios/issues/7256",
                    },
                    {
                      text: "d7e6065",
                      href: "https://github.com/axios/axios/commit/d7e60653460480ffacecf85383012ca1baa6263e",
                    },
                  ],
                  images: [],
                },
                {
                  summary:
                    "interceptor: handle the error in the same interceptor (#6269) (5945e40)",
                  markdown:
                    "**interceptor:** handle the error in the same interceptor ([#6269](https://github.com/axios/axios/issues/6269)) ([5945e40](https://github.com/axios/axios/commit/5945e40bb171d4ac4fc195df276cf952244f0f89))",
                  references: ["#6269"],
                  commits: ["5945e40"],
                  links: [
                    {
                      text: "#6269",
                      href: "https://github.com/axios/axios/issues/6269",
                    },
                    {
                      text: "5945e40",
                      href: "https://github.com/axios/axios/commit/5945e40bb171d4ac4fc195df276cf952244f0f89",
                    },
                  ],
                  images: [],
                },
              ],
              features: [
                {
                  summary:
                    "add undefined as a value in AxiosRequestConfig (#5560) (095033c)",
                  markdown:
                    "add `undefined` as a value in AxiosRequestConfig ([#5560](https://github.com/axios/axios/issues/5560)) ([095033c](https://github.com/axios/axios/commit/095033c626895ecdcda2288050b63dcf948db3bd))",
                  references: ["#5560"],
                  commits: ["095033c"],
                  links: [
                    {
                      text: "#5560",
                      href: "https://github.com/axios/axios/issues/5560",
                    },
                    {
                      text: "095033c",
                      href: "https://github.com/axios/axios/commit/095033c626895ecdcda2288050b63dcf948db3bd",
                    },
                  ],
                  images: [],
                },
              ],
              "performance improvements": [],
              "code refactoring": [],
              reverts: [
                {
                  summary:
                    'Revert "fix: silentJSONParsing=false should throw on invalid JSON" (#7298) (a4230f5)',
                  markdown:
                    'Revert "fix: silentJSONParsing=false should throw on invalid JSON" ([#7298](https://github.com/axios/axios/issues/7298)) ([a4230f5](https://github.com/axios/axios/commit/a4230f5581b3f58b6ff531b6dbac377a4fd7942a))',
                  references: ["#7298"],
                  commits: ["a4230f5"],
                  links: [
                    {
                      text: "#7298",
                      href: "https://github.com/axios/axios/issues/7298",
                    },
                    {
                      text: "a4230f5",
                      href: "https://github.com/axios/axios/commit/a4230f5581b3f58b6ff531b6dbac377a4fd7942a",
                    },
                  ],
                  images: [],
                },
              ],
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
            version: "1.13.2",
            date: "2025-11-04",
            yanked: false,
            url: "https://github.com/axios/axios/compare/v1.13.1...v1.13.2",
            summary: null,
            categories: {
              added: [],
              changed: [],
              deprecated: [],
              removed: [],
              fixed: [],
              security: [],
              "bug fixes": [
                {
                  summary:
                    "http: fix 'socket hang up' bug for keep-alive requests when using timeouts; (#7206) (8d37233)",
                  markdown:
                    "**http:** fix 'socket hang up' bug for keep-alive requests when using timeouts; ([#7206](https://github.com/axios/axios/issues/7206)) ([8d37233](https://github.com/axios/axios/commit/8d372335f5c50ecd01e8615f2468a9eb19703117))",
                  references: ["#7206"],
                  commits: ["8d37233"],
                  links: [
                    {
                      text: "#7206",
                      href: "https://github.com/axios/axios/issues/7206",
                    },
                    {
                      text: "8d37233",
                      href: "https://github.com/axios/axios/commit/8d372335f5c50ecd01e8615f2468a9eb19703117",
                    },
                  ],
                  images: [],
                },
              ],
              features: [],
              "performance improvements": [
                {
                  summary:
                    "http: fix early loop exit; (#7202) (12c314b)",
                  markdown:
                    "**http:** fix early loop exit; ([#7202](https://github.com/axios/axios/issues/7202)) ([12c314b](https://github.com/axios/axios/commit/12c314b603e7852a157e93e47edb626a471ba6c5))",
                  references: ["#7202"],
                  commits: ["12c314b"],
                  links: [
                    {
                      text: "#7202",
                      href: "https://github.com/axios/axios/issues/7202",
                    },
                    {
                      text: "12c314b",
                      href: "https://github.com/axios/axios/commit/12c314b603e7852a157e93e47edb626a471ba6c5",
                    },
                  ],
                  images: [],
                },
              ],
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

export const conventionalChangelog: typeof baseFormat = {
  ...baseFormat,
  parse(content: string) {
    const result = baseFormat.parse(content) as Changelog;
    const references = extractFootnoteReferences(content);
    return { ...result, references };
  },
};
