# Proportional Allocator

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/danielpmichalski/proportional-allocator/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/danielpmichalski/proportional-allocator/tree/master)

## Overview

Proportional Allocator is an npm package written in TypeScript that makes it easy to work out changes to proportions of a collection of abstract items.

## Example usage

![Example usage](./proportional-sliders.gif)

## Use cases

The below cases use pseudo-code.

#### Case 1

Adding new items to a collection recalculates allocations of previously existing items proportionally (or equally), e.g.:

GIVEN Basket[{item1: 50%}, {item2: 50%}]

WHEN item3 is added

THEN Basket[{item1: 33.3%}, {item2: 33.3%}, {item3: 33.4%}]

AND Basket.totalAllocation is 100%

> Total allocation is guaranteed to be 100%

#### Case 2

Locking allocation of an item and adding a new one prevents changing allocation of the locked item, e.g.:

GIVEN Basket[{item1: 60%}, {item2: 40%}]

WHEN Basket.lock(item1)

AND item3 is added

THEN Basket[{item1: 60%}, {item2: 20%}, {item3: 20%}]

#### Case 3

Dynamic allocation changes to one item causes recalculation of allocations of all the other items equally, e.g.:

GIVEN Basket[{item1: 60%}, {item2: 20%}, {item3: 20%}]

AND allocation mode set to equal changes to other items' allocations

WHEN Basket.updateAllocation(item2, 45%)

THEN Basket[{item1: 47.5%}, {item2: 45%}, {item3: 7.5%}]

> Explanation: when item2 is updated to 45% allocation, the increase was 25%, so all the other 2 items' allocations descrease by 25% / 2 = 12.5%, so 60% - 12.5% = 47.5% and 20% - 12.5% = 7.5% respectively

#### Case 4

Dynamic allocation changes to one item causes recalculation of allocations of all the other items proportionally, e.g.:

GIVEN Basket[{item1: 60%}, {item2: 20%}, {item3: 20%}]

AND allocation mode set to proportional changes to other items' allocations

WHEN Basket.updateAllocation(item2, 45%)

THEN Basket[{item1: 41.25%}, {item2: 45%}, {item3: 13.75%}]

> Explanation: item1 and item2 had 60% and 20% allocations respectively, so item1 had 60% / (60% + 20%) = 60% / 80% = 6/8 = 3/4 = 75% of the remaning items' allocation, while item3 had 25%. The increase of 25 units of allocation to item2 caused 75% _ 25 = 18.75% unit drop to item1's allocation and 25% _ 25 = 6.25% unit drop for item3's allocation, giving 60% - 18.75% = 41.25% and 20% - 6.25% = 13.75% respectively.
