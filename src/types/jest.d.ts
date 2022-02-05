declare namespace jest {
  interface Matchers<R> {
    toPassFreqTest(categories?: unknown[], expectations?: number[], dof?: number, N?: number): R;
    toPassRunsTest(): R;
    forMany(fn: (v: unknown) => void): R;
  }
}
