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
  if (!Array.isArray(actual) || !Array.isArray(expected)) {
    return false;
  } else {
    return arrayWithFloatsEquals(actual, expected, precision);
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
test('addItem([1.0]) == [0.5, 0.5]', () => {
  expect(basket.addItem([1.0])).toBeArrayWithFloats([0.5, 0.5]);
});

test('addItem([0.5, 0.5]) == [0.3333, 0.3333, 0.3333]', () => {
  expect(basket.addItem([0.5, 0.5])).toBeArrayWithFloats([0.3333, 0.3333, 0.3333]);
});

// item addition edge cases
test('addItem([]) == [1.0]', () => {
  expect(basket.addItem([])).toBeArrayWithFloats([1.0]);
});

test('addItem([], 1.0) == [1.0]', () => {
  expect(basket.addItem([], 1.0)).toBeArrayWithFloats([1.0]);
});

test('addItem([], 0) == [1.0]', () => {
  expect(basket.addItem([], 0)).toBeArrayWithFloats([1.0]);
});

test('addItem([], 0.5) == [1.0]', () => {
  expect(basket.addItem([], 0.5)).toBeArrayWithFloats([1.0]);
});

test('addItem([], -0.1) == [1.0]', () => {
  expect(basket.addItem([], -0.1)).toBeArrayWithFloats([1.0]);
});

test('addItem([], 1.000001) == [1.0]', () => {
  expect(basket.addItem([], 1.000001)).toBeArrayWithFloats([1.0]);
});

test('addItem([], 2.0) == [1.0]', () => {
  expect(basket.addItem([], 2.0)).toBeArrayWithFloats([1.0]);
});

// general item removal cases

// item removal edge cases

// general item displacement cases

// item displacement edge cases
