import { Randomator } from '../randomator';
import type { GenerateFunction } from '../types';

export function from<U>(x: U | Randomator<U> | GenerateFunction<U>): Randomator<U> {
  if (x instanceof Randomator) {
    return x;
  }
  if (typeof x === 'function') {
    return new Randomator(x as GenerateFunction<U>);
  }
  return new Randomator(() => x);
}
