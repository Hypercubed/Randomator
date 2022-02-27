import type { Randomator } from './randomator.js';

export type MaybeRandomator<T = unknown> = T | Randomator<MaybeRandomator<T>>;
export type GenerateFunction<T> = () => T;

export type Pipe<T = unknown, R = unknown> = (source: Randomator<T>) => Randomator<R>;

export interface UnaryFunction<T, R> {
  (source: T): R;
}

export type Rng = () => number;
