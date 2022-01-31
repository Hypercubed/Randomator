import type { MaybeRandomator } from '../randomator.js';

import { Randomator } from '../randomator.js';
import { integers, numbers } from '../generators/numbers.js';

/**
 * Generates a random value from within the given array
 *
 * @param arr
 * @returns
 */
export function oneOf<T>(arr: MaybeRandomator<T>[]): Randomator<T> {
  return integers({ max: arr.length - 1 }).map(i => arr[i]);
}

/**
 * Generates a random value from within the given array using the given weights
 *
 * @param arr
 * @param weights
 * @returns
 */
export function weighted<T>(arr: MaybeRandomator<T>[], weights: number[]): Randomator<T> {
  const sum = weights.reduce((acc, v) => acc + v, 0);
  return numbers().map(n => {
    const s = n * sum;
    let t = 0;
    let idx = weights.findIndex(w => s < (t += w));

    /* istanbul ignore next */
    if (idx === -1) idx = weights.length - 1;
    return arr[idx];
  });
}

/**
 * Generates an scrambled array
 *
 * @param arr
 * @returns
 */
export function shuffle<T>(arr: MaybeRandomator<T>[]): Randomator<T[]> {
  return new Randomator<T[]>(() => {
    const a = arr.slice();
    let l = a.length;
    while (l) {
      const idx = Math.floor(Math.random() * l--);
      const t = a[l];
      a[l] = a[idx];
      a[idx] = t;
    }
    return a.map(Randomator.unwrap);
  });
}

/**
 * Generates len unique values form the given randomator
 *
 * @param arg
 * @param length
 * @returns
 */
export function unique<T>(arg: Randomator<T>, length: number): Randomator<T[]> {
  return new Randomator(() => {
    const r = [];
    let MAX = length * 50;
    while (r.length < length) {
      const v = Randomator.unwrap(arg);
      if (r.indexOf(v) < 0) {
        r.push(v);
        MAX = length * 50;
      }
      MAX--;

      if (MAX === 0) {
        throw new RangeError(`Couldn't find ${length} unique items from given Randomator`);
      }
    }
    return r;
  });
}

/**
 * Generates a random record
 *
 * @param obj
 * @returns
 */
export function record<T>(obj: Record<string, MaybeRandomator<T>>): Randomator<Record<string, T>> {
  const keys = Object.keys(obj);
  return new Randomator(() => {
    return keys.reduce((acc, key: string) => {
      acc[key] = Randomator.unwrap(obj[key]);
      return acc;
    }, {});
  });
}

/**
 * Generates a random object
 *
 * @param obj
 * @returns
 */
export function object<T>(obj: Record<string, MaybeRandomator<T>>): Randomator<Record<string, T>> {
  return new Randomator(() => process(obj));
  // TODO: max depth
  // TODO: optimize

  function process(_obj: Record<string, MaybeRandomator<T>>): Record<string, T> {
    return Object.keys(_obj).reduce((acc, key: string) => {
      acc[key] = Randomator.unwrap(_obj[key]);
      if (typeof acc[key] === 'object') {
        acc[key] = process(acc[key]);
      }
      return acc;
    }, {});
  }
}

/**
 * Generates an tuple of items
 *
 * @param args
 * @returns
 */
export function tuple<T>(args: MaybeRandomator<T>[]): Randomator<T[]> {
  return new Randomator(() => args.map(Randomator.unwrap));
}

function join<T>(arg: Randomator<T[]>, { separator }): Randomator<string> {
  return arg.map(arr => arr.map(String).join(separator || ''));
}

/**
 * Generates a random string like from the given sequence
 *
 * @param args
 * @param opts
 * @returns
 */
export function seq(args: MaybeRandomator[], opts = { separator: '' }): Randomator<string> {
  return join(tuple(args), opts);
}

/**
 * Generates a array of random items
 *
 * @param arg
 * @param len
 * @returns
 */
export function array<T>(arg: MaybeRandomator<T>, length: number): Randomator<T[]> {
  const arr = Array.from({ length }).fill(arg) as MaybeRandomator<T>[];
  return tuple(arr);
}

/**
 * Generates a string of len items
 *
 * @param arg
 * @param len
 * @param opts
 * @returns
 */
export function repeat<T>(arg: MaybeRandomator<T>, len: number, opts = { separator: '' }): Randomator<string> {
  return join(array(arg, len), opts);
}

/**
 * A template tag function for creating a random string from the given sequence
 *
 * @param strings
 * @param args
 * @returns
 */
export function randomator(strings: TemplateStringsArray | string[], ...args: MaybeRandomator[]): Randomator<string> {
  const result: (MaybeRandomator | string)[] = strings[0] ? [strings[0]] : [];
  args.forEach((arg, i) => {
    result.push(arg);
    if (strings[i + 1]) {
      result.push(strings[i + 1]);
    }
  });
  return seq(result);
}

// TODO: set
// TODO: `distinct` - returns a randomator with previously generated values filtered out
// TODO: `cycle(n)` - returns a randomator that will repeat the same value n times
// TODO: `iif(b, t, f)` - returns a randomator that will return a value from `t` if the value from `b` truthy, otherwise a value from `f`
// TODO: `orElse(a, b)` - returns a randomator that will return a value from `a` if the value truthy, otherwise a value from `b`
