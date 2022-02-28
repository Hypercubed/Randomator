/**
 * @hidden
 */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * @hidden
 */
export function getOptions<T>(defaults: T, options: Partial<T> = {}): T {
  const validKeys = Object.keys(defaults);
  for (const key of Object.keys(options)) {
    if (!validKeys.includes(key)) {
      throw new TypeError(`Unrecognized option: ${key}`);
    }
  }
  return { ...defaults, ...options };
}
