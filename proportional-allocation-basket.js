const addItemToBasket = function (currentBasket, allocation) {
  let newBasket = [];
  let previousNumberOfItems = currentBasket.length;
  let currentNumberOfItems = previousNumberOfItems + 1;

  // add constrains on allocation: [0, 1.0]
  if (allocation !== undefined) {
    if (allocation < 0 || allocation > 1.0) {
      allocation = 1.0;
    }
  }

  // calculate proportional multiplier for previous items allocation adjustment
  // depends on new item's allocation
  let proportionalMultiplier;
  if (allocation === undefined) {
    proportionalMultiplier = previousNumberOfItems / currentNumberOfItems;
  } else {
    proportionalMultiplier = 1.0 - allocation;
  }

  // adjust existing items' allocations proportionally
  currentBasket.forEach(function (item) {
    let itemAllocation = item;
    itemAllocation = itemAllocation * proportionalMultiplier;
    newBasket.push(itemAllocation);
  });

  // calculate new item's allocation
  let newItemAllocation = allocation;
  if (allocation === undefined) {
    if (previousNumberOfItems > 0) {
      newItemAllocation = 1 / currentNumberOfItems;
    } else {
      newItemAllocation = 1.0;
    }
  } else {
    if (newBasket.length === 0) {
      newItemAllocation = 1.0;
    }
  }

  if (newItemAllocation !== 0.0)
    newBasket.push(newItemAllocation);

  return newBasket;
};

// without index, pops the last item
const removeItemFromBasket = function (
    currentBasket,
    itemIndex = (currentBasket.length === 0 ? 0 : currentBasket.length - 1) ) {
  let newBasket = Array.from(currentBasket);
  const sumUpReducer = (acc, val) => acc + val;

  const itemIndexValid = itemIndex >= 0 && itemIndex < currentBasket.length;
  if (!itemIndexValid) {
    return newBasket;
  }

  newBasket.splice(itemIndex, 1);
  let sumOfRemainingAllocations = newBasket.reduce(sumUpReducer, 0);
  let proportionalMultiplier = 1 / sumOfRemainingAllocations;

  newBasket.forEach(
    (item, index, arr) => arr[index] = item * proportionalMultiplier
  );

  return newBasket;
}

const repositionItemInBasket = function (currentBasket, itemOldIndex, itemNewIndex) {
  let copyOfCurrentBasket = Array.from(currentBasket);
  let itemsRemovedArray = copyOfCurrentBasket.splice(itemOldIndex, 1);

  if (itemsRemovedArray.length === 0) {
    // index must've been wrong, so return copy of original basket
    return Array.from(currentBasket);
  } else {
    let itemRemoved = itemsRemovedArray[0];
    copyOfCurrentBasket.splice(itemNewIndex, 0, itemRemoved);
    return copyOfCurrentBasket;
  }
}

class ProportionalAllocationBasket {

  constructor(newBasket) {
    if (newBasket === undefined) {
      this.data = [];
    } else {
      this.data = newBasket;
    }
  }

  push() {
    return new ProportionalAllocationBasket(
      addItemToBasket(this.data)
    );
  }

  push(allocation) {
    return new ProportionalAllocationBasket(
      addItemToBasket(this.data, allocation)
    );
  }

  remove(index) {
    if (index === undefined)
      throw new Error('missing argument: index');

    return new ProportionalAllocationBasket(
      removeItemFromBasket(this.data, index)
    );
  }

  pop() {
    return new ProportionalAllocationBasket(removeItemFromBasket(this.data));
  }

  repositionItem(index, newIndex) {
    if (index === undefined || newIndex === undefined)
      throw Error('missing argument');

    return new ProportionalAllocationBasket(
      repositionItemInBasket(this.data, index, newIndex)
    );
  }

  get basket() {
    return this.data.slice();
  }

  set basket(newBasket) {
    this.data = newBasket;
  }
}

module.exports = new ProportionalAllocationBasket();

// Object.create(new ProportionalAllocationBasket()).prototype.addItem =
//   function (allocation) {
//     let newBasket = addItemToBasket(this.basket, allocation);
//     let newPab = new ProportionalAllocationBasket();
//     newPab.basket = newBasket;
//     return newPab;
// };

// ProportionalAllocationBasket.getBasket = function () {
//   return Array.from(this.basket);
// }

// export { ProportionalAllocationBasket };
