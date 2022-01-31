/* eslint-disable @typescript-eslint/no-var-requires */

import { randomator, oneOf } from './operators/core.js';
import { paragraphs, sentences, words } from './generators/strings.js';
import { Randomator } from './randomator.js';

/* Creating a set of "Name" generators similar to faker.name */
const name: Record<string, Randomator<string>> = {};

name.male_first_name = oneOf(require('faker/lib/locales/en/name/male_first_name'));
name.female_first_name = oneOf(require('faker/lib/locales/en/name/female_first_name'));
name.first_name = oneOf(require('faker/lib/locales/en/name/first_name'));
name.last_name = oneOf(require('faker/lib/locales/en/name/last_name'));
name.gender = oneOf(require('faker/lib/locales/en/name/gender'));
name.prefix = oneOf(require('faker/lib/locales/en/name/prefix'));
name.suffix = oneOf(require('faker/lib/locales/en/name/suffix'));

name.name = oneOf([
  randomator`${name.prefix} ${name.first_name} ${name.last_name}`,
  randomator`${name.first_name} ${name.last_name} ${name.suffix}`,
  randomator`${name.first_name} ${name.last_name}`,
  randomator`${name.first_name} ${name.last_name}`,
  randomator`${name.male_first_name} ${name.last_name}`,
  randomator`${name.female_first_name} ${name.last_name}`
]);

test('names', () => {
  expect(name.name).forMany(v => {
    expect(v).toMatch(/^[a-zA-Z .',]+$/);
  });
});

/* Creating a set of "Lorem" generators similar to faker.lorem */
const lorem: Record<string, Randomator<string>> = {};

lorem.word = oneOf(require('faker/lib/locales/en/lorem/words'));

// generates a space separated list of lorem words
lorem.words = words({ strings: lorem.word });

// a sentence of lorem words including punctuation
lorem.sentence = sentences({ words: lorem.words });

// a paragraph of lorem words
lorem.paragraph = paragraphs({ sentences: lorem.sentence });

test('lorum', () => {
  expect(lorem.word).forMany(v => {
    expect(v).toMatch(/^[a-z]{1,16}$/);
  });

  expect(lorem.sentence).forMany(v => {
    // eslint-disable-next-line security/detect-unsafe-regex
    expect(v).toMatch(/^[A-Z][a-zA-Z ]+[a-zA-Z][.?!,;:]$/);
  });

  expect(lorem.paragraph).forMany(v => {
    // eslint-disable-next-line security/detect-unsafe-regex
    expect(v).toMatch(/^([A-Z][a-zA-Z ]+[a-zA-Z][.?!,;:] ?){3,7}$/);
  });
});
