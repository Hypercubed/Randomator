/**
 * @hidden
 */
export function initOptions<T>(options: Partial<T>, defaults: T): T {
  const o = { ...options };
  for (const key in defaults) {
    o[key] ??= defaults[key];
  }
  return o as T;
}

/**
 * @hidden
 */
export const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
