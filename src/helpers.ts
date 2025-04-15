import { compare } from "./compare";

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
