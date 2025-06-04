const { calculatePrice, PRICES } = require('./scripts');

test('calculate price for sample inputs', () => {
  const distance = 20; // km
  const weight = 500; // kg
  const volume = 1; // cubic meters

  const expected = PRICES[2][4];
  expect(calculatePrice(distance, weight, volume)).toBe(expected);
});
