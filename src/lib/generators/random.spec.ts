import '../setupJest';

import { boolean, float, integer, number } from './random';
import { Randomator } from '../randomator';

describe('number', () => {
  const n = number();

  test('is a Randomator', () => {
    expect(n).toBeInstanceOf(Randomator);
  });

  test('value tests', () => {
    expect(n).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    });
  });

  test('chi-squared tests', () => {
    expect(n.map(x => x < 0.5)).toPassFreqTest();
    expect(n.map(x => x < 0.55)).toPassFreqTest([true, false], [55 / 100, 1 - 55 / 100]);
    expect(n.map(x => x < 0.25)).toPassFreqTest([true, false], [1 / 4, 3 / 4]);
  });

  test('Wald–Wolfowitz runs test', () => {
    expect(n).toPassRunsTest();
  });
});

describe('float', () => {
  test.only('default', () => {
    const zeroToOne = float();
    expect(zeroToOne).toBeInstanceOf(Randomator);

    expect(zeroToOne).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    });

    expect(zeroToOne.map(x => x < 0.5)).toPassFreqTest([true, false]);
    expect(zeroToOne.map(x => x < 0.25)).toPassFreqTest([true, false], [1 / 4, 3 / 4]);

    const fiveToTen = float({ min: 5, max: 10, fixed: 0 });
    expect(fiveToTen).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
    });
    expect(fiveToTen).toPassFreqTest([5, 6, 7, 8, 9, 10]);
  });

  test('max', () => {
    const zeroToTen = float({ max: 10 });
    expect(zeroToTen).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(10);
    });
    expect(zeroToTen.map(x => x < 8)).toPassFreqTest([true, false], [8 / 10, 2 / 10]);
    expect(zeroToTen).toPassRunsTest();
  });

  test('large values', () => {
    const large = float({ max: 1e6, min: -1e6, fixed: 2 });
    expect(large).forMany(v => {
      expect(v).toBeGreaterThanOrEqual(-1e6);
      expect(v).toBeLessThan(1e6);

      const decimals = v.toString().split('.')[1] || '';
      expect(decimals.length).toBeLessThanOrEqual(2);
    });
    expect(large).toPassRunsTest();
  });
});

test('integer', () => {
  const zeroToNine = integer();
  expect(zeroToNine).toBeInstanceOf(Randomator);

  expect(zeroToNine).forMany(v => {
    expect(typeof v).toBe('number');
    expect(v).toBe(~~v);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(9);
  });

  expect(zeroToNine).toPassFreqTest([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(zeroToNine).toPassRunsTest();

  const zeroToTen = integer({ max: 10 });
  expect(zeroToTen).forMany(v => {
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(10);
  });

  expect(zeroToTen).toPassFreqTest([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const fiveToTen = integer({ max: 10, min: 5 });
  expect(fiveToTen).forMany(v => {
    expect(v).toBeGreaterThanOrEqual(5);
    expect(v).toBeLessThanOrEqual(10);
  });
  expect(fiveToTen).toPassFreqTest([5, 6, 7, 8, 9, 10]);
  expect(fiveToTen).toPassRunsTest();
});

test('boolean', () => {
  const b = boolean();
  expect(b).toBeInstanceOf(Randomator);
  expect(typeof b.value()).toBe('boolean');

  expect(b).toPassFreqTest([true, false]);
  expect(b).toPassRunsTest();
});
