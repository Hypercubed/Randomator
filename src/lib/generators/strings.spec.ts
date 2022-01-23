import '../setupJest';

import { oneOf } from '../operators/core';
import { integers } from './numbers';
import { chars, paragraphs, pattern, sentences, strings, uuids, words } from './strings';

test('chars', () => {
  const ch = chars();
  expect(typeof ch.next()).toBe('string');
  expect(ch.next()).toHaveLength(1);

  expect(ch).forMany(v => {
    expect(v).toHaveLength(1);
    expect(v).toMatch(/^[a-zA-Z0-9!@#$%^&*()]$/);
  });

  const ab = chars({ pool: 'ab' });
  expect(ab).forMany(v => {
    expect(v).toMatch(/^[ab]$/);
  });
  expect(ab).toPassFreqTest(['a', 'b']);

  const abc = chars({ pool: 'abc' });
  expect(abc).forMany(v => {
    expect(v).toMatch(/^[abc]$/);
  });
  expect(abc).toPassFreqTest(['a', 'b', 'c']);
});

test('strings', () => {
  const s = strings();
  expect(s).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-zA-Z\d!@#$%^&*()]{5,20}$/);
  });

  const ab = strings({ chars: chars({ pool: 'ab' }), length: 2 });
  expect(ab).forMany(v => {
    expect(v).toMatch(/^[ab][ab]$/);
  });
  expect(ab).toPassFreqTest(['aa'], [1 / 4], 3);

  const ss = strings({ chars: chars({ pool: 'abc' }), length: integers({ min: 3, max: 6 }) });
  expect(ss).forMany(v => {
    expect(v).toMatch(/^[abc]{3,6}$/);
  });

  const sss = integers({ min: 3, max: 6 }).map(length => strings({ length, chars: chars({ pool: 'abc' }) }));
  expect(sss).forMany(v => {
    expect(v).toMatch(/^[abc]{3,6}$/);
  });
  expect(sss).toPassFreqTest(['aaa'], [((((((1 / 4) * 1) / 3) * 1) / 3) * 1) / 3], 2);
});

test('word', () => {
  expect(words()).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-zA-Z][a-z]{0,11}$/);
  });

  const strs = strings({ chars: chars({ pool: 'abc' }), length: integers({ min: 3, max: 5 }) });

  expect(words({ strings: strs })).forMany(v => {
    expect(v).toMatch(/^[a-cA-C][a-c]{2,5}$/);
  });
});

test('sentence', () => {
  expect(sentences()).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[A-Z][a-zA-Z ]+[a-zA-Z][.?!,;:]$/);
  });
});

test('paragraph', () => {
  expect(paragraphs()).forMany(v => {
    expect(typeof v).toBe('string');
    // eslint-disable-next-line security/detect-unsafe-regex
    expect(v).toMatch(/^([A-Z][a-zA-Z ]+[a-zA-Z][.?!,;:] ?){3,7}$/);
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
  expect(uuids()).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  });

  expect(uuids(3)).forMany(v => {
    expect(v).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-3[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  });
});
