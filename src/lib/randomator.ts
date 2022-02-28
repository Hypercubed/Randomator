import { filter, map, switchMap } from './operators/pipeable.js';
import { MappingFunction } from './symbols.js';

import type { GenerateFunction, MaybeRandomator, Pipe } from './types.js';

/**
 * Randomator class
 */
export class Randomator<T = unknown> extends Function implements Iterator<T> {
  static from<U>(x: U | Randomator<U> | GenerateFunction<U>): Randomator<U> {
    if (x instanceof Randomator) {
      return x;
    }
    if (typeof x === 'function') {
      return new Randomator(x as GenerateFunction<U>);
    }
    return new Randomator(() => x);
  }

  static unwrap<U>(x: MaybeRandomator<U>): U {
    while (x instanceof Randomator) {
      x = x();
    }
    return x;
  }

  static get [Symbol.species](): typeof Randomator {
    return this;
  }

  constructor(generate: GenerateFunction<T>) {
    super();

    // Optimized for call site performance
    const call = () => Randomator.unwrap(generate());
    call[MappingFunction] = undefined;
    call[Symbol.toStringTag] = `${this.constructor.name}(${generate.toString()})`;
    return Object.setPrototypeOf(call, new.target.prototype);
  }

  [Symbol.iterator](): Iterator<T> {
    return this;
  }

  /**
   * Returns a random value as a iterator object
   *
   * @returns
   */
  next(): IteratorYieldResult<T> {
    return {
      value: this(),
      done: false
    };
  }

  lift<U>(generate: GenerateFunction<U>): Randomator<U> {
    return new Randomator(generate);
  }

  /**
   * Returns a new Randomator based on the pipe
   *
   * @param mapper
   * @returns
   */
  pipe<U>(...fns: []): Randomator<U>;
  pipe<U>(...fns: [...Pipe<T, unknown>[], Pipe<T, U>]): Randomator<U>;
  pipe<U>(...fns: Array<Pipe<T, unknown>>): Randomator<U> {
    if (fns.length === 0) {
      return this as unknown as Randomator<U>;
    }
    if (fns.length === 1) {
      return fns[0](this) as Randomator<U>;
    }
    return fns.reduce((acc, fn) => fn(acc) as unknown, this) as Randomator<U>;
  }

  /**
   * Returns a new Randomator with mapped values
   *
   * @param mapping function
   * @returns
   */
  map<U>(mapping: (_: T) => MaybeRandomator<U>): Randomator<U> {
    return this.pipe(map(mapping));
  }

  /**
   * Returns a new Randomator with that returns only values that pass the predicate
   *
   * @param predicate
   * @returns
   */
  filter(predicate: (_: T) => boolean): Randomator<T> {
    return this.pipe(filter(predicate));
  }

  /**
   * Returns a new Randomator from a mapped Randomator whose source is now this Randomator
   *
   * @param mapper a Randomator
   * @returns
   */
  switchMap<U>(mapper: Randomator<U>): Randomator<U> {
    return this.pipe(switchMap(mapper));
  }

  /**
   * Returns a random value, whose initial value (pre-mapped) is now the passed value
   *
   * @param value A value
   * @returns
   */
  ap(value: unknown): T {
    const mapping = this[MappingFunction];
    if (!mapping) {
      throw new Error('ap can only be called on a mapped Randomator');
    }
    return Randomator.unwrap(mapping.call(this, value));
  }

  /**
   * Returns a random value, possibly mapped over a mapping function
   *
   * @param optional mapping function
   * @returns
   */
  fold<U>(mapping?: (_: T) => MaybeRandomator<U>): U {
    const value = this();
    return Randomator.unwrap(mapping ? mapping.call(this, value) : value);
  }

  /**
   * Returns an array of random values
   *
   * @param length - length of the resulting array
   * @returns
   */
  toArray(length: number): Array<T> {
    return Array.from({ length }, () => this());
  }

  toString(): string {
    return this[Symbol.toStringTag] || '[Function: bound] Randomator';
  }
}

export interface Randomator<T> {
  (): T;
}
