import '../setupJest';

import { integer } from '../generators/random';
import { oneOf, randomator, repeat, seq, record, object, array, weighted, shuffle, unique } from './core';
import { string } from '../generators/strings';

test('oneOf', () => {
  const ab = oneOf(['a', 'b']);
  expect(ab).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[ab]$/);
  });
  expect(ab).toPassFreqTest();
  expect(ab).toPassRunsTest();

  const abc = oneOf(['A', 'B', 'C']);
  expect(abc).forMany(v => {
    expect(v).toMatch(/^[ABC]$/);
  });
  expect(abc).toPassFreqTest();
  expect(abc).toPassRunsTest();

  const nn = oneOf([1, 2, 5]);
  expect(nn).forMany((v: number) => {
    expect([1, 2, 5].indexOf(v)).toBeGreaterThan(-1);
  });
  expect(nn).toPassFreqTest();
  expect(nn).toPassRunsTest();

  const abcd = oneOf(['a', 'b', oneOf(['c', 'd'])]);
  expect(abcd).forMany(v => {
    expect(v).toMatch(/^[abcd]$/);
  });
  expect(abcd).toPassFreqTest(['a', 'b', 'c', 'd'], [1 / 3, 1 / 3, 1 / 6, 1 / 6]);
  expect(abcd).toPassRunsTest();

  const i = oneOf<number | string>(['a', 'b', oneOf([1, 2])]);
  expect(i).forMany(v => {
    expect('' + v).toMatch(/^[ab12]$/);
  });
  expect(i).toPassFreqTest(['a', 'b', 1, 2], [1 / 3, 1 / 3, 1 / 6, 1 / 6]);

  const ii = oneOf(['a', 'b', repeat(integer(), 5)]);
  expect(ii).forMany(v => {
    expect('' + v).toMatch(/^[ab]|\d{5}$/);
  });
  expect(ii).toPassFreqTest(['a', 'b'], [1 / 3, 1 / 3], 2);
});

test('weighted', () => {
  const ab = weighted(['a', 'b'], [1, 2]);
  expect(ab).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[ab]$/);
  });
  expect(ab).toPassFreqTest(['a', 'b'], [1 / 3, 2 / 3]);
  expect(ab).toPassRunsTest();

  const abc = weighted(['a', 'b', 'c'], [2, 3, 5]);
  expect(abc).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[abc]$/);
  });
  expect(abc).toPassFreqTest(['a', 'b', 'c'], [1 / 5, 3 / 10, 1 / 2]);
  expect(abc).toPassRunsTest();

  const def = weighted(['d', 'e', 'f'], [0.15, 0.1, 0.75]);
  expect(def).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[def]$/);
  });
  expect(def).toPassFreqTest(['d', 'e', 'f'], [0.15, 0.1, 0.75]);
  expect(def).toPassRunsTest();

  const n = weighted(['a', 'b', weighted(['c', 'd'], [1, 2])], [1, 2, 3]);
  expect(n).toPassFreqTest(['a', 'b', 'c', 'd'], [1 / 6, 1 / 3, 1 / 6, 1 / 3]);
  expect(n).toPassRunsTest();
});

test('shuffle', () => {
  const s = shuffle(['a', 'b', 'c']);
  expect(s).forMany((arr: string[]) => {
    expect(arr).toBeInstanceOf(Array);

    expect(arr).toHaveLength(3);
    expect(arr.indexOf('a')).toBeGreaterThan(-1);
    expect(arr.indexOf('b')).toBeGreaterThan(-1);
    expect(arr.indexOf('c')).toBeGreaterThan(-1);
    arr.forEach(v => {
      expect(v).toMatch(/^[abc]$/);
    });

    expect(arr).toEqual([...new Set(arr)]);
    // expect(chiSquaredPValue(arr, ['a', 'b', 'c'], [1 / 3, 1 / 3, 1 / 3], 2)).toBeGreaterThan(0.1);
  });

  const n = shuffle<unknown>(['a', 'b', integer()]);
  expect(n).forMany((arr: unknown[]) => {
    expect(arr).toHaveLength(3);
    arr.forEach(v => {
      expect('' + v).toMatch(/^[ab\d]$/);
    });

    expect(arr).toEqual([...new Set(arr)]);
  });
});

