import { Randomator } from '../randomator';

const { random, floor } = Math;

type Rng = () => number;

export interface NumberOptions {
  rng?: Rng;
}

/**
 * Generates a number between 0 and 1 (inclusive of 0, but excluding 1).
 *
 * @returns
 */
export function numbers({ rng = random }: Partial<NumberOptions> = {}): Randomator<number> {
  return Randomator.from(rng);
}

export interface IntegerOptions extends NumberOptions {
  max?: number;
  min?: number;
}

/**
 * Generates a integer between min and max inclusive.
 *
 * @param options
 * @returns
 */
export function integers({ max = 9, min = 0, rng }: IntegerOptions = {}): Randomator<number> {
  max = floor(max);
  min = floor(min);
  const d = max - min + 1;
  return numbers({ rng }).map(r => floor(d * r) + min);
}

export function bytes({ rng }: NumberOptions = {}): Randomator<number> {
  return integers({ max: 255, min: 0, rng });
}

export interface FloatOptions extends IntegerOptions {
  fixed?: number;
}

/**
 * Generates a number between `min` and `max` rounded to `fixed` decimal places
 *
 * @param options
 * @returns
 */
export function floats({ min = 0, max = 1, fixed = 4, rng }: FloatOptions = {}): Randomator<number> {
  const f = Math.pow(10, fixed);
  return integers({ max: max * f, min: min * f, rng }).map(i => +(i / f).toFixed(fixed));
}

/**
 * Generates a boolean (`true | false`)
 *
 * @returns
 */
export function boolean({ rng }: NumberOptions = {}): Randomator<boolean> {
  return numbers({ rng }).map(x => x < 0.5);
}
