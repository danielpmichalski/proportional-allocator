const basket = require('./proportional-allocation-basket.js');

const setPrecision = function (num, precision = 4) {
  return Number.parseFloat(num).toPrecision(precision);
}

const arrayWithFloatsEquals = function (current, other, precision = 4) {
  if (!Array.isArray(other)) {
    return false;
  } else if (current.length !== other.length) {
    return false;
  } else {
    for (let i = 0; i < current.length; i++) {
      let first = setPrecision(current[i], precision);
      let second = setPrecision(other[i], precision);
      if ( first - second >= (10 ** (-precision)) ) {
        return false;
      }
    }
    return true;
  }
}

const assertArraysWithFloatsEquals = function (actual, expected, precision = 4) {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    return arrayWithFloatsEquals(actual, expected, precision);
  } else {
    return false;
  }
}

// custom matcher for arrays with floating point numbers
expect.extend({
  toBeArrayWithFloats(received, expected, precision = 4) {
    const pass = assertArraysWithFloatsEquals(received, expected, precision);
    if (pass) {
      return {
        message: () => `expected [${received}] to be equal to [${expected}] with ${precision}-digit precision`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] to be equal to [${expected}] with ${precision}-digit precision`,
        pass: false,
      };
    }
  },
});

// general item addition cases
test('[].push() === [1.0]', () => {
  let actual = basket.push(); // === [1.0]
  let expected = [1.0];

  expect(actual.basket).toBeArrayWithFloats([1.0]);
});

test('[1.0].push() === [0.5, 0.5]', () => {
  let actual = basket.push(); // === [1.0]
  let expected = [0.5, 0.5];

  expect(actual.push().basket).toBeArrayWithFloats(expected);
});

test('[0.5, 0.5].push() === [0.3333, 0.3333, 0.3333]', () => {
  let actual = basket.push().push(); // === [0.5, 0.5]
  let expected = [0.3333, 0.3333, 0.3333];

  expect(actual.push().basket).toBeArrayWithFloats(expected);
});

test('[0.5, 0.5].push().pop() === [0.5, 0.5]', () => {
  let actual = basket.push().push(); // === [0.5, 0.5]
  let expected = [0.5, 0.5];

  expect(actual.push().pop().basket).toBeArrayWithFloats(expected);
});

// item addition edge cases
test('[].push(1.0) === [1.0]', () => {
  let actual = basket; // === []
  let expected = [1.0];

  expect(actual.push(1.0).basket).toBeArrayWithFloats(expected);
});

test('[1.0].push(0) === [1.0]', () => {
  let actual = basket.push(); // === [1.0]
  let expected = [1.0];

  expect(actual.push(0).basket).toBeArrayWithFloats(expected);
});

test('[].push(0.5) === [1.0]', () => {
  expect(basket.push(0.5).basket).toBeArrayWithFloats([1.0]);
});

test('[].push(-0.1) === [1.0]', () => {
  expect(basket.push(-0.1).basket).toBeArrayWithFloats([1.0]);
});

test('[].push(1.000001) === [1.0]', () => {
  expect(basket.push(1.000001).basket).toBeArrayWithFloats([1.0]);
});

test('[].push(2.0) === [1.0]', () => {
  expect(basket.push(2.0).basket).toBeArrayWithFloats([1.0]);
});

// general item removal cases
test('[0.5, 0.5].pop() === [1.0]', () => {
  let actual = basket.push().push(); // === [0.5, 0.5]
  let expected = [1.0];

  expect(actual.pop().basket).toBeArrayWithFloats(expected);
});

// item removal edge cases
test('[].pop() === []', () => {
  expect(basket.pop().basket).toEqual([]);
});

test('[1.0].pop() === []', () => {
  let actual = basket.push(); // === [1.0]
  let expected = [];

  expect(actual.pop().basket).toEqual(expected);
});

// general item displacement cases

// item displacement edge cases
