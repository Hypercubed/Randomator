import { IntegerOptions, integers } from './numbers';
import { Randomator } from '../randomator';

const now = Randomator.from(() => new Date().getTime());

interface DateOptions {
  max?: Date | number;
  min?: Date | number;
}

/**
 * Generates a random unix timestamp between -6857195532 and 4294967295
 *
 * @param options (defaults between -6857195532 and 4294967295)
 * @returns
 */
export function unixTimestamp({ min = -2147483647, max = 2147483647 }: DateOptions = {}): Randomator<number> {
  min = min instanceof Date ? +min / 1000 : min;
  max = max instanceof Date ? +max / 1000 : max;
  return integers({ max, min });
}

/**
 * Generates a random date
 *
 * @param options (defaults between Sep 14 1752 and Apr 18 2187)
 * @returns
 */
export function dates({ min = -6857195532000, max = 6857195532000 }: DateOptions = {}): Randomator<Date> {
  min = +min;
  max = +max;
  return integers({ max, min }).map((i: number) => new Date(i));
}

/**
 * Generates a random date in the past
 *
 * @param options
 * @returns
 */
export function past({ min = -6857195532000 }: DateOptions = {}): Randomator<Date> {
  min = +min;
  return now.map(max => integers({ max, min } as IntegerOptions)).map(i => new Date(i));
}

/**
 * Generates a random date in the future
 *
 * @param options
 * @returns
 */
export function future({ max = 6857195532000 }: DateOptions = {}): Randomator<Date> {
  max = +max;
  return now.map(min => integers({ max, min } as IntegerOptions)).map(i => new Date(i));
}
