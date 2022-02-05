export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

class ExtensibleFunction<T = unknown> extends Function {
  constructor(f: GenerateFunction<T>) {
    super();
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}

/**
 * Randomator class
 */
export class Randomator<T = unknown> extends ExtensibleFunction implements Iterable<T> {
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

  constructor(private readonly generate: GenerateFunction<T>) {
    super(() => {
      return Randomator.unwrap(this.generate());
    });
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
  next = (): T => {
    return this();
  };

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
   * apply
   *
   * @param mapper
   * @returns
   */
  nmap<U>(mapper: (_: T) => MaybeRandomator<U>): U {
    return Randomator.unwrap(mapper.call(this, this()));
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
      let next = this();
      while (!predicate(next)) {
        next = this();
      }
      return next;
    });
  }

  toArray(length: number): Array<T> {
    return Array.from({ length }, () => this());
  }
}
