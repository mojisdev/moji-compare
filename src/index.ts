export type Operator = ">" | ">=" | "=" | "<" | "<=";

const SEMVER_REGEX = /^v?(\d+)(?:\.(\d+|[xX*]))?(?:\.(\d+|[xX*]))?(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

const operators: Operator[] = [
  ">",
  ">=",
  "=",
  "<",
  "<=",
];

const COMPARISON_MAP: { [key in Operator]: number[] } = {
  ">": [1],
  ">=": [0, 1],
  "=": [0],
  "<=": [-1, 0],
  "<": [-1],
};

/**
 * Checks if a given string is a wildcard.
 *
 * @param {string} s - The string to check.
 * @returns {boolean} `true` if the string is a wildcard ("*" or "x"), `false` otherwise.
 */
function isWildcard(s: string | undefined): boolean {
  return s === "*" || s === "x";
}

interface ParsedVersion {
  major: string;
  minor: string;
  patch: string;
  prerelease: string[] | null;
}

export function validateAndParse(version: string): ParsedVersion {
  if (typeof version !== "string") {
    throw new TypeError("version must be a string");
  }

  const match = version.match(SEMVER_REGEX);
  if (!match) {
    throw new Error(
      `invalid version string, expected format: major.minor.patch[-prerelease][+build] (e.g. 1.0.0-alpha), received: ${version}`,
    );
  }

  return {
    major: match[1] ?? "0",
    minor: match[2] ?? "0",
    patch: match[3] ?? "0",
    prerelease: match[4] ? match[4].split(".") : null,
  };
}

export function compareStrings(a: string, b: string): number {
  // wildcards are considered equal to anything
  if (isWildcard(a) || isWildcard(b)) {
    return 0;
  }

  const numA = /^\d+$/.test(a);
  const numB = /^\d+$/.test(b);

  // both are numeric strings
  if (numA && numB) {
    const valA = Number.parseInt(a, 10);
    const valB = Number.parseInt(b, 10);
    return valA === valB ? 0 : valA > valB ? 1 : -1;
  }

  // mixed types - numeric identifiers have lower precedence
  if (numA) return -1;
  if (numB) return 1;

  // both are non-numeric strings - lexicographical comparison
  return a === b ? 0 : a > b ? 1 : -1;
}

function compareSegments(segmentsA: string[], segmentsB: string[]): number {
  const len = Math.max(segmentsA.length, segmentsB.length);

  for (let i = 0; i < len; i++) {
    // get segments, treating undefined as special case
    const identifierA = segmentsA[i];
    const identifierB = segmentsB[i];

    // handle cases where arrays have different lengths
    if (identifierA === undefined) return identifierB === undefined ? 0 : -1;
    if (identifierB === undefined) return 1;

    // compare identifiers
    const result = compareStrings(identifierA, identifierB);
    if (result !== 0) return result;
  }

  return 0;
}

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

  if (!operators.includes(operator)) {
    throw new TypeError(`operator must be one of: ${operators.join(", ")}`);
  }

  // validate and parse versions
  const parts1 = validateAndParse(v1);
  const parts2 = validateAndParse(v2);

  // compare major versions
  let result = compareStrings(parts1.major, parts2.major);
  if (result !== 0) {
    return COMPARISON_MAP[operator].includes(result);
  }

  // compare minor versions
  result = compareStrings(parts1.minor, parts2.minor);
  if (result !== 0) {
    return COMPARISON_MAP[operator].includes(result);
  }

  // compare patch version
  result = compareStrings(parts1.patch, parts2.patch);
  if (result !== 0) {
    return COMPARISON_MAP[operator].includes(result);
  }

  // handle pre-release comparison
  const pre1 = parts1.prerelease;
  const pre2 = parts2.prerelease;

  // both have pre-release identifiers
  if (pre1 && pre2) {
    result = compareSegments(pre1, pre2);
    return COMPARISON_MAP[operator].includes(result);
  }

  // only one has pre-release identifiers
  // pre-release versions have lower precedence than normal versions
  if (pre1) return COMPARISON_MAP[operator].includes(-1);
  if (pre2) return COMPARISON_MAP[operator].includes(1);

  // if both are equal and no pre-release identifiers
  return COMPARISON_MAP[operator].includes(0);
}

/**
 * Checks if the first version is less than the second version.
 *
 * @param {string} v1 - The first version string to compare
 * @param {string} v2 - The second version string to compare
 * @returns {boolean} `true` if `v1` is less than `v2`, `false` otherwise
 *
 * @example
 * ```ts
 * lt('1.0.0', '2.0.0'); // true
 * lt('2.0.0', '1.0.0'); // false
 * lt('1.0.0', '1.0.0'); // false
 * ```
 */
export function lt(v1: string, v2: string): boolean {
  return compare(v1, v2, "<");
}

/**
 * Checks if the first version is greater than the second version.
 *
 * @param v1 - The first version string to compare
 * @param v2 - The second version string to compare
 * @returns `true` if v1 is greater than v2, `false` otherwise
 */
export function gt(v1: string, v2: string): boolean {
  return compare(v1, v2, ">");
}

/**
 * Determines whether the first version is less than or equal to the second version.
 *
 * @param {string} v1 - The first version string to compare
 * @param {string} v2 - The second version string to compare
 * @returns {boolean} `true` if v1 is less than or equal to v2, otherwise `false`
 *
 * @example
 * ```ts
 * lte('1.2.3', '1.2.4'); // true
 * lte('1.2.3', '1.2.3'); // true
 * lte('1.2.4', '1.2.3'); // false
 * ```
 */
export function lte(v1: string, v2: string): boolean {
  return compare(v1, v2, "<=");
}

/**
 * Determines whether the first version is greater than the second version.
 *
 * @param {string} v1 - The first version string to compare
 * @param {string} v2 - The second version string to compare
 * @returns {boolean} `true` if `v1` is greater than `v2`, `false` otherwise
 *
 * @example
 * ```ts
 * gt('1.2.3', '1.2.2'); // true
 * gt('1.2.3', '1.2.3'); // false
 * gt('1.2.3', '1.2.4'); // false
 * ```
 */
export function gte(v1: string, v2: string): boolean {
  return compare(v1, v2, ">=");
}

/**
 * Checks if two version strings are exactly equal.
 *
 * @param {string} v1 - The first version string to compare
 * @param {string} v2 - The second version string to compare
 * @returns {boolean} `true` if versions are exactly equal, `false` otherwise
 *
 * @example
 * ```ts
 * eq('1.2.3', '1.2.3'); // true
 * eq('1.2.3', '1.2.3-alpha'); // false
 * eq('2.0.0', '2.0'); // true
 * ```
 */
export function eq(v1: string, v2: string): boolean {
  return compare(v1, v2, "=");
}

/**
 * Checks if two strings are not equal in terms of emojis.
 *
 * This function compares two strings and returns true if they are not equal.
 * It uses the compare function with the "=" operator and negates the result.
 *
 * @param {string} v1 - The first string to compare.
 * @param {string} v2 - The second string to compare.
 * @returns {boolean} A boolean indicating whether the strings are not equal (true) or equal (false).
 */
export function neq(v1: string, v2: string): boolean {
  return !compare(v1, v2, "=");
}

export default {
  compare,
  lt,
  gt,
  lte,
  gte,
  eq,
  neq,
  validateAndParse,
  compareStrings,
};
