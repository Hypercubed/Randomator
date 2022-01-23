import { oneOf, repeat, seq } from '../operators/core';
import { integers } from './numbers';
import { MaybeRandomator, Randomator } from '../randomator';
import { capitalize } from '../utils';

const LCASE = 'abcdefghijklmnopqrstuvwxyz';
const UCASE = LCASE.toUpperCase();
const DIGITS = '0123456789';
const CHARS = `${LCASE}${UCASE}${DIGITS}!@#$%^&*()`;

/**
 * Generates a random character
 *
 * @param options
 * @returns
 */
export function chars(characters: string = CHARS): Randomator<string> {
  return oneOf(characters.split(''));
}

interface StringOptions {
  chars?: MaybeRandomator<string>;
  length?: MaybeRandomator<number>;
}

/**
 * Generates a random string
 *
 * @param options
 * @returns
 */
export function strings({
  chars: char$ = chars(),
  length = integers({ min: 5, max: 20 })
}: StringOptions = {}): Randomator<string> {
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
export function words({
  strings: string$ = strings({ chars: chars(LCASE), length: integers({ min: 1, max: 12 }) })
}: WordOptions = {}): Randomator<string> {
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
export function sentences({
  words: word$ = words(),
  length = integers({ min: 12, max: 18 }),
  punctuation = chars('!?.')
}: SentenceOptions = {}): Randomator<string> {
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
export function paragraphs({
  sentences: sentence$ = sentences(),
  length = integers({ min: 3, max: 7 })
}: ParagraphOptions = {}): Randomator<string> {
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

const lcase = chars(LCASE);
const ucase = chars(UCASE);
const hexa = chars('0123456789abcdef');

const MAP = {
  _: lcase,
  a: lcase,
  x: hexa,
  y: chars('89ab'),
  '^': ucase,
  A: ucase,
  '0': integers(),
  '#': integers(),
  '!': integers({ max: 9, min: 1 }),
  '?': chars(LCASE + UCASE),
  '*': chars(LCASE + UCASE + DIGITS)
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
