import { oneOf, repeat, seq } from '../operators/core.js';
import { integers } from './numbers.js';
import { MaybeRandomator, Randomator } from '../randomator.js';
import { capitalize, checkOptions } from '../utils.js';
import {  CHARS, LCASE, PUNCTUATION } from './strings.constants.js';

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
  const { strings: string$ = strings({ chars: chars({ pool: LCASE }), length: integers({ min: 1, max: 12 }) }) } =
    options;
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
