# Proportional Allocator

## Overview

Proportional Allocator is an npm package written in TypeScript that makes it easy to work out changes to proportions of a collection of abstract items.

## Use cases

#### Case 1
Adding new elements to a collection recalculates allocations of previously existing elements proportionally (or equally), e.g.:

GIVEN Basket[{element1: 50%}, {element2: 50%}]

WHEN  element3 is added

THEN  Basket[{element1: 33.3%}, {element2: 33.3%}, {element3: 33.4%}]

AND   Basket.totalAllocation is 100%

> Total allocation is guaranteed to be 100%

#### Case 2
Locking allocation of an element and adding a new one prevents changing allocation of the locked element, e.g.:

GIVEN Basket[{element1: 60%}, {element2: 40%}]

WHEN  Basket.lock(element1)

AND   element3 is added

THEN  Basket[{element1: 60%}, {element2: 20%}, {element3: 20%}]

#### Case 3
Dynamic allocation changes to one element causes recalculation of allocations of all the other elements based on allocation mode logic, e.g.:

GIVEN Basket[{element1: 60%}, {element2: 20%}, {element3: 20%}]

AND   allocation mode set to equal changes to other elements' allocations

WHEN  Basket.updateAllocation(element2, 45%)

THEN  Basket[{element1: 47.5%}, {element2: 45%}, {element3: 7.5%}]

> Explanation: when element2 is updated to 45% allocation, the increase was 25%, so all the other 2 elements' allocation descreased by 25%/2=12.5%, so 60%-12.5%=47.5% and 20%-12.5%=7.5% respectively

GIVEN Basket[{element1: 60%}, {element2: 20%}, {element3: 20%}]

AND   allocation mode set to proportional changes to other elements' allocations

WHEN  Basket.updateAllocation(element2, 45%)

THEN  Basket[{element1: 41.25%}, {element2: 45%}, {element3: 13.75%}]

> Explanation: element1 and element2 had 60% and 20% allocations respectively, so element1 had 60% / (60% + 20%) = 60% / 80% = 6/8 = 3/4 = 75% of the remaning elements' allocation, while element3 had 25%. The increase of 25 units of allocation to element2 caused 75% * 25 = 18.75% unit drop to element1's allocation and 25% * 25 = 6.25% unit drop for element3's allocation, giving 60% - 18.75% = 41.25% and 20% - 6.25% = 13.75% respectively.
