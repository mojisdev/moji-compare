import { describe, expect, it } from "vitest";
import { satisfies } from "../src/satisfies";

describe("satisfies", () => {
  it.each([
    [{ version: "1.2.0", range: ">1.0.0", expected: true }],
    [{ version: "1.2.0", range: "<1.0.0", expected: false }],
    [{ version: "1.0.0", range: "<=1.0.0", expected: true }],
    [{ version: "1.0.0", range: "<=2.0.0", expected: true }],
    [{ version: "1.0.1", range: "1.0.0", expected: false }],
    [{ version: "1.0.0", range: "1.0.0", expected: true }],
    [{ version: "10.1.8", range: ">10.0.4", expected: true }],
    [{ version: "10.1.8", range: ">=10.0.4", expected: true }],
    [{ version: "10.0.1", range: "=10.0.1", expected: true }],
    [{ version: "10.0.1", range: "=10.1.*", expected: false }],
    [{ version: "10.1.1", range: "<10.2.2", expected: true }],
    [{ version: "10.1.1", range: "<10.0.2", expected: false }],
    [{ version: "10.1.1", range: "<=10.2.2", expected: true }],
    [{ version: "10.1.1", range: "<=10.1.1", expected: true }],
    [{ version: "10.1.1", range: "<=10.0.2", expected: false }],
    [{ version: "10.1.1", range: ">=10.0.2", expected: true }],
    [{ version: "10.1.1", range: ">=10.1.1", expected: true }],
    [{ version: "10.1.1", range: ">=10.2.2", expected: false }],
    [{ version: "11.0.0", range: ">=10.1.1", expected: true }],
    [{ version: "3", range: "3.x.x", expected: true }],
    [{ version: "3.3", range: "3.x.x", expected: true }],
    [{ version: "3.3.3", range: "3.x.x", expected: true }],
    [{ version: "3.x.x", range: "3.3.3", expected: true }],
    [{ version: "3.3.3", range: "3.3.x", expected: true }],
    [{ version: "3.3.3", range: "3.*.*", expected: true }],
    [{ version: "3.3.3", range: "3.3.*", expected: true }],
    [{ version: "3.0.3", range: "3.0.*", expected: true }],
    [{ version: "1.1.0", range: "1.2.x", expected: false }],
    [{ version: "1.1.0", range: "2.x.x", expected: false }],
    [{ version: "2.0.0", range: "<2.x.x", expected: false }],
    [{ version: "2.0.0", range: "<=2.x.x", expected: true }],
    [{ version: "2.0.0", range: ">2.x.x", expected: false }],
  ])("satisfies($version, $range) -> $expected", ({ version, range, expected }) => {
    expect(satisfies(version, range)).toBe(expected);
  });

  describe("pre-release versions", () => {
    it.each([
      { version: "1.2.3-beta.4", range: "1.2.3-beta.2", expected: false },
      { version: "1.2.3-beta.1", range: "1.2.3-beta.2", expected: false },
      { version: "1.2.4-beta.2", range: "1.2.3-beta.2", expected: false },
      { version: "2.0.0", range: ">1.2.3-beta.2", expected: true },
      { version: "0.0.3-beta.2", range: "<=0.0.3-beta", expected: false },
      { version: "0.0.3-pr.2", range: ">=0.0.3-beta", expected: true },
      { version: "0.0.4", range: "0.0.3-beta", expected: false },
      { version: "9.0", range: ">=4.x <=10.x", expected: true },
      { version: "10.0", range: ">=4.x <=10.x", expected: true },
      { version: "3.0", range: ">=4.x <=10.x", expected: false },
      { version: "4.0", range: ">=4.x <=10.x", expected: true },
      { version: "11.0", range: ">=4.x <=10.x", expected: false },
    ])("satisfies($version, $range) -> $expected", ({ version, range, expected }) => {
      expect(satisfies(version, range)).toBe(expected);
    });
  });

  describe("comparator sets", () => {
    it.each([
      { version: "1.1.0", range: ">=1.2.7 <1.3.0", expected: false },
      { version: "1.2.9", range: ">=1.2.7 <1.3.0", expected: true },
      { version: "1.3.0", range: ">=1.2.7 <1.3.0", expected: false },
      { version: "1.2.9", range: "   >=1.2.7     <1.3.0 ", expected: true },
      { version: "1.3.0", range: "   >=1.2.7     <1.3.0 ", expected: false },
      { version: "1.2.7", range: "1.2.7 || >=1.2.9 <2.0.0", expected: true },
      { version: "1.2.9", range: "1.2.7 || >=1.2.9 <2.0.0", expected: true },
      { version: "1.4.6", range: "1.2.7 || >=1.2.9 <2.0.0", expected: true },
      { version: "1.2.8", range: "1.2.7 || >=1.2.9 <2.0.0", expected: false },
      { version: "2.0.0", range: "1.2.7 || >=1.2.9 <2.0.0", expected: false },
      { version: "1.4.6", range: "  1.2.7  || >=1.2.9    <2.0.0   ", expected: true },
      { version: "2.0.0", range: "  1.2.7  || >=1.2.9    <2.0.0   ", expected: false },
      { version: "1.0.0", range: "1.2.3 - 2.3.4", expected: false },
      { version: "1.2.3", range: "1.2.3 - 2.3.4", expected: true },
      { version: "1.5.1", range: "1.2.3 - 2.3.4", expected: true },
      { version: "2.3.4", range: "1.2.3 - 2.3.4", expected: true },
      { version: "2.4.0", range: "1.2.3 - 2.3.4", expected: false },
    ])("satisfies($version, $range) -> $expected", ({ version, range, expected }) => {
      expect(satisfies(version, range)).toBe(expected);
    });
  });

  describe("malformed input", () => {
    it.each([
      { version: "1.2.3", range: "> 1.2.3", expected: false },
      { version: "1.2.4", range: "> 1.2.3", expected: true },
      { version: "1.2.3", range: "> 1.2.3 < 1.2.5", expected: false },
      { version: "1.2.4", range: "> 1.2.3 < 1.2.5", expected: true },
      { version: "0.0.0", range: "> 1.2.3 <=  1.2.5   ||   0.0.0", expected: true },
      { version: "1.2.5", range: "> 1.2.3 <=  1.2.5   ||   0.0.0", expected: true },
      { version: "1.3.0", range: "> 1.2.3 <=  1.2.5   ||   0.0.0", expected: false },
    ])("satisfies($version, $range) -> $expected", ({ version, range, expected }) => {
      expect(satisfies(version, range)).toBe(expected);
    });
  });
});
