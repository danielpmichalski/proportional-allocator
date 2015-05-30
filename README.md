# proportional-allocation-basket

[![Build Status](https://img.shields.io/travis/danielpmichalski/proportional-allocation-basket/master.svg?style=flat-square)](https://travis-ci.org/danielpmichalski/proportional-allocation-basket)

## Overview

PAB or Proportional Allocation Basket is a Javascript library that allows you to add and remove elements from a basket and adjust allocations of those elements. 

The library might be used for example to adjust the allocation of financial instruments in a portfolio/basket, by modifying allocation of one or multiple instruments.

## Use cases

#### Case 1
Adding new elements to basket recalculates allocations of previously existing elements proportionally (or equally), e.g.:


GIVEN Basket[{element1: 50%}, {element2: 50%}]

WHEN  element3 is added

THEN  Basket[{element1: 33.3%}, {element2: 33.3%}, {element3: 33.4%}]

AND   Basket.totalAllocation == 100%


> Total allocation is guaranteed to be 100%.



#### Case 2
Locking allocation of an element and adding a new one prevents changing allocation of locked element, e.g.:


GIVEN Basket[{element1: 60%}, {element2: 40%}]

WHEN  Basket.lock(element1)

AND   element3 is added

THEN  Basket[{element1: 60%}, {element2: 20%}, {element3: 20%}]



#### Case 3
Dynamic allocation changes to one element recalculate allocations of all the other elements, e.g.:

Mode: Equal changes to other elements' allocations

GIVEN Basket[{element1: 60%}, {element2: 20%}, {element3: 20%}]

WHEN  Basket.updateAllocation(element2, 45%)

THEN  Basket[{element1: 47.5%}, {element2: 45%}, {element3: 7.5%}]


Mode: Proportional changes to other elements' allocations

GIVEN Basket[{element1: 60%}, {element2: 20%}, {element3: 20%}]

WHEN  Basket.updateAllocation(element2, 45%)

THEN  Basket[{element1: 41.25%}, {element2: 45%}, {element3: 13.75%}]

> Explanation: element1 and element2 had 60% and 20% respectively, so element1 had 75% of the remaning elements' allocation, while element3 had 25%, hence increase of 25 units to element2 caused 75% * 25 = 18.75 unit drop to element1's allocation and 25% * 25 = 6.25 unit drop for element3's allocation, giving 60 - 18.75 = 41.25 and 20 - 6.25 = 13.75 respectively.
