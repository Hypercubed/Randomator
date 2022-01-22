export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

/**
 * Randomator class
 */
export class Randomator<T = unknown> {
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
    const chain = () => this.chain(mapper) as U;
    return new Randomator(chain);
  }

  /**
   * Chain
   *
   * @param mapper
   * @returns
   */
  chain<U>(mapper: (_: T) => U): U {
    return mapper.call(this, this.next());
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
