export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

/**
 * Randomator class
 */
export class Randomator<T = unknown> extends Function implements Iterable<T> {
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
    const call = () => Randomator.unwrap(generate());
    return Object.setPrototypeOf(call, new.target.prototype);
  }

  *[Symbol.iterator](): Iterator<T> {
    for (;;) {
      yield Randomator.unwrap(this());
    }
  }

  /**
   * Returns a random value
   *
   * @returns
   */
  next(): T {
    return this();
  }

  /**
   * Maps random values
   *
   * @param mapper
   * @returns
   */
  map<U>(mapper: (_: T) => MaybeRandomator<U>): Randomator<U> {
    return new Randomator(() => mapper.call(this, this()));
  }

  /**
   * chain
   *
   * @param mapper
   * @returns
   */
  chain<U>(mapper: (_: T) => MaybeRandomator<U>): U {
    return Randomator.unwrap(mapper.call(this, this()));
  }

  /**
   * pipe
   *
   * @param mapper
   * @returns
   */
  pipe<U>(mapper: (_: this) => MaybeRandomator<U>): Randomator<U> {
    return new Randomator(() => mapper.call(this, this));
  }

  /**
   * Filters random values
   *
   * @param predicate
   * @returns
   */
  filter(predicate: (_: T) => boolean): Randomator<T> {
    return new Randomator(() => {
      let next = this();
      while (!predicate(next)) {
        next = this();
      }
      return next;
    });
  }

  /**
   * toArray
   *
   * @param length - length of the resulting array
   * @returns
   */
  toArray(length: number): Array<T> {
    return Array.from({ length }, () => this());
  }
}

export interface Randomator<T> {
  (): T;
}
