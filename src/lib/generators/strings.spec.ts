import '../setupJest';

import { oneOf } from '../operators/core';
import { integer } from './random';
import { char, paragraph, pattern, sentence, string, uuid, word } from './strings';

test('char', () => {
  const ch = char();
  expect(typeof ch.value()).toBe('string');
  expect(ch.value()).toHaveLength(1);

  expect(ch).forMany(v => {
    expect(v).toHaveLength(1);
    expect(v).toMatch(/^[a-zA-Z0-9!@#$%^&*()]$/);
  });

  const ab = char('ab');
  expect(ab).forMany(v => {
    expect(v).toMatch(/^[ab]$/);
  });
  expect(ab).toPassFreqTest(['a', 'b']);

  const abc = char('abc');
  expect(abc).forMany(v => {
    expect(v).toMatch(/^[abc]$/);
  });
  expect(abc).toPassFreqTest(['a', 'b', 'c']);
});

test('string', () => {
  const s = string();
  expect(s).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-zA-Z\d!@#$%^&*()]{5,20}$/);
  });

  const ab = string({ chars: char('ab'), length: 2 });
  expect(ab).forMany(v => {
    expect(v).toMatch(/^[ab][ab]$/);
  });
  expect(ab).toPassFreqTest(['aa'], [1 / 4], 3);

  const ss = string({ chars: char('abc'), length: integer({ min: 3, max: 6 }) });
  expect(ss).forMany(v => {
    expect(v).toMatch(/^[abc]{3,6}$/);
  });

  const sss = integer({ min: 3, max: 6 }).map(length => string({ length, chars: char('abc') }));
  expect(sss).forMany(v => {
    expect(v).toMatch(/^[abc]{3,6}$/);
  });
  expect(sss).toPassFreqTest(['aaa'], [((((((1 / 4) * 1) / 3) * 1) / 3) * 1) / 3], 2);
});

test('word', () => {
  expect(word()).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-zA-Z][a-z]{0,11}$/);
  });

  const strings = string({ chars: char('abc'), length: integer({ min: 3, max: 5 }) });

  expect(word({ strings })).forMany(v => {
    expect(v).toMatch(/^[a-cA-C][a-c]{2,5}$/);
  });
});

test('sentence', () => {
  expect(sentence()).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[A-Z][a-zA-Z ]+[a-zA-Z][.!?]$/);
  });
});

test('paragraph', () => {
  expect(paragraph()).forMany(v => {
    expect(typeof v).toBe('string');
    // eslint-disable-next-line security/detect-unsafe-regex
    expect(v).toMatch(/^([A-Z][a-zA-Z ]+[a-zA-Z][.!?] ?){3,7}$/);
  });
});

test('pattern', () => {
  expect(pattern('___-^^^-###')).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-z]{3}-[A-Z]{3}-[0-9]{3}$/);
  });

  const phoneNumber = oneOf([
    pattern('!##-!##-####'),
    pattern('(!##) !##-####'),
    pattern('1-!##-!##-####'),
    pattern('!##-!##-#### ####'),
    pattern('(!##) !##-#### ####'),
    pattern('1-!##-!##-#### ####')
  ]);

  expect(phoneNumber).forMany(v => {
    expect(v).toMatch(/^[()0-9- ]+$/);
  });
});

test('uuid', () => {
  expect(uuid()).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  });

  expect(uuid(3)).forMany(v => {
    expect(v).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-3[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  });
});
