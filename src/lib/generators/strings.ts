import { oneOf, repeat, seq } from '../operators/core';
import { integers } from './numbers';
import { MaybeRandomator, Randomator } from '../randomator';
import { capitalize, initOptions } from '../utils';

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

export const lcase = chars(LCASE);
export const ucase = chars(UCASE);
export const hexa = chars('0123456789abcdef');

const DefaultStringOptions = {
  chars: chars() as MaybeRandomator<string>,
  length: integers({ min: 5, max: 20 }) as MaybeRandomator<number>
};

/**
 * Generates a random string
 *
 * @param options
 * @returns
 */
export function strings(options: Partial<typeof DefaultStringOptions> = DefaultStringOptions): Randomator<string> {
  const { chars: _chars, length } = initOptions(options, DefaultStringOptions);
  return Randomator.from(length).map((l: number) => repeat(_chars, l));
}

const DefaultWordOptions = {
  strings: strings({ chars: chars(LCASE), length: integers({ min: 1, max: 12 }) })
};

/**
 * Generates a random word
 *
 * @param options
 * @returns
 */
export function words(options: Partial<typeof DefaultWordOptions> = DefaultWordOptions): Randomator<string> {
  const { strings: _strings } = initOptions(options, DefaultWordOptions);
  return oneOf([_strings, _strings.map(capitalize)]);
}

const DefaultSentenceOptions = {
  words: words(),
  length: integers({ min: 12, max: 18 }),
  punctuation: chars('!?.')
};

/**
 * Generates a random sentence
 *
 * @param options
 * @returns
 */
export function sentences(
  options: Partial<typeof DefaultSentenceOptions> = DefaultSentenceOptions
): Randomator<string> {
  const { words: _words, length, punctuation } = initOptions(options, DefaultSentenceOptions);
  const w = Randomator.from(length).map((l: number) => repeat(_words, l, { separator: ' ' }));
  return seq([w.map(capitalize), punctuation]);
}

const DefaultParagraphOptions = {
  sentences: sentences(),
  length: integers({ min: 3, max: 7 }) as MaybeRandomator<number>
};

/**
 * Generates a random paragraph
 *
 * @param options
 * @returns
 */
export function paragraphs(
  options: Partial<typeof DefaultParagraphOptions> = DefaultParagraphOptions
): Randomator<string> {
  const { sentences: _sentences, length } = initOptions(options, DefaultParagraphOptions);
  return Randomator.from(length).map((l: number) => repeat(_sentences, l, { separator: ' ' }));
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
