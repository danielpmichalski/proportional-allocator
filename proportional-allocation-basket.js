/* operations needs:
- add item
  +with 0 items: 1st item gets 100%
  +with 1 item: 1st and 2nd get 50%
  +with 2 items having 50%: all get 33.3%
  with 2 items not 50-50:
    mode 1: (no params)
      new item gets 33.3% (100% / numberOfAllItems), the previously existing get 66.6% split proportionally to how they were before addition
        e.g. item1 is 40%, item2 is 60%; adding item3 causes: item1 is 0.4*0.666 = 26.64%, item2 is 0.6*0.666 = 39.96%, item3 is 33.3%
          result basket: {item1: 26.66%, item2: 39.99%, item3: 33.33%}
    mode 2: (with param setting beginning allocation for item3)
      new item gets allocation as specified (100% is allowed, remaining items get 0% allocation set), all other get proportionally less
        e.g. item1 is 40%, item2 is 60%; adding item3 with 40% beginning allocation causes: item1 is 0.4*0.6 = 24%, item2 is 0.6*0.6 = 36%
          result basket: {item1: 24%, item2: 36%, item3: 40%}
- remove item at index:
  with 0 items: empty basket returned
  with 1 item: empty basket returned
  with 2 items: basket with remaining item (now having 100%) returned
  with 3 items: basket with remaining 2 items (both having proportional allocation) returned
    e.g. current basket: {item1: 45%, item2: 27%, item3: 28%}; removing item3 causes:
      result basket: {item1: 62.5%, item2: 37.5%} (because item1 and item2 had that allocation against themselves)

strategies:
- always return new basket object (pure functions <3)

to solve:
- rounding strategy - no need ;)
*/
const addItem = function(currentBasket, allocation) {
  var newBasket = [];
  var previousNumberOfItems = currentBasket.length;
  var currentNumberOfItems = previousNumberOfItems + 1;

  // add constraints on allocation: [0, 1.0]

  // calculate proportional multiplier for previous items allocation adjustment; depends on new item's allocation
  var proportionalMultiplier;
  if (allocation === undefined) {
    proportionalMultiplier = previousNumberOfItems / currentNumberOfItems;
  } else {
    proportionalMultiplier = 1.0 - allocation;
  }

  // adjust existing item's allocations proportionally
  currentBasket.forEach(function(item) {
    var itemAllocation = item;
    itemAllocation = itemAllocation * proportionalMultiplier;
    newBasket.push(itemAllocation);
  });

  // calculate new item's allocation
  var newItemAllocation = allocation;
  if (allocation === undefined) {
    if (previousNumberOfItems > 0) {
      newItemAllocation = 1 / currentNumberOfItems;
    } else {
      newItemAllocation = 1.0;
    }
  }
  newBasket.push(newItemAllocation);

  return newBasket;
};

// without index, pops the last item
const removeItem = function(currentBasket, itemIndex = (currentBasket.length === 0 ? 0 : currentBasket.length - 1) ) {
  var newBasket = Array.from(currentBasket);
  const sumUpReducer = (acc, val) => acc + val;

  const itemIndexValid = itemIndex >= 0 && itemIndex < currentBasket.length;
  if (!itemIndexValid) {
    return newBasket;
  }

  newBasket.splice(itemIndex, 1);
  var sumOfRemainingAllocations = newBasket.reduce(sumUpReducer, 0);
  var proportionalMultiplier = 1 / sumOfRemainingAllocations;

  newBasket.forEach((item, index, arr) => arr[index] = item * proportionalMultiplier);

  return newBasket;
}

const repositionItem = function(currentBasket, itemOldIndex, itemNewIndex) {
  var copyOfCurrentBasket = Array.from(currentBasket);
  var itemsRemovedArray = copyOfCurrentBasket.splice(itemOldIndex, 1);

  if (itemsRemovedArray.length === 0) {
    // index must've been wrong, so return copy of original basket
    return Array.from(currentBasket);
  } else {
    var itemRemoved = itemsRemovedArray[0];
    copyOfCurrentBasket.splice(itemNewIndex, 0, itemRemoved);
    return copyOfCurrentBasket;
  }
}

