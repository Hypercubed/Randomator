import { seq } from '../operators';
import { MaybeRandomator, Randomator } from '../randomator';
import { integers } from './numbers';
import { chars } from './strings';
import { ALPHA, ALPHANUM, HEX_CHARS, LCASE, UCASE } from './strings.constants';

/**
 * Generates a random string using a pattern
 *
 * @param pat
 * @param mapper
 * @returns
 */
export function pattern(pat: string, mapper: Record<string, MaybeRandomator> = MAP): Randomator<string> {
  const arr: MaybeRandomator[] = pat.split('').map(c => {
    return mapper[c] || c;
  });
  return seq(arr);
}

const lcase$ = chars({ pool: LCASE });
const ucase$ = chars({ pool: UCASE });
const hexa$ = chars({ pool: HEX_CHARS });
const uhexa$ = chars({ pool: HEX_CHARS.toUpperCase() });

const MAP = {
  _: lcase$, // a random lower case letter
  a: lcase$, // a random lower case letter
  x: hexa$, // a random hexadecimal character
  X: uhexa$, // a random uppercase hexadecimal character
  y: chars({ pool: '89ab' }), // a random character from the set 89ab
  '^': ucase$, // a random upper case letter
  A: ucase$, // a random upper case letter
  '0': integers(), // a random digit
  '#': integers(), // a random digit
  '!': integers({ max: 9, min: 1 }), // a random digit excluding 0
  '?': chars({ pool: ALPHA }), // a random alpha character
  '*': chars({ pool: ALPHANUM }) // a random alphanumeric character
};

/**
 * Generates a random uuid
 *
 * @param version
 * @returns
 */
export function uuids(version: MaybeRandomator<number> = integers({ min: 1, max: 5 })): Randomator<string> {
  return Randomator.from(version).map(v => pattern(`xxxxxxxx-xxxx-${v}xxx-yxxx-xxxxxxxxxxxx`));
}

// TODO: test
// export const ipv6s = () => pattern('xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx');
// export const macs = () => pattern('XX:XX:XX:XX:XX:XX');
