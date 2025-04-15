import { describe, expect, it } from "vitest";
import { eq, gt, gte, lt, lte, neq } from "../src/helpers";

describe("lt", () => {
  it.each([
    { v1: "1.0.0", v2: "2.0.0", expected: true },
    { v1: "2.0.0", v2: "1.0.0", expected: false },
    { v1: "1.0.0", v2: "1.0.0", expected: false },
    { v1: "1.2.3", v2: "1.3.0", expected: true },
    { v1: "1.0.0-alpha", v2: "1.0.0", expected: true },
    { v1: "1.0.0-alpha", v2: "1.0.0-beta", expected: true },
    { v1: "1.0.0", v2: "1.0.0-alpha", expected: false },
    { v1: "v1.0.0", v2: "2.0.0", expected: true },
    { v1: "2.x.x", v2: "3.0.0", expected: true },
    { v1: "2.x.x", v2: "1.0.0", expected: false },
  ])("lt($v1, $v2) -> $expected", ({ v1, v2, expected }) => {
    expect(lt(v1, v2)).toBe(expected);
  });
});

describe("lte", () => {
  it.each([
    { v1: "1.2.3", v2: "1.2.4", expected: true },
    { v1: "1.2.3", v2: "1.2.3", expected: true },
    { v1: "1.2.4", v2: "1.2.3", expected: false },
    { v1: "1.0.0-alpha", v2: "1.0.0", expected: true },
    { v1: "1.0.0-alpha", v2: "1.0.0-alpha", expected: true },
    { v1: "1.0.0", v2: "1.0.0-alpha", expected: false },
    { v1: "v1.0.0", v2: "1.0.0", expected: true },
    { v1: "2.x.x", v2: "2.0.0", expected: true },
    { v1: "3.x.x", v2: "2.0.0", expected: false },
  ])("lte($v1, $v2) -> $expected", ({ v1, v2, expected }) => {
    expect(lte(v1, v2)).toBe(expected);
  });
});

describe("gte", () => {
  it.each([
    { v1: "1.2.3", v2: "1.2.2", expected: true },
    { v1: "1.2.3", v2: "1.2.3", expected: true },
    { v1: "1.2.3", v2: "1.2.4", expected: false },
    { v1: "1.0.0", v2: "1.0.0-alpha", expected: true },
    { v1: "1.0.0-alpha", v2: "1.0.0-alpha", expected: true },
    { v1: "1.0.0-alpha", v2: "1.0.0", expected: false },
    { v1: "1.0.0", v2: "v1.0.0", expected: true },
    { v1: "2.0.0", v2: "2.x.x", expected: true },
    { v1: "2.0.0", v2: "3.x.x", expected: false },
  ])("gte($v1, $v2) -> $expected", ({ v1, v2, expected }) => {
    expect(gte(v1, v2)).toBe(expected);
  });
});

describe("eq", () => {
  it.each([
    { v1: "1.2.3", v2: "1.2.3", expected: true },
    { v1: "1.2.3", v2: "1.2.3-alpha", expected: false },
    { v1: "2.0.0", v2: "2.0", expected: true },
    { v1: "1.0.0-alpha", v2: "1.0.0-alpha", expected: true },
    { v1: "1.0.0-alpha.1", v2: "1.0.0-alpha.1", expected: true },
    { v1: "1.0.0-alpha.1", v2: "1.0.0-alpha.2", expected: false },
    { v1: "v1.0.0", v2: "1.0.0", expected: true },
    { v1: "1.x.x", v2: "1.2.3", expected: true },
    { v1: "1.2.x", v2: "1.2.3", expected: true },
  ])("eq($v1, $v2) -> $expected", ({ v1, v2, expected }) => {
    expect(eq(v1, v2)).toBe(expected);
  });
});

describe("neq", () => {
  it.each([
    { v1: "1.2.3", v2: "1.2.3", expected: false },
    { v1: "1.2.3", v2: "1.2.4", expected: true },
    { v1: "1.2.3", v2: "1.2.3-alpha", expected: true },
    { v1: "2.0.0", v2: "2.0", expected: false },
    { v1: "1.0.0-alpha", v2: "1.0.0-beta", expected: true },
    { v1: "v1.0.0", v2: "1.0.0", expected: false },
    { v1: "1.x.x", v2: "2.0.0", expected: true },
    { v1: "1.2.x", v2: "1.3.0", expected: true },
  ])("neq($v1, $v2) -> $expected", ({ v1, v2, expected }) => {
    expect(neq(v1, v2)).toBe(expected);
  });
});

describe("gt", () => {
  it.each([
    { v1: "1.2.3", v2: "1.2.2", expected: true },
    { v1: "1.2.3", v2: "1.2.3", expected: false },
    { v1: "1.2.3", v2: "1.2.4", expected: false },
    { v1: "1.0.0", v2: "1.0.0-alpha", expected: true },
    { v1: "1.0.0-beta", v2: "1.0.0-alpha", expected: true },
    { v1: "1.0.0-alpha", v2: "1.0.0", expected: false },
    { v1: "v2.0.0", v2: "1.0.0", expected: true },
    { v1: "3.x.x", v2: "2.0.0", expected: true },
    { v1: "1.x.x", v2: "2.0.0", expected: false },
  ])("gt($v1, $v2) -> $expected", ({ v1, v2, expected }) => {
    const result = gt(v1, v2);
    expect(result).toBe(expected);
  });
});
