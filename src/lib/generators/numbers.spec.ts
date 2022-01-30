import '../setupJest';

import { bigIntegers, booleans, bytes, floats, int32s, integers, numbers, uint32s } from './numbers';
import { Randomator } from '../randomator';

describe('number', () => {
  const n = numbers();

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

  test('bound tests', () => {
    const fn = n.next;
    Array.from({ length: 100 }, fn).forEach(v => {
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

  test('throws on bad options', () => {
    expect(() => {
      numbers({ min: -1 } as any);
    }).toThrow();
  });
});

describe('float', () => {
  test('default', () => {
    const zeroToOne = floats();
    expect(zeroToOne).toBeInstanceOf(Randomator);

    expect(zeroToOne).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    });

    expect(zeroToOne.map(x => x < 0.5)).toPassFreqTest([true, false]);
    expect(zeroToOne.map(x => x < 0.25)).toPassFreqTest([true, false], [1 / 4, 3 / 4]);

    const fiveToTen = floats({ min: 5, max: 10, fixed: 0 });
    expect(fiveToTen).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
    });
    expect(fiveToTen).toPassFreqTest([5, 6, 7, 8, 9, 10]);
  });

  test('max', () => {
    const zeroToTen = floats({ max: 10 });
    expect(zeroToTen).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(10);
    });
    expect(zeroToTen.map(x => x < 8)).toPassFreqTest([true, false], [8 / 10, 2 / 10]);
    expect(zeroToTen).toPassRunsTest();
  });

  test('large values', () => {
    const large = floats({ max: 1e6, min: -1e6, fixed: 2 });
    expect(large).forMany(v => {
      expect(v).toBeGreaterThanOrEqual(-1e6);
      expect(v).toBeLessThan(1e6);

      const decimals = v.toString().split('.')[1] || '';
      expect(decimals.length).toBeLessThanOrEqual(2);
    });
    expect(large).toPassRunsTest();
  });
});

describe('integers', () => {
  test('integer', () => {
    const zeroToNine = integers();
    expect(zeroToNine).toBeInstanceOf(Randomator);

    expect(zeroToNine).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBe(~~v);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(9);
    });

    expect(zeroToNine).toPassFreqTest([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(zeroToNine).toPassRunsTest();

    const zeroToTen = integers({ max: 10 });
    expect(zeroToTen).forMany(v => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(10);
    });

    expect(zeroToTen).toPassFreqTest([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const fiveToTen = integers({ max: 10, min: 5 });
    expect(fiveToTen).forMany(v => {
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
    });
    expect(fiveToTen).toPassFreqTest([5, 6, 7, 8, 9, 10]);
    expect(fiveToTen).toPassRunsTest();
  });

  test('throws on bad options', () => {
    expect(() => {
      integers({ fixed: -1 } as any);
    }).toThrow();

    expect(() => {
      integers({ max: 9e16 } as any);
    }).toThrow();

    expect(() => {
      integers({ min: -9e16 } as any);
    }).toThrow();
  });
});

describe('big integers', () => {
  test('big integer', () => {
    const zeroToNine = bigIntegers();
    expect(zeroToNine).toBeInstanceOf(Randomator);

    expect(zeroToNine).forMany(v => {
      expect(typeof v).toBe('bigint');
      expect(v).toBe(~~v);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(9);
    });

    expect(zeroToNine).toPassFreqTest([0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n]);
    expect(zeroToNine).toPassRunsTest();

    const zeroToTen = bigIntegers({ max: 10n });
    expect(zeroToTen).forMany(v => {
      expect(v).toBeGreaterThanOrEqual(0n);
      expect(v).toBeLessThanOrEqual(10n);
    });

    expect(zeroToTen).toPassFreqTest([0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n]);

    const fiveToTen = bigIntegers({ max: 10n, min: 5n });
    expect(fiveToTen).forMany(v => {
      expect(v).toBeGreaterThanOrEqual(5n);
      expect(v).toBeLessThanOrEqual(10n);
    });
    // expect(fiveToTen).toPassFreqTest([5n, 6n, 7n, 8n, 9n, 10n]);
    expect(fiveToTen).toPassRunsTest();

    const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
    const large = bigIntegers({ min: -2n * MAX_SAFE_INTEGER, max: 2n * MAX_SAFE_INTEGER });
    expect(large.map(v => v < 0)).toPassFreqTest([true, false]);
    expect(large.map(v => v / MAX_SAFE_INTEGER)).toPassFreqTest([-1n, 0n, 1n], [1 / 4, 1 / 2, 1 / 4]);
  });
});

describe('booleans', () => {
  test('boolean', () => {
    const b = booleans();
    expect(b).toBeInstanceOf(Randomator);
    expect(typeof b.next()).toBe('boolean');

    expect(b).toPassFreqTest([true, false]);
    expect(b).toPassRunsTest();

    const b2 = booleans({ probability: 0.6667 });
    expect(b2).toPassFreqTest([true, false], [2 / 3, 1 / 3]);
  });

  test('throws on bad options', () => {
    expect(() => {
      booleans({ probability: 2 })
    }).toThrow();
  });
});

describe('uint32s', () => {
  test('uint32s', () => {
    const uint32$ = uint32s();

    expect(uint32$).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBe(~~v);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(0xFFFFFFFF);
    });
  });
});

describe('int32s', () => {
  test('int32s', () => {
    const int32$ = int32s();

    expect(int32$).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBe(~~v);
      expect(v).toBeGreaterThanOrEqual(-0x7FFFFFFF);
      expect(v).toBeLessThanOrEqual(0x7FFFFFFF);
    });
  });
});

describe('bytes', () => {
  test('bytes', () => {
    const byte$ = bytes();

    expect(byte$).forMany(v => {
      expect(typeof v).toBe('number');
      expect(v).toBe(~~v);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    });
  });
});
