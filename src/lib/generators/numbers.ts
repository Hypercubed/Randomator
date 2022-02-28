import type { Rng } from '../types';

import { Randomator } from '../randomator.js';
import { getOptions } from '../utils.js';
import { UINT32_SIZE } from './numbers.constants.js';
import { map } from '../operators/pipeable';

const NumberDefaults = {
  rng: Math.random as Rng
};

/**
 * Generates a number between 0 and 1 (inclusive of 0, but excluding 1).
 *
 * @returns
 */
export function numbers(options?: Partial<typeof NumberDefaults>): Randomator<number> {
  const { rng } = getOptions(NumberDefaults, options);
  return Randomator.from(rng);
}

export function uint32s(options?: Partial<typeof NumberDefaults>): Randomator<number> {
  const { rng } = getOptions(NumberDefaults, options);
  return numbers({ rng }).pipe(map(r => (r * UINT32_SIZE) >>> 0));
}

export function int32s(options?: Partial<typeof NumberDefaults>): Randomator<number> {
  const { rng } = getOptions(NumberDefaults, options);
  return numbers({ rng }).pipe(map(r => (r * UINT32_SIZE) | 0));
}

const IntegerDefaults = {
  ...NumberDefaults,
  max: 9,
  min: 0
};

/**
 * Generates a integer between min and max inclusive.
 *
 * @param options
 * @returns
 */
export function integers(options?: Partial<typeof IntegerDefaults>): Randomator<number> {
  // eslint-disable-next-line prefer-const
  let { max, min, rng } = getOptions(IntegerDefaults, options);
  max = Math.floor(max);
  min = Math.floor(min);
  if (max > Number.MAX_SAFE_INTEGER) {
    throw new RangeError(`max must be less than ${Number.MAX_SAFE_INTEGER}`);
  }
  if (min < Number.MIN_SAFE_INTEGER) {
    throw new RangeError(`min must be greater than ${Number.MIN_SAFE_INTEGER}`);
  }
  const range = max - min + 1;
  return numbers({ rng }).pipe(map(r => Math.floor(range * r) + min));
}

const BigIntegerOptions = {
  ...NumberDefaults,
  max: 9n,
  min: 0n
};

export function bigIntegers(options?: Partial<typeof BigIntegerOptions>): Randomator<bigint> {
  const { max, min, rng } = getOptions(BigIntegerOptions, options);

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
export function bytes(options?: Partial<typeof NumberDefaults>): Randomator<number> {
  const { rng } = getOptions(NumberDefaults, options);
  return numbers({ rng }).pipe(map(r => (r * 255) >>> 0));
}

const FloatDefaults = {
  ...IntegerDefaults,
  min: 0,
  max: 1,
  fixed: 4
};

/**
 * Generates a number between `min` and `max` rounded to `fixed` decimal places
 *
 * @param options
 * @returns
 */
export function floats(options?: Partial<typeof FloatDefaults>): Randomator<number> {
  // eslint-disable-next-line prefer-const
  let { min, max, fixed, rng } = getOptions(FloatDefaults, options);
  const f = Math.pow(10, fixed);
  max *= f;
  min *= f;
  return integers({ max: max, min, rng }).pipe(map(i => +(i / f).toFixed(fixed)));
}

const BooleanDefaults = {
  ...NumberDefaults,
  probability: 0.5
};

/**
 * Generates a boolean (`true | false`)
 *
 * @returns
 */
export function booleans(options?: Partial<typeof BooleanDefaults>): Randomator<boolean> {
  const { probability, rng } = getOptions(BooleanDefaults, options);
  if (probability < 0 || probability > 1) {
    throw new RangeError(`probability must be between 0 and 1`);
  }
  return numbers({ rng }).pipe(map(x => x < probability));
}
