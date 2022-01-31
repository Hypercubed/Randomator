import { enumerate, itake, izip } from 'itertools';

import { Randomator } from './randomator.js';

describe('works with itertools', () => {
  const ab = Randomator.from(() => (Math.random() < 0.5 ? 'a' : 'b'));
  const cd = Randomator.from(() => (Math.random() < 0.66 ? 'c' : 'd'));

  test('take', () => {
    const a = Array.from(itake(5, ab));

    expect(a).toHaveLength(5);

    a.forEach(v => {
      expect(v).toMatch(/[ab]/);
    });
  });

  test('izip', () => {
    const z = izip(ab, cd);
    const a = Array.from(itake(5, z));

    expect(a).toHaveLength(5);

    a.forEach(v => {
      expect(v[0]).toMatch(/[ab]/);
      expect(v[1]).toMatch(/[cd]/);
    });
  });

  test('enumerate', () => {
    const f = itake(5, ab);
    const a = Array.from(enumerate(f));

    expect(a).toHaveLength(5);

    a.forEach(v => {
      expect(typeof v[0]).toBe('number');
      expect(v[1]).toMatch(/[ab]/);
    });
  });
});
