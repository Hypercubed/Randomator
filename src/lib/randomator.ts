export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

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

  constructor(private _value: GenerateFunction<T>) {}

  get $(): GenerateFunction<T> {
    return this.value.bind(this);
  }

  value(): T {
    let x = this._value();
    while (x instanceof Randomator) {
      x = x.value();
    }
    return x;
  }

  map<U>(mapper: (_: T) => MaybeRandomator<U>): Randomator<U> {
    return new Randomator(() => Randomator.unwrap(mapper(this.value())));
  }

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
