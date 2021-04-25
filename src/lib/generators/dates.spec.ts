import '../setupJest';

import { date, future, past } from './dates';

test('date', () => {
  expect(date()).forMany(v => {
    expect(v).toBeInstanceOf(Date);
    expect(+v).toBeGreaterThanOrEqual(-8640000000000000);
    expect(+v).toBeLessThan(8640000000000000);
  });

  const dd = date({ min: new Date('1/1/1990'), max: new Date('1/2/1990') });
  expect(dd).forMany(v => {
    expect(+v).toBeGreaterThanOrEqual(+new Date('1/1/1990'));
    expect(+v).toBeLessThan(+new Date('1/2/1990'));
  });
});

test('future', () => {
  const now = +new Date();
  expect(future()).forMany(v => {
    expect(v).toBeInstanceOf(Date);
    expect(+v).toBeGreaterThan(now);
    expect(+v).toBeLessThan(8640000000000000);
  });

  const ff = future({ max: new Date('1/1/2100') });
  expect(ff).forMany(v => {
    expect(+v).toBeGreaterThan(now);
    expect(+v).toBeLessThan(+new Date('1/1/2100'));
  });
});

test('past', () => {
  expect(past()).forMany(v => {
    expect(v).toBeInstanceOf(Date);
    expect(+v).toBeGreaterThan(-8640000000000000);
    expect(+v).toBeLessThan(+new Date());
  });

  const pp = past({ min: new Date('1/1/1900') });
  expect(pp).forMany(v => {
    expect(+v).toBeGreaterThan(+new Date('1/1/1900'));
    expect(+v).toBeLessThan(+new Date());
  });
});
