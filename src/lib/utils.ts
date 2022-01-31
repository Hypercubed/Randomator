/**
 * @hidden
 */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * @hidden
 */
export function checkOptions(validKeys: string[], options: unknown): void {
  for (const key of Object.keys(options)) {
    if (!validKeys.includes(key)) {
      throw new TypeError(`Unrecognized option: ${key}`);
    }
  }
}
