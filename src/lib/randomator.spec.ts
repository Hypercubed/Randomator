import { Randomator } from './randomator.js';

const a = Randomator.from('a');
const ab = Randomator.from(() => (Math.random() < 0.5 ? 'a' : 'b'));
const inner = Randomator.from(() => a);
const outer = Randomator.from(() => inner);

describe('Randomator', () => {
  test('is a Randomator', () => {
    expect(ab).toBeInstanceOf(Randomator);
  });

  test('is a callable function', () => {
    expect(typeof ab).toBe('function');
    expect(ab).toBeInstanceOf(Function);
    expect(ab()).toMatch(/[ab]/);

    expect(ab.bind(null)()).toMatch(/[ab]/);
    expect(ab.call(null)).toMatch(/[ab]/);
    expect(ab.apply(null)).toMatch(/[ab]/);
  });

  test('#next', () => {
    expect(ab.next()).toMatch(/[ab]/);
    expect(ab).toPassFreqTest(['a', 'b']);
  });

  test('#map', () => {
    const r = ab.map(_ => _ + _);
    expect(r).toBeInstanceOf(Randomator);
    expect(typeof r).toBe('function');
    expect(r()).toMatch(/[ab][ab]/);
  });

  test('#nmap', () => {
    const r = ab.nmap(_ => _ + _);
    expect(r).toMatch(/[ab][ab]/);
  });

  test('#filter', () => {
    const r = ab.filter(_ => _ !== 'a');
    expect(r).toBeInstanceOf(Randomator);
    expect(typeof r).toBe('function');
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
    const r = ab.pipe(_ => _() + _());
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
