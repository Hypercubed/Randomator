import { Randomator } from '../randomator';
import type { GenerateFunction, MaybeRandomator, Pipe } from '../types';

export function pipeFromArray<T, U>(ops: Array<Pipe<T, unknown>>): Pipe<T, U> {
  if (ops.length === 0) {
    return ((_: Pipe<T, unknown>) => _) as unknown as Pipe<T, U>;
  }
  if (ops.length === 1) {
    return ops[0] as Pipe<T, U>;
  }
  return (source: Randomator<T>) => {
    return ops.reduce((acc, fn) => fn(acc) as unknown, source) as Randomator<U>;
  };
}

export function unwrap<U>(x: MaybeRandomator<U>): U {
  while (x instanceof Randomator) {
    x = x();
  }
  return x;
}

export function from<U>(x: U | Randomator<U> | GenerateFunction<U>): Randomator<U> {
  if (x instanceof Randomator) {
    return x;
  }
  if (typeof x === 'function') {
    return new Randomator(x as GenerateFunction<U>);
  }
  return new Randomator(() => x);
}
