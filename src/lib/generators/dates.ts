import { integers } from './numbers';
import { Randomator } from '../randomator';

const now = Randomator.from(() => new Date().getTime());

const MAX = 8640000000000000;

/**
 * Generates a random date
 *
 * @param constraints
 * @returns
 */
export function dates(constraints?: { min?: Date; max?: Date }): Randomator<Date> {
  const min = constraints && constraints.min !== undefined ? +constraints.min : -MAX;
  const max = constraints && constraints.max !== undefined ? +constraints.max : MAX;
  return integers({ min, max }).map((i: string | number | Date) => new Date(i));
}

/**
 * Generates a random date in the past
 *
 * @param constraints
 * @returns
 */
export function past(constraints?: { min?: Date }): Randomator<Date> {
  const min = constraints && constraints.min !== undefined ? +constraints.min : -MAX;
  return now.map(max => integers({ min, max })).map(i => new Date(i));
}

/**
 * Generates a random date in the future
 *
 * @param constraints
 * @returns
 */
export function future(constraints?: { max?: Date }): Randomator<Date> {
  const max = constraints && constraints.max !== undefined ? +constraints.max : MAX;
  return now.map(min => integers({ min, max })).map(i => new Date(i));
}
