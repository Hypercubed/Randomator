import { MappingFunction } from '../symbols.js';
import { unwrap } from '../internal/unwrap.js';
import { pipeFromArray } from '../internal/pipe.js';

import type { MaybeRandomator, Pipe } from '../types.js';
import type { Randomator } from '../randomator.js';

/**
 * Applies a given `mapper` function to each value
 *
 * @param mapper
 * @returns
 */
export function map<T, R>(mapper: (value: T) => MaybeRandomator<R>, thisArg?: unknown): Pipe<T, R> {
  return source => {
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
  return source => {
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

export function repeatOf<R>(len: MaybeRandomator<number>): Pipe<R, R[]> {
  if (typeof len === 'number') {
    return source => {
      return source.lift(() => {
        const arr = Array.from({ length: len }).fill(source);
        return arr.map(unwrap) as R[];
      });
    };
  }

  return source => {
    return len.pipe(
      map((length: number) => {
        const arr = Array.from({ length }).fill(source);
        return arr.map(unwrap) as R[];
      })
    );
  };
}

export function join(separator = ''): Pipe<unknown[], string> {
  return map(arr => arr.join(separator));
}

export function pipe<R>(...ops: []): Pipe<unknown, R>;
export function pipe<R>(...ops: [...Pipe<unknown, unknown>[], Pipe<unknown, R>]): Pipe<unknown, R>;
export function pipe<R>(...ops: Pipe<unknown, unknown>[]): Pipe<unknown, R>;
export function pipe<R>(...ops: Pipe[]): Pipe<unknown, R> {
  return pipeFromArray(ops);
}

export function repeatBy(len: MaybeRandomator<number>, options = { separator: '' }): Pipe<unknown, string> {
  const { separator = '' } = options;
  return pipe(repeatOf(len), join(separator));
}
