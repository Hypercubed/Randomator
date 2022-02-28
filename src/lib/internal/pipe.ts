import type { Randomator } from '../randomator';
import type { Pipe } from '../types';

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
