import { oneOf, repeat, seq } from '../operators/core';
import { integers } from './numbers';
import { MaybeRandomator, Randomator } from '../randomator';
import { capitalize, checkOptions } from '../utils';
import { ALPHA, ALPHANUM, CHARS, HEX_CHARS, LCASE, PUNCTUATION, UCASE } from './strings.constants';

//TODO: rng
interface CharOptions {
  pool?: string;
}

/**
 * Generates a random character
 *
 * @param options
 * @returns
 */
export function chars(options: CharOptions = {}): Randomator<string> {
  checkOptions(['pool'], options);
  const { pool = CHARS } = options;
  return oneOf(pool.split(''));
}

interface StringOptions {
  chars?: Randomator<string>;
  length?: MaybeRandomator<number>;
}

/**
 * Generates a random string
 *
 * @param options
 * @returns
 */
export function strings(options: StringOptions = {}): Randomator<string> {
  checkOptions(['chars', 'length'], options);
  const { chars: char$ = chars(), length = integers({ min: 5, max: 20 }) } = options;
  return Randomator.from(length).map((l: number) => repeat(char$, l));
}

interface WordOptions {
  strings?: Randomator<string>;
}

/**
 * Generates a random word
 *
 * @param options
 * @returns
 */
export function words(options: WordOptions = {}): Randomator<string> {
  checkOptions(['strings', 'length'], options);
  const {
    strings: string$ = strings({ chars: chars({ pool: LCASE }), length: integers({ min: 1, max: 12 }) })
  } = options;
  return oneOf([string$, string$.map(capitalize)]);
}

interface SentenceOptions {
  words?: Randomator<string>;
  length?: MaybeRandomator<number>;
  punctuation?: MaybeRandomator<string>;
}

/**
 * Generates a random sentence
 *
 * @param options
 * @returns
 */
export function sentences(options: SentenceOptions = {}): Randomator<string> {
  checkOptions(['words', 'length', 'punctuation'], options);
  const {
    words: word$ = words(),
    length = integers({ min: 12, max: 18 }),
    punctuation = chars({ pool: PUNCTUATION })
  } = options;
  const w = Randomator.from(length).map((l: number) => repeat(word$, l, { separator: ' ' }));
  return seq([w.map(capitalize), punctuation]);
}

interface ParagraphOptions {
  sentences?: Randomator<string>;
  length?: MaybeRandomator<number>;
}

/**
 * Generates a random paragraph
 *
 * @param options
 * @returns
 */
export function paragraphs(options: ParagraphOptions = {}): Randomator<string> {
  checkOptions(['sentences', 'length'], options);
  const { sentences: sentence$ = sentences(), length = integers({ min: 3, max: 7 }) } = options;
  return Randomator.from(length).map((l: number) => repeat(sentence$, l, { separator: ' ' }));
}

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

const lcase = chars({ pool: LCASE });
const ucase = chars({ pool: UCASE });
const hexa = chars({ pool: HEX_CHARS });

const MAP = {
  _: lcase, // a random lower case letter
  a: lcase, // a random lower case letter
  x: hexa, // a random hexadecimal character
  y: chars({ pool: '89ab' }), // a random character from the set 89ab
  '^': ucase, // a random upper case letter
  A: ucase, // a random upper case letter
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
