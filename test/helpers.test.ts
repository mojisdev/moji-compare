import { describe, expect, it } from "vitest";
import {
  coerce,
  eq,
  gt,
  gte,
  isValid,
  lt,
  lte,
  major,
  minor,
  neq,
  patch,
} from "../src/helpers";

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

describe("major", () => {
  it.each([
    { version: "1.2.3", expected: 1 },
    { version: "10.0.0", expected: 10 },
    { version: "0.2.3", expected: 0 },
    { version: "v1.2.3", expected: 1 },
    { version: "1.2.3-alpha", expected: 1 },
    { version: "1.2.3+build", expected: 1 },
    { version: "1.2", expected: 1 },
    { version: "1", expected: 1 },
    { version: "1.x.x", expected: 1 },
    { version: "1.2.x", expected: 1 },
    { version: "v1.x.x", expected: 1 },
    { version: "v1.2.x", expected: 1 },
    { version: "vx.x.x", expected: 0 },
    { version: "x.x.x", expected: 0 },
  ])("major($version) -> $expected", ({ version, expected }) => {
    expect(major(version)).toBe(expected);
  });

  it("throws for invalid versions", () => {
    expect(() => major("invalid")).toThrow();
    expect(() => major("1.2.3a")).toThrow();
    expect(() => major("1.2.")).toThrow();
  });
});

describe("minor", () => {
  it.each([
    { version: "1.2.3", expected: 2 },
    { version: "10.5.0", expected: 5 },
    { version: "0.0.3", expected: 0 },
    { version: "v1.2.3", expected: 2 },
    { version: "1.2.3-alpha", expected: 2 },
    { version: "1.2.3+build", expected: 2 },
    { version: "1", expected: 0 },
    { version: "1.x.x", expected: 0 },
    { version: "1.2.x", expected: 2 },
    { version: "v1.x.x", expected: 0 },
    { version: "v1.2.x", expected: 2 },
    { version: "vx.x.x", expected: 0 },
    { version: "x.x.x", expected: 0 },
  ])("minor($version) -> $expected", ({ version, expected }) => {
    expect(minor(version)).toBe(expected);
  });

  it("throws for invalid versions", () => {
    expect(() => minor("invalid")).toThrow();
    expect(() => minor("1.2.3a")).toThrow();
    expect(() => minor("1.2.")).toThrow();
  });
});

describe("patch", () => {
  it.each([
    { version: "1.2.3", expected: 3 },
    { version: "10.5.7", expected: 7 },
    { version: "0.0.0", expected: 0 },
    { version: "v1.2.3", expected: 3 },
    { version: "1.2.3-alpha", expected: 3 },
    { version: "1.2.3+build", expected: 3 },
    { version: "1.2", expected: 0 },
    { version: "1", expected: 0 },
    { version: "1.x.x", expected: 0 },
    { version: "1.2.x", expected: 0 },
    { version: "v1.x.x", expected: 0 },
    { version: "v1.2.x", expected: 0 },
    { version: "vx.x.x", expected: 0 },
    { version: "x.x.x", expected: 0 },
  ])("patch($version) -> $expected", ({ version, expected }) => {
    expect(patch(version)).toBe(expected);
  });

  it("throws for invalid versions", () => {
    expect(() => patch("invalid")).toThrow();
    expect(() => patch("1.2.3a")).toThrow();
    expect(() => patch("1.2.")).toThrow();
  });
});

describe("isValid", () => {
  it.each([
    { version: "1.2.3", expected: true },
    { version: "1.2.3-alpha", expected: true },
    { version: "1.2.3+build", expected: true },
    { version: "v1.2.3", expected: true },
    { version: "1.x.x", expected: true },
    { version: "1.2.x", expected: true },
    { version: "invalid", expected: false },
    { version: undefined, expected: false },
    { version: null, expected: false },
    { version: "", expected: false },
    { version: "1.2.3a", expected: false },
    { version: "1.2.", expected: false },
    { version: "x.x.x", expected: true },
    { version: "vx.x.x", expected: true },
    { version: "1.2.3-alpha.1", expected: true },
    { version: "1.2.3+build.1", expected: true },
  ])("isValid($version) -> $expected", ({ version, expected }) => {
    expect(isValid(version)).toBe(expected);
  });
});

describe("coerce", () => {
  it.each([
    { version: "1.2.3", expected: "1.2.3" },
    { version: "v1.2.3", expected: "1.2.3" },
    { version: "1.2.3-alpha", expected: "1.2.3-alpha" },
    { version: "1.2.3+build", expected: "1.2.3" },
    { version: "1.2", expected: "1.2.0" },
    { version: "1", expected: "1.0.0" },
    { version: "1.x.x", expected: "1.0.0" },
    { version: "1.2.x", expected: "1.2.0" },
    { version: "v1.x.x", expected: "1.0.0" },
    { version: "v1.2.x", expected: "1.2.0" },
    { version: "x.x.x", expected: "0.0.0" },
    { version: "invalid", expected: null },
    { version: "1.2.3a", expected: null },
    { version: "1.2.", expected: null },
  ])("coerce($version) -> $expected", ({ version, expected }) => {
    expect(coerce(version)).toBe(expected);
  });
});
