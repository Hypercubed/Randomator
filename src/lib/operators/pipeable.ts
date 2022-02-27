import { MappingFunction } from '../symbols.js';

import type { Randomator } from '../randomator.js';
import type { MaybeRandomator, Pipe } from '../types.js';

/**
 * Applies a given `mapper` function to each value
 *
 * @param mapper
 * @returns
 */
export function map<T, R>(mapper: (value: T) => MaybeRandomator<R>, thisArg?: unknown): Pipe<T, R> {
  return (source: Randomator<T>): Randomator<R> => {
    thisArg ||= source;
    const randomator = source.lift(() => mapper.call(thisArg, source()));
    randomator[MappingFunction] = mapper;
    return randomator;
  };
}

/**
 * Filter items emitted the specified predicate.
 *
 * @param predicate
 * @param thisArg
 * @returns
 */
export function filter<T>(predicate: (value: T) => boolean, thisArg?: unknown): Pipe<T, T> {
  return (source: Randomator): Randomator<T> => {
    thisArg ||= source;
    return source.lift(() => {
      let next = source();
      while (!predicate.call(thisArg, next)) {
        next = source();
      }
      return next as T;
    });
  };
}

/**
 * Replaces the source of a mapped randomator with the piped randomator
 *
 * @param mapped
 * @param thisArg
 * @returns
 */
export function switchMap<R>(mapped: Randomator<R>, thisArg?: unknown): Pipe<unknown, R> {
  const mapper = mapped[MappingFunction];
  if (!mapper) {
    throw new Error('switchMap requires a mapped Randomator');
  }
  return map(mapper, thisArg);
}
