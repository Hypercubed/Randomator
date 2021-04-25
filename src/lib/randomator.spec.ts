import './setupJest';

import { Randomator } from './randomator';

const a = Randomator.from('a');
const ab = Randomator.from(() => (Math.random() < 0.5 ? 'a' : 'b'));
const inner = Randomator.from(() => a);
const outer = Randomator.from(() => inner);

test('value', () => {
  expect(a.value()).toBe('a');
});

test('map', () => {
  const r = a.map(_ => _ + _);
  expect(r.value()).toBe('aa');
});

test('filter', () => {
  const r = ab.filter(_ => _ !== 'a');
  expect(r).forMany(v => {
    expect(v).toBe('b');
  });
});

test('unwrap', () => {
  expect(Randomator.unwrap(outer)).toBe('a');
  expect(Randomator.unwrap('test')).toBe('test');
});
