import type { Operator, SortableNumber } from "./utils";
import { compareSegments, compareStrings, COMPARISON_MAP, SUPPORTED_OPERATORS, validateAndParse } from "./utils";

/**
 * Compares two version strings based on the specified operator.
 *
 * This function follows semantic version comparison rules where:
 * - Versions are compared by major, minor, and patch numbers
 * - Pre-release versions have lower precedence than regular versions
 * - Pre-release identifiers are compared alphanumerically
 *
 * @param {string} v1 - First version string to compare
 * @param {string} v2 - Second version string to compare
 * @param {Operator} operator - Comparison operator to use
 * @returns {boolean} Boolean indicating if the comparison is true
 *
 * @throws {TypeError} If v1 or v2 are not strings
 * @throws {TypeError} If the operator is not valid
 *
 * @example
 * ```ts
 * compare('1.2.3', '1.2.4', '<'); // true
 * compare('1.2.3-alpha', '1.2.3', '<'); // true
 * compare('2.0.0', '1.9.9', '>'); // true
 * ```
 */
export function compare(v1: string, v2: string, operator: Operator): boolean {
  if (typeof v1 !== "string" || typeof v2 !== "string") {
    throw new TypeError("both v1 and v2 must be strings");
  }

  if (!SUPPORTED_OPERATORS.includes(operator)) {
    throw new TypeError(`operator must be one of: ${SUPPORTED_OPERATORS.join(", ")}`);
  }

  return COMPARISON_MAP[operator].includes(compareSortable(v1, v2));
}

export function compareSortable(v1: string, v2: string): SortableNumber {
  if (typeof v1 !== "string" || typeof v2 !== "string") {
    throw new TypeError("both v1 and v2 must be strings");
  }

  // validate and parse versions
  const parts1 = validateAndParse(v1);
  const parts2 = validateAndParse(v2);

  // compare major versions
  let result = compareStrings(parts1.major, parts2.major);
  if (result !== 0) {
    return result;
  }

  // compare minor versions
  result = compareStrings(parts1.minor, parts2.minor);
  if (result !== 0) {
    return result;
  }

  // compare patch version
  result = compareStrings(parts1.patch, parts2.patch);
  if (result !== 0) {
    return result;
  }

  // handle pre-release comparison
  const pre1 = parts1.prerelease;
  const pre2 = parts2.prerelease;

  // both have pre-release identifiers
  if (pre1 && pre2) {
    result = compareSegments(pre1, pre2);
    return result;
  }

  // only one has pre-release identifiers
  // pre-release versions have lower precedence than normal versions
  if (pre1) return -1;
  if (pre2) return 1;

  // if both are equal and no pre-release identifiers
  return 0;
}
