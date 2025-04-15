import type { Operator } from "./utils";
import { compare } from "./compare";
import { compareSegments, validateAndParse } from "./utils";

/**
 * Match [npm semver](https://docs.npmjs.com/cli/v6/using-npm/semver) version range.
 *
 * @param version Version number to match
 * @param range Range pattern for version
 * @returns `true` if the version number is within the range, `false` otherwise.
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
  // if (op !== "^" && op !== "~") {
  // }

  // // else range of either "~" or "^" is assumed
  // const parts1 = validateAndParse(version);
  // const parts2 = validateAndParse(range);
  // const v = [parts1.major, parts1.minor, parts1.patch];
  // const r = [parts2.major, parts2.minor ?? "x", parts2.patch ?? "x"];

  // // validate pre-release
  // if (parts2.prerelease) {
  //   if (!parts1.prerelease) return false;
  //   if (compareSegments(v, r) !== 0) return false;
  //   if (compareSegments(parts1.prerelease, parts2.prerelease) === -1) return false;
  // }

  // // first non-zero number
  // const nonZero = r.findIndex((v) => v !== "0") + 1;

  // // pointer to where segments can be >=
  // const i = op === "~" ? 2 : nonZero > 1 ? nonZero : 1;

  // // before pointer must be equal
  // if (compareSegments(v.slice(0, i), r.slice(0, i)) !== 0) return false;

  // // after pointer must be >=
  // if (compareSegments(v.slice(i), r.slice(i)) === -1) return false;

  // return true;
}
