import '../setupJest';

import { floats, numbers, integers, booleans } from './numbers';
import { cryptoRandom } from '../rng/crypto';

describe('numbers', () => {
  const rng = jest.fn(cryptoRandom);
  const n = numbers({ rng });

  afterEach(() => {
    rng.mockClear();
  });

  test('chi-squared tests', () => {
    expect(n.map(x => x < 0.5)).toPassFreqTest();
    expect(rng).toBeCalledTimes(10000);
    rng.mockClear();

    expect(n.map(x => x < 0.55)).toPassFreqTest([true, false], [55 / 100, 1 - 55 / 100]);
    expect(rng).toBeCalledTimes(10000);
    rng.mockClear();

    expect(n.map(x => x < 0.25)).toPassFreqTest([true, false], [1 / 4, 3 / 4]);
    expect(rng).toBeCalledTimes(10000);
  });

  test('Wald–Wolfowitz runs test', () => {
    expect(n).toPassRunsTest();
    expect(rng).toBeCalledTimes(30);
  });
});

test('floats', () => {
  const rng = jest.fn(cryptoRandom);
  const zeroToOne = floats({ rng });

  expect(zeroToOne.map(x => x < 0.5)).toPassFreqTest([true, false]);
  expect(rng).toBeCalledTimes(10000);
  rng.mockClear();

  expect(zeroToOne.map(x => x < 0.25)).toPassFreqTest([true, false], [1 / 4, 3 / 4]);
  expect(rng).toBeCalledTimes(10000);
  rng.mockClear();

  const fiveToTen = floats({ min: 5, max: 10, fixed: 0, rng });
  expect(fiveToTen).toPassFreqTest([5, 6, 7, 8, 9, 10]);
  expect(rng).toBeCalledTimes(10000);
  rng.mockClear();
});

test('integers', () => {
  const rng = jest.fn(cryptoRandom);
  const zeroToNine = integers({ rng });

  expect(zeroToNine).toPassFreqTest([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(rng).toBeCalledTimes(10000);
  rng.mockClear();

  expect(zeroToNine).toPassRunsTest();
  expect(rng).toBeCalledTimes(30);
  rng.mockClear();
});

test('boolean', () => {
  const rng = jest.fn(cryptoRandom);
  const b = booleans({ rng });

  expect(b).toPassFreqTest([true, false]);
  expect(rng).toBeCalledTimes(10000);
  rng.mockClear();

  expect(b).toPassRunsTest();
  expect(rng).toBeCalledTimes(30);
  rng.mockClear();
});
