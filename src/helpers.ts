import { compare } from "./compare";
import { validateAndParse } from "./utils";

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

/**
 * Extract the major version number from a valid semver string.
 *
 * @param {string} version - A semver version string (e.g. "1.2.3")
 * @returns {number} The major version number
 * @throws {Error} If the version string is invalid
 */
export function major(version: string): number {
  const { major } = validateAndParse(version);

  const parsed = Number.parseInt(major, 10);
  if (Number.isNaN(parsed)) {
    throw new TypeError(`could not cast patch version to number: ${major}`);
  }

  return parsed;
}

/**
 * Extract the minor version number from a valid semver string.
 *
 * @param {string} version - A semver version string (e.g. "1.2.3")
 * @returns {number} The minor version number
 * @throws {Error} If the version string is invalid
 */
export function minor(version: string): number {
  const { minor } = validateAndParse(version);

  const parsed = Number.parseInt(minor, 10);
  if (Number.isNaN(parsed)) {
    throw new TypeError(`could not cast patch version to number: ${minor}`);
  }

  return parsed;
}

/**
 * Extract the patch version number from a valid semver string.
 *
 * @param {string} version - A semver version string (e.g. "1.2.3")
 * @returns {number} The patch version number
 * @throws {Error} If the version string is invalid
 */
export function patch(version: string): number {
  const { patch } = validateAndParse(version);

  const parsed = Number.parseInt(patch, 10);
  if (Number.isNaN(parsed)) {
    throw new TypeError(`could not cast patch version to number: ${patch}`);
  }

  return parsed;
}

/**
 * Validates if a string is a valid version.
 *
 * @param {string? | null} version - The version string to validate
 * @returns {boolean} `true` if the version is valid, `false` otherwise
 *
 * @example
 * ```ts
 * isValid(undefined); // false
 * isValid('1.0.0'); // true
 * isValid('invalid'); // false
 * ```
 */
export function isValid(version?: string | null): boolean {
  if (!version) {
    return false;
  }

  try {
    validateAndParse(version);
    return true;
  } catch {
    return false;
  }
}
