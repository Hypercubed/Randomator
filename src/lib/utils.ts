/**
 * @hidden
 */
export function initOptions<T>(options: Partial<T>, defaults: T): T {
  return Object.assign({}, defaults, options);
}

/**
 * @hidden
 */
export const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
