# Proportional Allocator

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/danielpmichalski/proportional-allocator/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/danielpmichalski/proportional-allocator/tree/master)

## Overview

Proportional Allocator is an npm package written in TypeScript that makes it easy to work out changes to proportions of a collection of abstract items.

## Example usage

![Example usage](https://github.com/danielpmichalski/proportional-allocator/raw/master/proportional-sliders.gif)

## Use cases

The below cases use pseudo-code.

### Case 1

Adding new items to a collection recalculates allocations of previously existing items proportionally (or equally), e.g.:

GIVEN Basket[{item1: 50%}, {item2: 50%}]

WHEN item3 is added

THEN Basket[{item1: 33.3%}, {item2: 33.3%}, {item3: 33.4%}]

AND Basket.totalAllocation is 100%

> Total allocation is guaranteed to be 100%

### Case 2

Dynamic allocation changes to one item causes recalculation of allocations of all the other items equally, e.g.:

GIVEN Basket[{item1: 60%}, {item2: 20%}, {item3: 20%}]

WHEN Basket.updateAllocation(item2, 45%)

THEN Basket[{item1: 47.5%}, {item2: 45%}, {item3: 7.5%}]

> Explanation: when item2 is updated to 45% allocation, the increase was 25%, so all the other 2 items' allocations descrease by 25% / 2 = 12.5%, so 60% - 12.5% = 47.5% and 20% - 12.5% = 7.5% respectively
