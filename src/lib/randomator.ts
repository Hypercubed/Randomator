export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

/**
 * Randomator class
 */
export class Randomator<T = unknown> implements Iterable<T> {
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
      x = x.next();
    }
    return x;
  }

  static get [Symbol.species](): typeof Randomator {
    return this;
  }

  constructor(private readonly generate: GenerateFunction<T>) {}

  *[Symbol.iterator]() {
    for (;;) {
      yield this.next();
    }
  }

  /**
   * Returns a random value
   *
   * @returns
   */
  next = (): T => {
    return Randomator.unwrap(this.generate());
  };

  /**
   * Maps random values
   *
   * @param mapper
   * @returns
   */
  map<U>(mapper: (_: T) => MaybeRandomator<U>): Randomator<U> {
    return new Randomator(() => mapper.call(this, this.next()));
  }

  /**
   * apply
   *
   * @param mapper
   * @returns
   */
  apply<U>(mapper: (_: T) => MaybeRandomator<U>): U {
    return Randomator.unwrap(mapper.call(this, this.next()));
  }

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
      let next = this.next();
      while (!predicate(next)) {
        next = this.next();
      }
      return next;
    });
  }
}
