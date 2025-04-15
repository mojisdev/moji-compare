import type { Operator } from "./utils";
import { compare } from "./compare";

/**
 * Match Semver version range.
 *
 * @param {string} version Version number to match
 * @param {string} range Range pattern for version
 * @returns {boolean} `true` if the version number is within the range, `false` otherwise.
 *
 * @example
 * ```
 * satisfies('1.1.0', '^1.0.0'); // return true
 * satisfies('1.1.0', '~1.0.0'); // return false
 * ```
 */
export function satisfies(version: string, range: string): boolean {
  // clean input
  range = range.replace(/([><=]+)\s+/g, "$1");

  // handle multiple comparators
  if (range.includes("||")) {
    return range.split("||").some((r) => satisfies(version, r));
  } else if (range.includes(" - ")) {
    const [a, b] = range.split(" - ", 2);
    return satisfies(version, `>=${a} <=${b}`);
  } else if (range.includes(" ")) {
    return range
      .trim()
      .replace(/\s{2,}/g, " ")
      .split(" ")
      .every((r) => satisfies(version, r));
  }

  // if no range operator then "="
  const m = range.match(/^([<>=]+)/);
  const op = m ? m[1] : "=";

  return compare(version, range, op as Operator);
}
