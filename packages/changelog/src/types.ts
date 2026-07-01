// ============================================================================
// Shared types for all changelog formats
// ============================================================================

export interface Change {
  /** Plain text summary of the change */
  summary: string;
  /** Full markdown text of the change (preserves inline formatting) */
  markdown: string;
  /** Extracted issue / PR references like #123 */
  references: string[];
  /** Extracted commit hashes like abc1234 */
  commits: string[];
  /** Extracted link URLs found in the entry */
  links: Array<{ text: string; href: string; title?: string }>;
  /** Extracted images found in the entry */
  images: Array<{ alt: string; src: string; title?: string }>;
}

export type ChangeCategory =
  | "added"
  | "changed"
  | "deprecated"
  | "removed"
  | "fixed"
  | "security"
  | "bug fixes"
  | "features"
  | "performance improvements"
  | "code refactoring"
  | "reverts"
  | "documentation"
  | "tests"
  | "build"
  | "ci"
  | "chore"
  | "style"
  | "other";

export interface Release {
  /** Version string, e.g. "1.2.3" or "Unreleased" */
  version: string;
  /** ISO 8601 date string if present */
  date: string | null;
  /** Whether this release was yanked */
  yanked: boolean;
  /** Optional compare / release URL */
  url: string | null;
  /** Changes grouped by category */
  categories: Record<ChangeCategory, Change[]>;
  /** Optional summary paragraph before categories */
  summary: string | null;
}

export interface Changelog {
  /** The title of the changelog file (usually "Changelog") */
  title: string;
  /** Optional preamble text after the title */
  preamble: string | null;
  /** All releases, latest first */
  releases: Release[];
  /** Optional footnote reference definitions at the bottom */
  references: Record<string, string>;
}
