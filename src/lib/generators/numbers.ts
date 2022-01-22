import { Randomator } from '../randomator';
import { initOptions } from '../utils';

const { random, floor } = Math;

type Rng = () => number;

export interface NumberOptions {
  rng: Rng;
}

const DefaultNumberOptions: NumberOptions = { rng: random };

/**
 * Generates a number between 0 and 1 (inclusive of 0, but excluding 1).
 *
 * @returns
 */
export function numbers(options: Partial<NumberOptions> = DefaultNumberOptions): Randomator<number> {
  let { rng } = initOptions(options, DefaultNumberOptions);
  return Randomator.from(rng);
}

export interface IntegerOptions extends NumberOptions {
  max: number;
  min: number;
}

const DefaultIntegerOptions: Partial<IntegerOptions> = { max: 9, min: 0 };

/**
 * Generates a integer between min and max inclusive.
 *
 * @param options
 * @returns
 */
export function integers(options: Partial<IntegerOptions> = DefaultIntegerOptions): Randomator<number> {
  let { max, min, rng } = initOptions(options, DefaultIntegerOptions);
  max = floor(max);
  min = floor(min);
  const d = max - min + 1;
  return numbers({ rng }).map(r => floor(d * r) + min);
}

export function bytes(options: Partial<NumberOptions> = DefaultNumberOptions): Randomator<number> {
  let { rng } = initOptions(options, DefaultNumberOptions);
  return integers({ max: 255, min: 0, rng });
}

export interface FloatOptions extends IntegerOptions {
  fixed: number;
}

const FloatDefaults: Partial<FloatOptions> = { max: 1, min: 0, fixed: 4 };

/**
 * Generates a number between `min` and `max` rounded to `fixed` decimal places
 *
 * @param options
 * @returns
 */
export function floats(options: Partial<FloatOptions> = FloatDefaults): Randomator<number> {
  const { min, max, fixed, rng } = initOptions(options, FloatDefaults);
  const f = Math.pow(10, fixed);
  return integers({ max: max * f, min: min * f, rng }).map(i => +(i / f).toFixed(fixed));
}

/**
 * Generates a boolean (`true | false`)
 *
 * @returns
 */
export function boolean(options: Partial<NumberOptions> = DefaultNumberOptions): Randomator<boolean> {
  let { rng } = initOptions(options, DefaultNumberOptions);
  return numbers({ rng }).map(x => x < 0.5);
}
