import { Randomator } from '../randomator';
import { initOptions } from '../utils';

const { random, floor } = Math;

/**
 * Generates a number between 0 and 1 (inclusive of 0, but excluding 1).
 *
 * @returns
 */
export function number(): Randomator<number> {
  return Randomator.from(random);
}

export interface IntegerOptions {
  max: number;
  min: number;
}

const DefaultIntegerOptions = { max: 9, min: 0 };

/**
 * Generates a integer between min and max inclusive.
 *
 * @param options
 * @returns
 */
export function integer(options: Partial<typeof DefaultIntegerOptions> = DefaultIntegerOptions): Randomator<number> {
  const { max, min } = initOptions(options, DefaultIntegerOptions);
  const d = max - min + 1;
  return number().map(r => floor(d * r + min));
}

const FloatDefaults = { max: 1, min: 0, fixed: 4 };

/**
 * Generates a number between `min` and `max` rounded to `fixed` decimal places
 *
 * @param options
 * @returns
 */
export function float(options: Partial<typeof FloatDefaults> = FloatDefaults): Randomator<number> {
  const { min, max, fixed } = initOptions(options, FloatDefaults);
  const f = Math.pow(10, fixed);
  return integer({ max: max * f, min: min * f }).map(i => +(i / f).toFixed(fixed));
}

/**
 * Generates a boolean (`true | false`)
 *
 * @returns
 */
export function boolean(): Randomator<boolean> {
  return number().map(x => x < 0.5);
}
