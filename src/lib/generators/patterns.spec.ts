import { pattern, uuids, phoneNumbers } from "./patterns";

test('pattern', () => {
  expect(pattern('___-^^^-###')).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-z]{3}-[A-Z]{3}-[0-9]{3}$/);
  });

  expect(phoneNumbers()).forMany(v => {
    expect(v).toMatch(/^[()0-9- ]+$/);
  });
});

test('uuid', () => {
  expect(uuids()).forMany(v => {
    expect(typeof v).toBe('string');
    expect(v).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  });

  expect(uuids(3)).forMany(v => {
    expect(v).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-3[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  });
});