function precise(num, prec = 4) {
  return Number.parseFloat(num).toPrecision(prec);
}

Array.prototype.equals = function (other) {
  if (!Array.isArray(other)) {
    return false;
  } else if (this.length !== other.length) {
    return false;
  } else {
    for (let i = 0; i < this.length; i++) {
      var first = precise(this[i]);
      var second = precise(other[i]);
      if (first - second >= 0.001) {
        return false;
      }
    }
    return true;
  }
}

// testing functions
const assertEquals = function (actual, expected) {
  if (!Array.isArray(actual) || !Array.isArray(expected)) {
    return false;
  } else {
    if (!actual.equals(expected)) {
      return false;
    } else {
      return true;
    }
  }
}

const verify = function (actual, expected) {
  if (!actual.equals(expected)) {
    throw 'baskets are not equal';
  }
}

// console.log("[1, 2] === [1, 2] -> true ? ", [1, 2].equals([1, 2]));
// console.log("[1, 2] === [1, 3] -> false ? ", [1, 2].equals([1, 3]));

let basket = [];
console.log("basket1: ", basket);
verify(basket, []);

basket = addItem(basket);
console.log("basket1 with added item: ", basket);
verify(basket, [1.0]);

basket = addItem(basket);
console.log("basket1 with added item: ", basket);
verify(basket, [0.5, 0.5]);

basket = addItem(basket);
console.log("basket1 with added item: ", basket);
verify(basket, [0.333, 0.333, 0.333]);

basket = addItem(basket);
console.log("basket1 with added item: ", basket);
verify(basket, [0.25, 0.25, 0.25, 0.25]);

let basket2 = [1.0];
console.log("basket2: ", basket2);
verify(basket2, [1.0]);

basket2 = addItem(basket2, 0.5);
console.log("basket2 with added item with allocation 0.5: ", basket2);
verify(basket2, [0.5, 0.5]);

basket2 = addItem(basket2, 0.5);
console.log("basket2 with added item with allocation 0.5: ", basket2);
verify(basket2, [0.25, 0.25, 0.5]);

basket2 = addItem(basket2, 1.0);
console.log("basket2 with added item with allocation 1.0: ", basket2);
verify(basket2, [0, 0, 0, 1]);

basket2 = addItem(basket2, 0.75);
console.log("basket2 with added item with allocation 0.75: ", basket2);
verify(basket2, [0, 0, 0, 0.25, 0.75]);

basket2 = addItem(basket2, 0);
console.log("basket2 with added item with allocation 0.0: ", basket2);
verify(basket2, [0, 0, 0, 0.25, 0.75, 0]);

basket2 = addItem(basket2);
console.log("basket2 with added item: ", basket2);
verify(basket2, [0, 0, 0, ]);

let basket3 = [];
console.log("basket3: ", basket3);

basket3 = removeItem(basket3);
console.log("basket3 with removed item: ", basket3);

basket3 = addItem(addItem(basket3));
console.log("basket3 with 2 items added: ", basket3);

basket3 = removeItem(basket3);
console.log("basket3 with removed item: ", basket3);

basket3 = addItem(addItem(basket3, 0.45), 0.4);
console.log("basket3 with 2 items added: ", basket3);

basket3 = removeItem(basket3);
console.log("basket3 with removed item: ", basket3);
basket3 = repositionItem(basket3, 1, 0);
console.log("basket3 with repositioned item: ", basket3);

basket3 = removeItem(basket3);
console.log("basket3 with removed item: ", basket3);

basket3 = removeItem(basket3);
console.log("basket3 with removed item: ", basket3);

basket3 = removeItem(basket3);
console.log("basket3 with removed item: ", basket3);
