import { integers } from './numbers.js';
import { chars, paragraphs, sentences, strings, words } from './strings.js';

test('chars', () => {
  const ch = chars();
  expect(typeof ch()).toBe('string');
  expect(ch()).toHaveLength(1);

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
