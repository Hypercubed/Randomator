export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

/**
 * Randomator class
 */
export class Randomator<T = unknown> {
  static from<U>(x: U | Randomator<U> | (() => U)): Randomator<U> {
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
      x = x.value();
    }
    return x;
  }

  constructor(private _value: GenerateFunction<T>) {
    this.value = this.value.bind(this);
  }

  /**
   * Returns a random value
   * 
   * @returns 
   */
  value(): T {
    let x = this._value();
    while (x instanceof Randomator) {
      x = x.value();
    }
    return x;
  }

  /**
   * Maps random values
   * 
   * @param mapper 
   * @returns 
   */
  map<U>(mapper: (_: T) => MaybeRandomator<U>): Randomator<U> {
    return new Randomator(() => Randomator.unwrap(mapper(this.value())));
  }

  /**
   * Filters random values
   *
   * @param predicate 
   * @returns 
   */
  filter(predicate: (_: T) => boolean): Randomator<T> {
    return new Randomator(() => {
      let next = this.value();
      while (!predicate(next)) {
        next = this.value();
      }
      return next;
    });
  }
}
