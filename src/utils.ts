export type Operator = ">" | ">=" | "=" | "<" | "<=";

const SEMVER_REGEX = /^[v<>=]*(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

export const SUPPORTED_OPERATORS: Operator[] = [
  ">",
  ">=",
  "=",
  "<",
  "<=",
];

export const COMPARISON_MAP: { [key in Operator]: number[] } = {
  ">": [1],
  ">=": [0, 1],
  "=": [0],
  "<=": [-1, 0],
  "<": [-1],
};

/**
 * @internal
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

/**
 * @internal
 */
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

/**
 * @internal
 */
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

/**
 * @internal
 */
export function compareSegments(segmentsA: string[], segmentsB: string[]): number {
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
