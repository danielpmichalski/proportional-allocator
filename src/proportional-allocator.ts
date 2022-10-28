// stateless? yes

// how should one use the lib? what is the API?
// if it's stateless, then it needs to return a new object everytime

// operations?
// - push item
// - remove last item by popping it
// - add item at index
// - remove item at index
// - increase/decrease item's allocation by X% with proportional mode
// - increase/decrease item's allocation by X% with equal mode

// questions
// - can an item have 0% allocation? e.g. add item1 -> 100%, lock it, add item2 -> 0% ? yes, this is a valid use case
// - what should happen when item is added with specified allocation, but all other are locked? should it get 0%? yes
// - do we want to allow increase/decrease of multiple items at the same time? what's the use case for this? let's skip it for now
//

export class ProportionalAllocator {
    #allocations: number[] = [];

    constructor(allocator?: ProportionalAllocator | undefined) {
        allocator && this.#allocations.push(...allocator.getRawAllocations());
    }

    getRawAllocations() {
        return [...this.#allocations];
    }
}
