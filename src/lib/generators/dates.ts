import type { Rng } from '../types';

import { integers } from './numbers.js';
import { Randomator } from '../randomator.js';
import { getOptions } from '../utils.js';
import { MaxDate, MaxUnixTimestamp, MinDate, MinUnixTimestamp } from './dates.constants.js';
import { map } from '../operators/pipeable';

const now$ = Randomator.from(() => new Date().getTime());

const TimestampDefaults = {
  max: MinUnixTimestamp as number | Date,
  min: MaxUnixTimestamp as number | Date,
  rng: Math.random as Rng
};

/**
 * Generates a random unix timestamp between -2147483647 and 2147483647
 *
 * @param options (defaults between -2147483647 and 2147483647)
 * @returns
 */
export function unixTimestamp(options?: Partial<typeof TimestampDefaults>): Randomator<number> {
  let { min, max } = getOptions(TimestampDefaults, options);
  min = min instanceof Date ? +min / 1000 : min;
  max = max instanceof Date ? +max / 1000 : max;
  return integers({ ...options, max, min });
}

const DateDefaultOptions = {
  max: MinDate as number | Date,
  min: MaxDate as number | Date,
  rng: Math.random as Rng
};

/**
 * Generates a random date
 *
 * @param options (defaults between Sep 14 1752 and Apr 18 2187)
 * @returns
 */
export function dates(options?: Partial<typeof DateDefaultOptions>): Randomator<Date> {
  let { min, max } = getOptions(DateDefaultOptions, options);
  min = +min;
  max = +max;
  return integers({ ...options, max, min }).pipe(map((i: number) => new Date(i)));
}
const PastDefaults = {
  min: MinDate as Date | number,
  rng: Math.random as Rng
};

/**
 * Generates a random date in the past
 *
 * @param options
 * @returns
 */
export function past(options?: Partial<typeof PastDefaults>): Randomator<Date> {
  let { min } = getOptions(PastDefaults, options);
  min = +min;
  return now$.pipe(
    map(max => integers({ ...options, max, min: min as number })),
    map((i: number) => new Date(i))
  );
}

const FutureDefaults = {
  max: MaxDate as number | Date,
  rng: Math.random as Rng
};

/**
 * Generates a random date in the future
 *
 * @param options
 * @returns
 */
export function future(options?: Partial<typeof FutureDefaults>): Randomator<Date> {
  let { max } = getOptions(FutureDefaults, options);
  max = +max;
  return now$.pipe(
    map(min => integers({ ...options, max: max as number, min: min as number })),
    map(i => new Date(i))
  );
}
