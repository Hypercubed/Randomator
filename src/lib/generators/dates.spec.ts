import { unixTimestamp, dates, future, past } from './dates.js';

test('unix timestamp', () => {
  expect(unixTimestamp()).forMany(v => {
    expect(typeof v).toBe('number');
    expect(v).toBeGreaterThanOrEqual(-2147483647);
    expect(v).toBeLessThan(2147483647);
  });

  const dd$ = unixTimestamp({ min: new Date('1/1/1990'), max: new Date('1/2/1990') });
  expect(dd$).forMany(v => {
    expect(+v).toBeGreaterThanOrEqual(+new Date('1/1/1990') / 1000);
    expect(+v).toBeLessThan(+new Date('1/2/1990') / 1000);
  });
});

test('date', () => {
  expect(dates()).forMany(v => {
    expect(v).toBeInstanceOf(Date);
    expect(+v).toBeGreaterThanOrEqual(-6857195532000);
    expect(+v).toBeLessThan(6857195532000);
  });

  const dd$ = dates({ min: new Date('1/1/1990'), max: new Date('1/2/1990') });
  expect(dd$).forMany(v => {
    expect(+v).toBeGreaterThanOrEqual(+new Date('1/1/1990'));
    expect(+v).toBeLessThan(+new Date('1/2/1990'));
  });
});

test('future', () => {
  const now = +new Date();
  expect(future()).forMany(v => {
    expect(v).toBeInstanceOf(Date);
    expect(+v).toBeGreaterThan(now);
    expect(+v).toBeLessThan(6857195532000);
  });

  const ff$ = future({ max: new Date('1/1/2100') });
  expect(ff$).forMany(v => {
    expect(+v).toBeGreaterThan(now);
    expect(+v).toBeLessThan(+new Date('1/1/2100'));
  });
});

test('past', () => {
  expect(past()).forMany(v => {
    expect(v).toBeInstanceOf(Date);
    expect(+v).toBeGreaterThan(-6857195532000);
    expect(+v).toBeLessThan(+new Date());
  });

  const pp$ = past({ min: new Date('1/1/1900') });
  expect(pp$).forMany(v => {
    expect(+v).toBeGreaterThan(+new Date('1/1/1900'));
    expect(+v).toBeLessThan(+new Date());
  });
});
