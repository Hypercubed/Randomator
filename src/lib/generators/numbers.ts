import { Randomator } from '../randomator';
import { Rng } from '../rng/types';
import { checkOptions } from '../utils';
import { UINT32_SIZE } from './numbers.constants';

export interface NumberOptions {
  rng?: Rng;
}

/**
 * Generates a number between 0 and 1 (inclusive of 0, but excluding 1).
 *
 * @returns
 */
export function numbers(options: Partial<NumberOptions> = {}): Randomator<number> {
  checkOptions(['rng'], options);
  const { rng = Math.random } = options;
  return Randomator.from(rng);
}

export interface IntegerOptions extends NumberOptions {
  max?: number;
  min?: number;
}

// TODO: test
export function uint32s(options: NumberOptions = {}): Randomator<number> {
  checkOptions(['rng'], options);
  const { rng } = options;
  return numbers({ rng }).map(r => (r * UINT32_SIZE) >>> 0);
}

// TODO: test
export function int32s(options: NumberOptions = {}): Randomator<number> {
  checkOptions(['rng'], options);
  const { rng } = options;
  return numbers({ rng }).map(r => (r * UINT32_SIZE) | 0);
}

/**
 * Generates a integer between min and max inclusive.
 *
 * @param options
 * @returns
 */
export function integers(options: IntegerOptions = {}): Randomator<number> {
  checkOptions(['max', 'min', 'rng'], options);
  let { max = 9, min = 0 } = options;
  max = Math.floor(max);
  min = Math.floor(min);
  if (max > Number.MAX_SAFE_INTEGER) {
    throw new RangeError(`max must be less than ${Number.MAX_SAFE_INTEGER}`);
  }
  if (min < Number.MIN_SAFE_INTEGER) {
    throw new RangeError(`min must be greater than ${Number.MIN_SAFE_INTEGER}`);
  }
  const range = max - min + 1;
  return numbers({ rng: options.rng }).map(r => Math.floor(range * r) + min);
}

export interface BigIntegerOptions extends NumberOptions {
  max?: bigint;
  min?: bigint;
}

export function bigIntegers(options: BigIntegerOptions = {}): Randomator<bigint> {
  checkOptions(['max', 'min', 'rng'], options);
  const { max = 9n, min = 0n, rng = Math.random } = options;

  const difference = max - min + 1n;
  const differenceLength = difference.toString().length;

  return Randomator.from(() => {
    let multiplier = '';
    while (multiplier.length < differenceLength) {
      multiplier += rng().toString().split('.')[1];
    }
    multiplier = multiplier.slice(0, differenceLength);
    const divisor = '1' + '0'.repeat(differenceLength);

    const randomDifference = (difference * BigInt(multiplier)) / BigInt(divisor);
    return min + randomDifference;
  });
}

// TODO: test
export function bytes(options: NumberOptions = {}): Randomator<number> {
  checkOptions(['rng'], options);
  const { rng } = options;
  return numbers({ rng }).map(r => (r * 255) >>> 0);
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
export function floats(options: FloatOptions = {}): Randomator<number> {
  checkOptions(['max', 'min', 'fixed', 'rng'], options);
  const { min = 0, max = 1, fixed = 4, rng } = options;
  const f = Math.pow(10, fixed);
  return integers({ max: max * f, min: min * f, rng }).map(i => +(i / f).toFixed(fixed));
}

interface BooleanOptions extends NumberOptions {
  probability?: number;
}

/**
 * Generates a boolean (`true | false`)
 *
 * @returns
 */
export function booleans(options: BooleanOptions = {}): Randomator<boolean> {
  checkOptions(['rng', 'probability'], options);
  const { probability = 0.5, rng } = options;
  if (probability < 0 || probability > 1) {
    throw new RangeError(`probability must be between 0 and 1`);
  }
  return numbers({ rng }).map(x => x < probability);
}
