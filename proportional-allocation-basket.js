const addItem = function (currentBasket, allocation) {
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

  newBasket.push(newItemAllocation);

  return newBasket;
};

// without index, pops the last item
const removeItem = function (
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

const repositionItem = function (currentBasket, itemOldIndex, itemNewIndex) {
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

module.exports = {
  addItem: addItem,
  removeItem: removeItem,
  repositionItem: repositionItem
}
