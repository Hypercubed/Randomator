/* istanbul ignore file */

import { repeat } from '../operators/core';
import { Randomator } from '../randomator';
import { integers } from './numbers';

const zalgoChar$ = integers({ min: 0x300, max: 0x36f }).map(String.fromCharCode);

export function zalgos(intensity: number): Randomator<string> {
  return Randomator.from(intensity).map((l: number) => repeat(zalgoChar$, l));
}

export function zalgoify(str: string, intensity: number): string {
  const zalgo$ = zalgos(intensity);
  return str
    .split('')
    .map(c => {
      return c + zalgo$.next();
    })
    .join('');
}
