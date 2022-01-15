import { oneOf, repeat, seq } from '../operators/core';
import { integer } from './random';
import { MaybeRandomator, Randomator } from '../randomator';
import { capitalize, initOptions } from '../utils';

const LCASE = 'abcdefghijklmnopqrstuvwxyz';
const UCASE = LCASE.toUpperCase();
const DIGITS = '0123456789';
const CHARS = `${LCASE}${UCASE}${DIGITS}!@#$%^&*()`;

/**
 * Generates a random character
 *
 * @param chars
 * @returns
 */
export function char(chars: string = CHARS): Randomator<string> {
  return oneOf(chars.split(''));
}

export const lcase = char(LCASE);
export const ucase = char(UCASE);
export const hexa = char('0123456789abcdef');

const DefaultStringOptions = {
  chars: char() as MaybeRandomator<string>,
  length: integer({ min: 5, max: 20 }) as MaybeRandomator<number>
};

/**
 * Generates a random string
 *
 * @param chars
 * @param len
 * @returns
 */
export function string(options: Partial<typeof DefaultStringOptions> = DefaultStringOptions): Randomator<string> {
  const { chars, length } = initOptions(options, DefaultStringOptions);
  return Randomator.from(length).map((l: number) => repeat(chars, l));
}

const DefaultWordOptions = {
  strings: string({ chars: char(LCASE), length: integer({ min: 1, max: 12 }) })
};

/**
 * Generates a random word
 *
 * @param strings
 * @param len
 * @returns
 */
export function word(options: Partial<typeof DefaultWordOptions> = DefaultWordOptions): Randomator<string> {
  const { strings } = initOptions(options, DefaultWordOptions);
  return oneOf([strings, strings.map(capitalize)]);
}

const DefaultSentenceOptions = {
  words: word(),
  length: integer({ min: 12, max: 18 }),
  punctuation: char('!?.')
};

/**
 * Generates a random sentence
 *
 * @param options
 * @returns
 */
export function sentence(options: Partial<typeof DefaultSentenceOptions> = DefaultSentenceOptions): Randomator<string> {
  const { words, length, punctuation } = initOptions(options, DefaultSentenceOptions);
  const w = Randomator.from(length).map((l: number) => repeat(words, l, { separator: ' ' }));
  return seq([w.map(capitalize), punctuation]);
}

const DefaultParagraphOptions = {
  sentences: sentence(),
  length: integer({ min: 3, max: 7 }) as MaybeRandomator<number>
};

/**
 * Generates a random paragraph
 *
 * @param options
 * @returns
 */
export function paragraph(
  options: Partial<typeof DefaultParagraphOptions> = DefaultParagraphOptions
): Randomator<string> {
  const { sentences, length } = initOptions(options, DefaultParagraphOptions);
  return Randomator.from(length).map((l: number) => repeat(sentences, l, { separator: ' ' }));
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

const MAP = {
  _: lcase,
  a: lcase,
  x: hexa,
  y: char('89ab'),
  '^': ucase,
  A: ucase,
  '0': integer(),
  '#': integer(),
  '!': integer({ max: 9, min: 1 }),
  '?': char(LCASE + UCASE),
  '*': char(LCASE + UCASE + DIGITS)
};

/**
 * Generates a random uuid
 *
 * @param version
 * @returns
 */
export function uuid(version: MaybeRandomator<number> = integer({ min: 1, max: 5 })): Randomator<string> {
  return Randomator.from(version).map(v => pattern(`xxxxxxxx-xxxx-${v}xxx-yxxx-xxxxxxxxxxxx`));
}
