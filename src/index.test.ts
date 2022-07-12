import { add, mul } from './index';

describe('sample test describe', () => {
  test('sample test - add', () => {
    expect(add(1)(2)).toBe(3);
  });

  test('sample test - mul', () => {
    expect(mul(1)(2)).toBe(2);
  });
});
