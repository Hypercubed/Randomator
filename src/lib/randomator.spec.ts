import { Randomator } from './randomator.js';

const ab$ = Randomator.from(() => (Math.random() < 0.5 ? 'a' : 'b'));

describe('Randomator', () => {
  test('is a Randomator', () => {
    expect(ab$).toBeInstanceOf(Randomator);
    expect(ab$.constructor).toBe(Randomator);
  });

  test('toString', () => {
    expect(ab$.toString()).toMatchInlineSnapshot(`"Randomator(() => (Math.random() < 0.5 ? 'a' : 'b'))"`);
    expect(ab$.bind(null).toString()).toMatchInlineSnapshot(`"[Function: bound] Randomator"`);
  });

  test('unwrap', () => {
    const inner$ = Randomator.from(() => ab$);
    const outer$ = Randomator.from(() => inner$);

    for (let i = 0; i < 30; i++) {
      expect(Randomator.unwrap(outer$)).toMatch(/[ab]/);
      expect(Randomator.unwrap('test')).toBe('test');
    }
  });

  test('species', () => {
    expect(Randomator[Symbol.species]).toBe(Randomator);
  });

  test('is a callable function', () => {
    expect(typeof ab$).toBe('function');
    expect(ab$).toBeInstanceOf(Function);

    for (let i = 0; i < 30; i++) {
      expect(ab$()).toMatch(/[ab]/);
      expect(ab$.bind(null)()).toMatch(/[ab]/);
      expect(ab$.call(null)).toMatch(/[ab]/);
      expect(ab$.apply(null)).toMatch(/[ab]/);
    }

    expect(ab$).toPassFreqTest(['a', 'b']);
  });

  test('iterable', () => {
    let c = 0;
    for (const value of ab$) {
      expect(value).toMatch(/[ab]/);
      c++;
      if (c > 10) break;
    }

    const it = ab$[Symbol.iterator]();
    Array.from({ length: 100 }).forEach(() => {
      expect(it.next().value).toMatch(/[ab]/);
      expect(it.next().done).toBe(false);
    });
  });

  test('#next', () => {
    expect(ab$.next().value).toMatch(/[ab]/);
  });

  test('#map', () => {
    const r = ab$.map(_ => _ + _.toUpperCase());
    expect(r).toBeInstanceOf(Randomator);
    expect(typeof r).toBe('function');
    expect(r).forMany(v => {
      expect(v).toMatch(/aA|bB/);
    });
  });

  test('#fold', () => {
    for (let i = 0; i < 30; i++) {
      const r = ab$.fold(_ => _ + _.toUpperCase());
      expect(typeof r).toBe('string');
      expect(r).toMatch(/aA|bB/);

      expect(ab$.fold()).toMatch(/[ab]/);
    }
  });

  test('#filter', () => {
    const r = ab$.filter(_ => _ !== 'a');
    expect(r).toBeInstanceOf(Randomator);
    expect(typeof r).toBe('function');
    expect(r).forMany(v => {
      expect(v).toBe('b');
    });
  });

  test('#pipe', () => {
    const r = ab$.pipe(_ => _() + _());
    expect(r).toBeInstanceOf(Randomator);
    expect(r).toPassFreqTest(['aa', 'bb', 'ab', 'ba']);
  });

  test('#toArray', () => {
    ab$.toArray(100).forEach(v => {
      expect(v).toMatch(/[ab]/);
    });
  });
});
