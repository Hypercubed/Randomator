export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

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
    call[Symbol.toStringTag] = `${this.constructor.name}(${generate.toString()})`;
    return Object.setPrototypeOf(call, new.target.prototype);

    // Cleaner but slower
    // this[Symbol.toStringTag] = `${this.constructor.name}(${generate.toString()})`;
    // return new Proxy(this, {
    //   apply: () => Randomator.unwrap(generate())
    // });
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

  /**
   * Returns a new Randomator with mapped values
   *
   * @param mapping function
   * @returns
   */
  map<U>(mapping: (_: T) => MaybeRandomator<U>): Randomator<U> {
    return new Randomator(() => mapping.call(this, this()));
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
   * Returns a new Randomator based on the pipe
   *
   * @param mapper
   * @returns
   */
  pipe<U>(mapper: (_: this) => MaybeRandomator<U>): Randomator<U> {
    return new Randomator(() => mapper.call(this, this));
  }

  /**
   * Returns a new Randomator with that returns only values that pass the predicate
   *
   * @param predicate
   * @returns
   */
  filter(predicate: (_: T) => boolean): Randomator<T> {
    return new Randomator(() => {
      let next = this();
      while (!predicate.call(this, next)) {
        next = this();
      }
      return next;
    });
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