test('unique', () => {
  const u = unique(oneOf(['a', 'b', 'c', 'd', 'e', 'f']), 3);

  expect(u).forMany((arr: string[]) => {
    expect(arr).toBeInstanceOf(Array);
    expect(arr).toHaveLength(3);
    arr.forEach(v => {
      expect('' + v).toMatch(/^[abcdef]$/);
    });
    expect(arr).toEqual([...new Set(arr)]);
  });

  const e = unique(oneOf(['a', 'b', 'c']), 10);
  expect(() => {
    e.value();
  }).toThrow(`Couldn't find 10 unique items from given Randomator`);
});

test('array', () => {
  expect(array(integer(), 5)).forMany((arr: unknown[]) => {
    expect(arr).toBeInstanceOf(Array);
    arr.forEach(v => {
      expect(typeof v).toBe('number');
    });
  });

  expect(array(oneOf(['a', 'b']), 5)).forMany((arr: unknown[]) => {
    arr.forEach(v => {
      expect(v).toMatch(/^[ab]$/);
    });
  });
});

test('repeat', () => {
  const r = repeat(integer(), 5);
  expect(r).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^\d{5}$/);
  });

  const aaa = integer({ min: 3, max: 5 }).map(l => repeat('a', l));
  expect(aaa).forMany(v => {
    expect(v).toMatch(/^a{3,5}$/);
  });

  const rrr = integer({ min: 3, max: 5 }).map(l => repeat(integer({ min: 1, max: 3 }), l));
  expect(rrr).forMany(v => {
    expect(v).toMatch(/^[123]{3,5}$/);
  });

  const ab = repeat(oneOf(['a', 'b']), 2);
  expect(ab).forMany(v => {
    expect(v).toMatch(/^[ab][ab]$/);
  });
  expect(ab).toPassFreqTest(['aa'], [1 / 4], 3);
});

test('seq', () => {
  const abc = seq(['a', 'b', 'c']);

  expect(abc).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^abc$/);
  });

  const ff = seq(['a', 'b', oneOf(['c', 'd'])]);
  expect(ff).forMany(v => {
    expect(v).toMatch(/^ab[cd]$/);
  });

  const i = seq(['a', 'b', integer()]);
  expect(i).forMany(v => {
    expect(v).toMatch(/^ab\d$/);
  });

  const ii = seq(['a', 'b', repeat(integer(), 5)]);
  expect(ii).forMany(v => {
    expect(v).toMatch(/^ab\d{5}$/);
  });
});

test('record', () => {
  const r = record<unknown>({
    id: integer({ max: 10, min: 5 }),
    str: string()
  });
  expect(r).forMany((v: { id: number; str: string }) => {
    expect(typeof v).toBe('object');
    expect(v.id).toBeGreaterThanOrEqual(5);
    expect(v.id).toBeLessThanOrEqual(10);
    expect(v.str).toMatch(/^[a-zA-Z\d!@#$%^&*()]{5,20}$/);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rr = record<any>({
    id: integer({ max: 10, min: 5 }),
    person: record({ name: string() })
  });
  expect(rr).forMany((v: { id: number; person: { name: string } }) => {
    expect(v.person.name).toMatch(/^[a-zA-Z\d!@#$%^&*()]{5,20}$/);
  });
});

test('object', () => {
  const o = object<string | number>({
    id: integer({ max: 10, min: 5 }),
    str: string()
  });
  expect(o).forMany((v: { id: number; str: string }) => {
    expect(typeof v).toBe('object');
    expect(v.id).toBeGreaterThanOrEqual(5);
    expect(v.id).toBeLessThanOrEqual(10);
    expect(v.str).toMatch(/^[a-zA-Z\d!@#$%^&*()]{5,20}$/);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const oo = object<any>({
    id: integer({ max: 10, min: 5 }),
    person: { name: string() }
  });
  expect(oo).forMany((v: { id: number; person: { name: string } }) => {
    expect(v.person.name).toMatch(/^[a-zA-Z\d!@#$%^&*()]{5,20}$/);
  });
});

test('randomator', () => {
  const f = randomator`Hello ${oneOf(['World', 'Earth'])}`;
  expect(f).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^Hello (World|Earth)$/);
  });

  const ff = randomator`Composable ${f}`;
  expect(ff).forMany(v => {
    expect(v).toMatch(/^Composable Hello (World|Earth)$/);
  });

  const i = randomator`Integer ${integer()}`;
  expect(i).forMany(v => {
    expect(v).toMatch(/^Integer \d$/);
  });

  const ii = randomator`Integer ${repeat(integer(), 5)}`;
  expect(ii).forMany(v => {
    expect(v).toMatch(/^Integer \d{5}$/);
  });
});
