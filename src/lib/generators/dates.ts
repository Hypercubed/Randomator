import { integers } from './numbers';
import { Randomator } from '../randomator';

const now = Randomator.from(() => new Date().getTime());

interface DateOptions {
  max: Date | number;
  min: Date | number;
}

const DefaultUnixDateOptions = {
  // 32-bit signed integer
  min: -2147483647, // Dec 13 1901
  max: 2147483647 // Jan 19 2038
};

/**
 * Generates a random unix timestamp between -6857195532 and 4294967295
 *
 * @param options (defaults between -6857195532 and 4294967295)
 * @returns
 */
export function unixTimestamp(options: Partial<DateOptions> = DefaultUnixDateOptions): Randomator<number> {
  options = Object.assign({}, DefaultUnixDateOptions, options);
  const min = options.min instanceof Date ? +options.min / 1000 : options.min;
  const max = options.max instanceof Date ? +options.max / 1000 : options.max;
  return integers({ max, min });
}

const DefaultDateOptions = {
  min: -6857195532000, // Sep 14 1752 (Start of Gregorian calendar)
  max: 6857195532000 // Apr 18 2187
};

/**
 * Generates a random date
 *
 * @param options (defaults between Sep 14 1752 and Apr 18 2187)
 * @returns
 */
export function dates(options: Partial<DateOptions> = DefaultDateOptions): Randomator<Date> {
  options = Object.assign({}, DefaultDateOptions, options);
  const min = +options.min;
  const max = +options.max;
  return integers({ max, min }).map((i: number) => new Date(i));
}

/**
 * Generates a random date in the past
 *
 * @param options
 * @returns
 */
export function past(options: Partial<DateOptions> = DefaultDateOptions): Randomator<Date> {
  options = Object.assign({}, DefaultDateOptions, options);
  const min = +options.min;
  return now.map(max => integers({ max, min })).map(i => new Date(i));
}

/**
 * Generates a random date in the future
 *
 * @param options
 * @returns
 */
export function future(options: Partial<DateOptions> = DefaultDateOptions): Randomator<Date> {
  options = Object.assign({}, DefaultDateOptions, options);
  const max = +options.max;
  return now.map(min => integers({ max, min })).map(i => new Date(i));
}
