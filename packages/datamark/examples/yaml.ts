import { parseYaml, stringifyYaml, YamlParseError } from "../src/parse";

export const parsed = parseYaml("title: Hello\ntags:\n  - a\n  - b");

export const stringified = stringifyYaml({ title: "Hello", tags: ["a", "b"] });

export const nestedParsed = parseYaml(`meta:
  author: Ada
  date: 2026-06-01`);
