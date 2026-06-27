import { describe, test, expect } from "bun:test";
import { validResult, failSchema } from "./validation";
import { validateData, ValidationError } from "../src/parse";

describe("validation example", () => {
  test("validateData returns value on success", () => {
    expect(validResult).toEqual({ name: "Ada" });
  });

  test("validateData throws on failure", () => {
    expect(() => validateData(failSchema, {})).toThrow(ValidationError);
  });

  test("ValidationError has correct name", () => {
    try {
      validateData(failSchema, {});
    } catch (e) {
      expect((e as ValidationError).name).toBe("ValidationError");
    }
  });
});
