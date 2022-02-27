export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

const MappingFunction = Symbol('randomator:mapping');
const GeneratorFunction = Symbol('randomator:mapping');

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
    call[GeneratorFunction] = generate;
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

  /**
   * Returns a new Randomator with mapped values
   *
   * @param mapping function
   * @returns
   */
  map<U>(mapping: (_: T) => MaybeRandomator<U>): Randomator<U> {
    const randomator = new Randomator(() => mapping.call(this, this()));
    randomator[MappingFunction] = mapping;
    return randomator;
  }

  /**
   * Returns a new Randomator from a mapped Randomator whose source is now this Randomator
   *
   * @param mapper a Randomator
   * @returns
   */
  switchMap<U>(mapper: Randomator<U>): Randomator<U> {
    const mapping = mapper[MappingFunction];
    if (!mapping) {
      throw new Error('switchMap requires a mapped Randomator');
    }
    return this.map(mapping);
  }

  /**
   * Returns a random value, whose initial value (pre-mapped) is now the passed value
   *
   * @param value A value
   * @returns
   */
  ap<U>(value: unknown): U {
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
