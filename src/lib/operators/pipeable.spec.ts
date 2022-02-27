import { Randomator } from '../randomator.js';
import { map, filter, switchMap } from './pipeable.js';

const c$ = Randomator.from('c');
const ab$ = Randomator.from(() => (Math.random() < 0.5 ? 'a' : 'b'));

test('pipe', () => {
  const r$ = ab$.pipe(map(_ => _ + _.toUpperCase()));

  expect(r$).forMany(v => {
    expect(v).toMatch(/aA|bB/);
  });
});

test('filter', () => {
  const f$ = ab$.pipe(filter(_ => _ !== 'a'));

  expect(f$).forMany(v => {
    expect(v).toMatch(/b/);
  });
});

test('map filter', () => {
  const mf$ = ab$.pipe(
    filter(_ => _ !== 'a'),
    map<string, string>(_ => _ + _.toUpperCase())
  );

  expect(mf$).forMany(v => {
    expect(v).toMatch(/bB/);
  });
});

test('#switchMap', () => {
  const r$ = ab$.map(_ => _.toUpperCase());
  const n$ = c$.pipe(switchMap(r$));
  expect(n$).forMany(v => {
    expect(v).toMatch(/C/);
  });
});
