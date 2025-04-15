import { describe, expect, it } from "vitest";
import { compare } from "../src";

describe("compare", () => {
  describe("single-segment versions", () => {
    it.each([
      { v1: "10", v2: "9", operator: ">" as const, expected: true },
      { v1: "10", v2: "10", operator: "=" as const, expected: true },
      { v1: "10", v2: "11", operator: "<" as const, expected: true },
      { v1: "10", v2: "9", operator: "<=" as const, expected: false },
      { v1: "10", v2: "11", operator: ">=" as const, expected: false },
    ])("compare($v1, $v2, $operator) -> $expected", ({ expected, operator, v1, v2 }) => {
      expect(compare(v1, v2, operator)).toBe(expected);
    });
  });

  describe("two-segment versions", () => {
    it.each([
      { v1: "10.8", v2: "10.4", operator: ">" as const, expected: true },
      { v1: "10.8", v2: "10.8", operator: "=" as const, expected: true },
      { v1: "10.8", v2: "10.9", operator: "<" as const, expected: true },
      { v1: "10.8", v2: "10.4", operator: "<=" as const, expected: false },
      { v1: "10.8", v2: "10.9", operator: ">=" as const, expected: false },
    ])("compare($v1, $v2, $operator) -> $expected", ({ expected, operator, v1, v2 }) => {
      expect(compare(v1, v2, operator)).toBe(expected);
    });
  });

  describe("three-segment versions", () => {
    it.each([
      { v1: "10.8.1", v2: "10.8.0", operator: ">" as const, expected: true },
      { v1: "10.8.1", v2: "10.8.1", operator: "=" as const, expected: true },
      { v1: "10.8.1", v2: "10.8.2", operator: "<" as const, expected: true },
      { v1: "10.8.1", v2: "10.8.0", operator: "<=" as const, expected: false },
      { v1: "10.8.1", v2: "10.8.2", operator: ">=" as const, expected: false },
    ])("compare($v1, $v2, $operator) -> $expected", ({ expected, operator, v1, v2 }) => {
      expect(compare(v1, v2, operator)).toBe(expected);
    });
  });

  describe("pre-release versions", () => {
    it.each([
      { v1: "1.0.0-alpha.1", v2: "1.0.0-alpha", operator: "=" as const, expected: false },
      { v1: "1.0.0-alpha", v2: "1.0.0-alpha.1", operator: "=" as const, expected: false },
      { v1: "1.0.0-alpha.1", v2: "1.0.0-alpha.beta", operator: "<" as const, expected: true },
      { v1: "1.0.0-alpha.beta", v2: "1.0.0-beta", operator: "<" as const, expected: true },
      { v1: "1.0.0-beta", v2: "1.0.0-beta.2", operator: "<" as const, expected: true },
      { v1: "1.0.0-beta.2", v2: "1.0.0-beta.11", operator: "<" as const, expected: true },
      { v1: "1.0.0-beta.11", v2: "1.0.0-rc.1", operator: "<" as const, expected: true },
      { v1: "1.0.0-rc.1", v2: "1.0.0", operator: "<" as const, expected: true },
    ])("compare($v1, $v2, $operator) -> $expected", ({ expected, operator, v1, v2 }) => {
      expect(compare(v1, v2, operator)).toBe(expected);
    });
  });

  describe("ignore leading `v`", () => {
    it.each([
      { v1: "v1.0.0", v2: "1.0.0", operator: "=" as const, expected: true },
      { v1: "v1.0.0", v2: "v1.0.0", operator: "=" as const, expected: true },
      { v1: "v1.0.0-alpha", v2: "1.0.0-alpha", operator: "=" as const, expected: true },
      { v1: "1.0.0", v2: "v1.0.0", operator: "=" as const, expected: true },
    ])("compare($v1, $v2, $operator) -> $expected", ({ expected, operator, v1, v2 }) => {
      expect(compare(v1, v2, operator)).toBe(expected);
    });
  });

  describe("wildcards (x, *)", () => {
    it.each([
      { v1: "3", v2: "3.x.x", operator: "=" as const, expected: true },
      { v1: "3.3", v2: "3.x.x", operator: "=" as const, expected: true },
      { v1: "3.3.3", v2: "3.x.x", operator: "=" as const, expected: true },
      { v1: "3.x.x", v2: "3.3.3", operator: "=" as const, expected: true },
      { v1: "3.3.3", v2: "3.3.x", operator: "=" as const, expected: true },
      { v1: "3.3.3", v2: "3.*.*", operator: "=" as const, expected: true },
      { v1: "3.3.3", v2: "3.3.*", operator: "=" as const, expected: true },
      { v1: "3.0.3", v2: "3.0.*", operator: "=" as const, expected: true },
      { v1: "0.7.x", v2: "0.6.0", operator: ">" as const, expected: true },
      { v1: "0.7.x", v2: "0.6.0-asdf", operator: ">" as const, expected: true },
      { v1: "0.7.x", v2: "0.6.2", operator: ">" as const, expected: true },
      { v1: "0.7.x", v2: "0.7.0-asdf", operator: ">" as const, expected: true },
      { v1: "1.2.*", v2: "1.1.3", operator: ">" as const, expected: true },
      { v1: "1.2.*", v2: "1.1.9999", operator: ">" as const, expected: true },
      { v1: "1.2.x", v2: "1.0.0", operator: ">" as const, expected: true },
      { v1: "1.2.x", v2: "1.1.0", operator: ">" as const, expected: true },
      { v1: "1.2.x", v2: "1.1.3", operator: ">" as const, expected: true },
      { v1: "2.*.*", v2: "1.0.1", operator: ">" as const, expected: true },
      { v1: "2.*.*", v2: "1.1.3", operator: ">" as const, expected: true },
      { v1: "2.x.x", v2: "1.0.0", operator: ">" as const, expected: true },
      { v1: "2.x.x", v2: "1.1.3", operator: ">" as const, expected: true },
    ])("compare($v1, $v2, $operator) -> $expected", ({ expected, operator, v1, v2 }) => {
      expect(compare(v1, v2, operator)).toBe(expected);
    });
  });

  describe("invalid input", () => {
    const MUST_BE_STRING_MESSAGE = /both v1 and v2 must be strings/;

    it.each([
      { version: 42, operator: ">" as const, message: MUST_BE_STRING_MESSAGE },
      { version: {}, operator: ">" as const, message: MUST_BE_STRING_MESSAGE },
      { version: [], operator: ">" as const, message: MUST_BE_STRING_MESSAGE },
      { version: () => undefined, operator: ">" as const, message: MUST_BE_STRING_MESSAGE },
      { version: "6.3.", operator: ">" as const, message: "invalid version string, expected format: major.minor.patch[-prerelease][+build] (e.g. 1.0.0-alpha), received: 6.3." },
      { version: "1.2.3a", operator: ">" as const, message: "invalid version string, expected format: major.minor.patch[-prerelease][+build] (e.g. 1.0.0-alpha), received: 1.2.3a" },
      { version: "1.2.-3a", operator: ">" as const, message: "invalid version string, expected format: major.minor.patch[-prerelease][+build] (e.g. 1.0.0-alpha), received: 1.2.-3a" },
    ])("compare($version, $operator) -> throws", ({ version, operator, message }) => {
      expect(() => compare(version as any, "1.0.0", operator)).toThrow(message);
    });
  });

  it("invalid operator", () => {
    const INVALID_OPERATOR_MESSAGE = /operator must be one of: >, >=, =, <, <=/;
    expect(() => compare("1.0.0", "1.0.0", "invalid" as any)).toThrow(INVALID_OPERATOR_MESSAGE);
  });

  it.each([
    { v1: "0.1.20", v2: "0.1.5", operator: ">" as const, expected: true },
    { v1: "0.6.1-1", v2: "0.6.1-0", operator: ">" as const, expected: true },
    { v1: "1", v2: "0.0.0-beta", operator: ">" as const, expected: true },
    { v1: "1", v2: "0.2.3", operator: ">" as const, expected: true },
    { v1: "1", v2: "0.2.4", operator: ">" as const, expected: true },
    { v1: "1", v2: "1.0.0-0", operator: ">" as const, expected: true },
    { v1: "1", v2: "1.0.0-beta", operator: ">" as const, expected: true },
    { v1: "1.0", v2: "0.0.0", operator: ">" as const, expected: true },
    { v1: "1.0", v2: "0.1.0", operator: ">" as const, expected: true },
    { v1: "1.0", v2: "0.1.2", operator: ">" as const, expected: true },
    { v1: "1.0.0", v2: "0.0.0", operator: ">" as const, expected: true },
    { v1: "1.0.0", v2: "0.0.1", operator: ">" as const, expected: true },
    { v1: "1.0.0", v2: "0.2.3", operator: ">" as const, expected: true },
    { v1: "1.0.0-beta.2", v2: "1.0.0-beta.1", operator: ">" as const, expected: true },
    { v1: "1.2.2", v2: "1.2.1", operator: ">" as const, expected: true },
    { v1: "2", v2: "1.0.0", operator: ">" as const, expected: true },
    { v1: "2", v2: "1.0.0-beta", operator: ">" as const, expected: true },
    { v1: "2", v2: "1.9999.9999", operator: ">" as const, expected: true },
    { v1: "2.0.0", v2: "1.0.0", operator: ">" as const, expected: true },
    { v1: "2.0.0", v2: "1.1.1", operator: ">" as const, expected: true },
    { v1: "2.0.0", v2: "1.2.9", operator: ">" as const, expected: true },
    { v1: "2.0.0", v2: "1.9999.9999", operator: ">" as const, expected: true },
    { v1: "2.3", v2: "2.2.1", operator: ">" as const, expected: true },
    { v1: "2.3", v2: "2.2.2", operator: ">" as const, expected: true },
    { v1: "2.4", v2: "2.3.0", operator: ">" as const, expected: true },
    { v1: "2.4", v2: "2.3.5", operator: ">" as const, expected: true },
    { v1: "3.2.1", v2: "2.3.2", operator: ">" as const, expected: true },
    { v1: "3.2.1", v2: "3.2.0", operator: ">" as const, expected: true },
    { v1: "v0.5.4-pre", v2: "0.5.4-alpha", operator: ">" as const, expected: true },
    { v1: "v3.2.1", v2: "v2.3.2", operator: ">" as const, expected: true },
  ])("compare($v1, $v2, $operator) -> $expected", ({ expected, operator, v1, v2 }) => {
    expect(compare(v1, v2, operator)).toBe(expected);
  });
});
