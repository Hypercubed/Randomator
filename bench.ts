import assert from 'assert';
import suite from 'chuhai';
import { Randomator } from './';

const generator = () => (Math.random() < 0.5 ? 'a' : 'b');
const randomator = Randomator.from(() => (Math.random() < 0.5 ? 'a' : 'b'));

console.log('Running Randomator benchmarks...');

suite('Randomator', s => {
  let results = [];

  s.cycle(() => {
    results.forEach(result => {
      assert(result.match(/[ab]/));
    });
    results = [];
  });

  // adds a bench that runs but doesn't get counted when comparing results to others.
  s.burn('burn', () => {
    results = [generator(), randomator(), randomator.next()];
  });

  s.bench('generator', () => {
    results = [generator(), generator(), generator()];
  });

  s.bench('randomator call', () => {
    results = [randomator(), randomator(), randomator()];
  });

  s.bench('randomator#next', () => {
    results = [randomator.next(), randomator.next(), randomator.next()];
  });
});