import { oneOf, seq } from '../operators/core.js';
import { integers } from './numbers.js';
import { Randomator } from '../randomator.js';
import { capitalize, getOptions } from '../utils.js';
import { CHARS, LCASE, PUNCTUATION } from './strings.constants.js';
import { map, repeatBy } from '../operators/pipeable.js';
import { MaybeRandomator } from '../types.js';

const CharDefaults = {
  pool: CHARS
};

/**
 * Generates a random character
 *
 * @param options
 * @returns
 */
export function chars(options?: Partial<typeof CharDefaults>): Randomator<string> {
  const { pool } = getOptions(CharDefaults, options);
  return oneOf(pool.split(''));
}

const StringDefaults = {
  chars: chars(),
  length: integers({ min: 5, max: 20 }) as MaybeRandomator<number>
};

/**
 * Generates a random string
 *
 * @param options
 * @returns
 */
export function strings(options?: Partial<typeof StringDefaults>): Randomator<string> {
  // eslint-disable-next-line prefer-const
  let { chars: char$, length } = getOptions(StringDefaults, options);
  return char$.pipe(repeatBy(length));
}

const WordDefaults = {
  strings: strings({
    chars: chars({ pool: LCASE }),
    length: integers({ min: 1, max: 12 }) as MaybeRandomator<number>
  })
};

/**
 * Generates a random word
 *
 * @param options
 * @returns
 */
export function words(options?: Partial<typeof WordDefaults>): Randomator<string> {
  // eslint-disable-next-line prefer-const
  let { strings: string$ } = getOptions(WordDefaults, options);
  return oneOf([string$, string$.pipe(map(capitalize))]);
}

const SentenceDefaults = {
  words: words(),
  length: integers({ min: 12, max: 18 }) as MaybeRandomator<number>,
  punctuation: chars({ pool: PUNCTUATION })
};

/**
 * Generates a random sentence
 *
 * @param options
 * @returns
 */
export function sentences(options?: Partial<typeof SentenceDefaults>): Randomator<string> {
  const { words: word$, length, punctuation } = getOptions(SentenceDefaults, options);
  const w = word$.pipe(repeatBy(length, { separator: ' ' }), map(capitalize));
  return seq([w, punctuation]);
}

const ParagraphDefaults = {
  sentences: sentences(),
  length: integers({ min: 3, max: 7 }) as MaybeRandomator<number>
};

/**
 * Generates a random paragraph
 *
 * @param options
 * @returns
 */
export function paragraphs(options?: Partial<typeof ParagraphDefaults>): Randomator<string> {
  const { sentences: sentence$, length } = getOptions(ParagraphDefaults, options);
  return sentence$.pipe(repeatBy(length, { separator: ' ' }));
}
