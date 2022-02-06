import assert from 'assert';
import suite from 'chuhai';
import { Randomator } from './src/lib/randomator';

const id = (x: unknown) => x;
const generator = () => (Math.random() < 0.5 ? 'a' : 'b');
const randomator = Randomator.from(generator);
const mapped = randomator.map(id);
const bound = randomator.bind(null);

console.log('Running Randomator benchmarks...');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
suite('Randomator', (s: any) => {
  let results = [];

  s.cycle(() => {
    results.forEach(result => {
      assert(result.match(/[ab]/));
    });
    results = [];
  });

  // adds a bench that runs but doesn't get counted when comparing results to others.
  s.burn('burn', () => {
    results = [
      generator(),
      randomator(),
      randomator.next().value,
      randomator.fold()
    ];
  });

  s.bench('generator', () => {
    results = [
      generator(),
      generator(),
      generator(),
      generator()
    ];
  });

  s.bench('randomator call', () => {
    results = [
      randomator(),
      randomator(),
      randomator(),
      randomator()
    ];
  });

  s.bench('randomator#next', () => {
    results = [
      randomator.next().value,
      randomator.next().value,
      randomator.next().value,
      randomator.next().value
    ];
  });

  s.bench('randomator#fold', () => {
    results = [
      randomator.fold(),
      randomator.fold(),
      randomator.fold(),
      randomator.fold()
    ];
  });

  s.bench('randomator#map', () => {
    results = [
      mapped(),
      mapped(),
      mapped(),
      mapped()
    ];
  });

  s.bench('bound randomator', () => {
    results = [
      bound(),
      bound(),
      bound(),
      bound()
    ];
  });
});