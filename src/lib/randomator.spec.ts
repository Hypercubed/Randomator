import './setupJest';

import { Randomator } from './randomator';

const a = Randomator.from('a');
const ab = Randomator.from(() => (Math.random() < 0.5 ? 'a' : 'b'));
const inner = Randomator.from(() => a);
const outer = Randomator.from(() => inner);

test('next', () => {
  expect(a.next()).toBe('a');
  expect(ab).toPassFreqTest(['a', 'b']);
});

test('map', () => {
  const r = a.map(_ => _ + _);
  expect(r).toBeInstanceOf(Randomator);
  expect(r.next()).toBe('aa');
});

test('filter', () => {
  const r = ab.filter(_ => _ !== 'a');
  expect(r).toBeInstanceOf(Randomator);
  expect(r).forMany(v => {
    expect(v).toBe('b');
  });
});

test('unwrap', () => {
  expect(Randomator.unwrap(outer)).toBe('a');
  expect(Randomator.unwrap('test')).toBe('test');
});

test('pipe', () => {
  const r = ab.pipe(_ => _.next() + _.next());
  expect(r).toBeInstanceOf(Randomator);
  expect(r).toPassFreqTest(['aa', 'bb', 'ab', 'ba']);
});
