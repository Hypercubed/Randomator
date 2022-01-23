import { IntegerOptions, integers } from './numbers';
import { Randomator } from '../randomator';
import { Rng } from '../rng/types';
import { checkOptions } from '../utils';
import { MaxDate, MaxUnixTimestamp, MinDate, MinUnixTimestamp } from './dates.constants';

const now$ = Randomator.from(() => new Date().getTime());

interface DateOptions {
  max?: Date | number;
  min?: Date | number;
  rng?: Rng;
}

/**
 * Generates a random unix timestamp between -2147483647 and 2147483647
 *
 * @param options (defaults between -2147483647 and 2147483647)
 * @returns
 */
export function unixTimestamp(options: DateOptions = {}): Randomator<number> {
  checkOptions(['min', 'max', 'rng'], options);
  let { min = MinUnixTimestamp, max = MaxUnixTimestamp } = options;
  min = min instanceof Date ? +min / 1000 : min;
  max = max instanceof Date ? +max / 1000 : max;
  return integers({ ...options, max, min });
}

/**
 * Generates a random date
 *
 * @param options (defaults between Sep 14 1752 and Apr 18 2187)
 * @returns
 */
export function dates(options: DateOptions = {}): Randomator<Date> {
  checkOptions(['min', 'max', 'rng'], options);
  let { min = MinDate, max = MaxDate } = options;
  min = +min;
  max = +max;
  return integers({ ...options, max, min }).map((i: number) => new Date(i));
}

/**
 * Generates a random date in the past
 *
 * @param options
 * @returns
 */
export function past(options: DateOptions = {}): Randomator<Date> {
  checkOptions(['min', 'rng'], options);
  let { min = MinDate } = options;
  min = +min;
  return now$.map(max => integers({ ...options, max, min } as IntegerOptions)).map(i => new Date(i));
}

/**
 * Generates a random date in the future
 *
 * @param options
 * @returns
 */
export function future(options: DateOptions = {}): Randomator<Date> {
  checkOptions(['max', 'rng'], options);
  let { max = MaxDate } = options;
  max = +max;
  return now$.map(min => integers({ ...options, max, min } as IntegerOptions)).map(i => new Date(i));
}
