/* eslint-disable @typescript-eslint/no-explicit-any */

import * as chi from 'chi-squared';
import { Normal } from 'distributions';
import { Randomator } from './src/';

import nodeCrypto from 'crypto';

global.crypto = {
  getRandomValues: function(buffer: any) { return nodeCrypto.randomFillSync(buffer); }
} as any;

const normal = Normal();

/**
 * Calulate the χ² p-value
 *
 * @param observations
 * @param categories mutually exclusive classes
 * @param expectations expected counts for each class
 * @param df degrees of freedom
 * @returns χ² p-value
 */
export function chiSquaredPValue(observations: number[], expectations: number[], df: number): number {
  // frequency distribution
  const χ2 = observations.reduce((acc, ni, i) => {
    const μi = expectations[i];
    return acc + (ni - μi) ** 2 / μi;
  }, 0);

  return 1 - chi.cdf(χ2, df);
}

function median(arr: number[]) {
  const mid = Math.floor(arr.length / 2);
  const nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

/**
 * Two-Sided Asymptotic Z Test with Continuity Correction
 *
 * @param observations
 * @param categories mutually exclusive classes
 * @returns Asymptotic Z Test p-value
 */
function zTestPValue(observations: unknown[], categories: unknown[]) {
  const n = observations.length;
  const k = categories.length;

  // frequency distribution
  const N = categories.map(ki => observations.filter(si => si === ki).length);

  // observed total number of runs
  const r = observations.reduce((acc: number, v, i) => {
    const p = observations[i - 1] || null;
    if (v !== p) acc++;
    return acc;
  }, 0) as number;

  let µ: number, σ2: number;

  if (k === 2) {
    // Wald-Wolfowitz Runs Test
    const n1n2x2 = 2 * N[0] * N[1];
    µ = n1n2x2 / n + 1;
    σ2 = (n1n2x2 * (n1n2x2 - n)) / n ** 2 / (n - 1);
  } else {
    // k-Category Extension of Wald-Wolfowitz Runs Test
    const Σn2 = N.reduce((acc, v) => acc + v ** 2, 0);
    const Σn3 = N.reduce((acc, v) => acc + v ** 3, 0);
    µ = (n * (n + 1) - Σn2) / n;
    σ2 = (Σn2 * (Σn2 + n * (n + 1)) - 2 * n * Σn3 - n ** 3) / n ** 2 / (n - 1);
  }

  const σ = Math.sqrt(σ2);
  const cc = r >= µ ? -0.5 : 0.5;

  // asymptotic continuity-corrected standard normal z statistic
  const zcc = (r - µ + cc) / σ;

  // Two-Sided test
  return 2 * (1 - normal.cdf(Math.abs(zcc)));
}

const N_χ = 10000;
const N_z = 30;
const ALPHA = 0.0001;

expect.extend({
  toPassFreqTest(randomator: Randomator, categories?: unknown[], expectations?: number[], df?: number) {
    // generate N_χ observations
    const S = randomator.toArray(N_χ);

    // obtain mutually exclusive classes, if not defined
    categories = categories || [...new Set(S)];

    // calculate expected frequency for each class assuming equal distribution, if not defined
    expectations = expectations || categories.map(() => 1 / categories.length);

    // convert frequencies to expected values
    const E = expectations.map(ei => ei * N_χ);

    // assume degrees of freedom, if not defined
    df = df || categories.length - 1;

    const O = categories.map(ki => S.filter(si => si === ki).length);

    const p = chiSquaredPValue(O, E, df);
    return {
      pass: p > ALPHA,
      message: () => `Expected p-value (${p}) to be above ${ALPHA}.
      
      Categories: ${categories}
      Observations: ${O}
      Expected: ${E}
      
      `
    };
  },
  toPassRunsTest(generator: Randomator) {
    // generate N_z observations
    let S = generator.toArray(N_z);

    // if observations are numeric, convert to a binary test by comparing to median value
    if (typeof S[0] === 'number') {
      const mid = median(S as number[]);
      S = S.map(v => v <= mid);
    }

    // convert classes to strings
    S = S.map(v => String(v));

    // obtain mutually exclusive classes
    const K = [...new Set(S)];

    const p = zTestPValue(S, K);
    return {
      pass: p > ALPHA,
      message: () => `Expected p-value (${p}) to be above ${ALPHA}`
    };
  },
  forMany(generator: Randomator, fn: () => void) {
    generator.toArray(N_z).forEach(fn);

    return {
      pass: true,
      message: () => `E`
    };
  }
});
