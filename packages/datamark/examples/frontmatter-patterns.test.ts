import { describe, test, expect } from "bun:test";
import {
  ConfigFormat,
  OptionalFrontmatterFormat,
  configDoc,
  titledDoc,
  untitledDoc,
} from "./frontmatter-patterns";

describe("frontmatter-patterns", () => {
  test("ConfigFormat extracts frontmatter and body", () => {
    const result = ConfigFormat.parse(configDoc);
    expect(result.config.name).toBe("my-app");
    expect(result.config.version).toBe("1.0.0");
    expect(result.config.features).toEqual(["auth", "api"]);
    expect(result.readme).toContain("This app does things.");
  });

  test("OptionalFrontmatterFormat reads frontmatter when present", () => {
    const result = OptionalFrontmatterFormat.parse(titledDoc);
    expect(result.title).toBe("Hello World");
  });

  test("OptionalFrontmatterFormat falls back to heading", () => {
    const result = OptionalFrontmatterFormat.parse(untitledDoc);
    expect(result.title).toBe("Fallback Title");
  });

  test("OptionalFrontmatterFormat round-trips", () => {
    const data = OptionalFrontmatterFormat.parse(titledDoc);
    const md = OptionalFrontmatterFormat.stringify(data);
    expect(md).toContain("# Hello World");
  });
});
