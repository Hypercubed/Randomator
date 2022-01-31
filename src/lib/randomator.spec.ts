import { Randomator } from './randomator.js';

const a = Randomator.from('a');
const ab = Randomator.from(() => (Math.random() < 0.5 ? 'a' : 'b'));
const inner = Randomator.from(() => a);
const outer = Randomator.from(() => inner);

describe('Randomator', () => {
  test('#next', () => {
    expect(ab.next()).toMatch(/[ab]/);
    expect(ab).toPassFreqTest(['a', 'b']);
  });

  test('#map', () => {
    const r = ab.map(_ => _ + _);
    expect(r).toBeInstanceOf(Randomator);
    expect(r.next()).toMatch(/[ab][ab]/);
  });

  test('#apply', () => {
    const r = ab.apply(_ => _ + _);
    expect(r).toMatch(/[ab][ab]/);
  });

  test('#filter', () => {
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

  test('species', () => {
    expect(Randomator[Symbol.species]).toBe(Randomator);
  });

  test('#pipe', () => {
    const r = ab.pipe(_ => _.next() + _.next());
    expect(r).toBeInstanceOf(Randomator);
    expect(r).toPassFreqTest(['aa', 'bb', 'ab', 'ba']);
  });

  test('iterable', () => {
    let c = 0;
    for (const value of ab) {
      expect(value).toMatch(/[ab]/);
      c++;
      if (c > 10) break;
    }

    const it = ab[Symbol.iterator]();
    Array.from({ length: 100 }).forEach(() => {
      expect(it.next().value).toMatch(/[ab]/);
      expect(it.next().done).toBe(false);
    });
  });

  test('#toArray', () => {
    ab.toArray(100).forEach(v => {
      expect(v).toMatch(/[ab]/);
    });
  });
});
