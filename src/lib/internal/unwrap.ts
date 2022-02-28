import type { MaybeRandomator } from '../types';

export function unwrap<U>(x: MaybeRandomator<U>): U {
  while (x instanceof Function) {
    x = x();
  }
  return x;
}
