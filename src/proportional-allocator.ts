// stateless? no! no need; it's easier to use the lib that way

// how should one use the lib? what is the API?
// if it's stateless, then it needs to return a new object everytime

// operations?
// - push item
// - remove last item by popping it
// - add item at index
// - remove item at index
// - increase/decrease item's allocation by X% with proportional mode
// - increase/decrease item's allocation by X% with equal mode
// - clean up - remove all items that have allocation 0.0

// questions
// - can an item have 0% allocation? e.g. add item1 -> 100%, lock it, add item2 -> 0% ? yes, this is a valid use case
// - what should happen when item is added with specified allocation, but all other are locked? should it get 0%? yes
// - do we want to allow increase/decrease of multiple items at the same time? what's the use case for this? let's skip it for now
//

export class ProportionalAllocator {
    #allocations: number[] = [];

    constructor(allocations?: number[]) {
        if (allocations) {
            allocations.forEach((item) => this.#validate(item));
            const total = this.#getTotal(allocations);
            if (total > 1) {
                throw new Error('sum of input allocations cannot exceed 1');
            }
            if (total < 1) {
                throw new Error('sum of input allocations must equal 1');
            }
            this.#allocations.push(...allocations);
        }
    }

    getRawAllocations() {
        return [...this.#allocations].map(this.#toPrecision);
    }

    push(allocation?: number): ProportionalAllocator {
        allocation && this.#validate(allocation);

        let newAllocations = [];
        if (allocation) {
            if (this.#allocations.length === 0) {
                newAllocations.push(allocation);
            } else {
                // some allocations already there
            }
        } else {
            if (this.#allocations.length === 0) {
                newAllocations.push(1.0);
            } else {
                const numberOfItems = this.#allocations.length + 1;
                const newAllocation = 1 / numberOfItems;
                const remainingAllocation = 1 - newAllocation;

                newAllocations.push(
                    ...this.#allocations.map((i) => i * remainingAllocation)
                );
                newAllocations.push(newAllocation);

                newAllocations = newAllocations.map(this.#toPrecision);

                // add the remainder to the last item
                const newTotal = this.#getTotal(newAllocations);
                const remainder = this.#toPrecision(1 - newTotal);
                newAllocations[newAllocations.length - 1] += remainder;
            }
        }

        return new ProportionalAllocator(newAllocations);
    }

    #getTotal(allocations: number[]) {
        return allocations.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
        );
    }

    #toPrecision(allocation: number) {
        return Number.parseFloat(allocation.toFixed(4));
    }

    #validate(allocation: number) {
        if (allocation < 0 || allocation > 1) {
            throw new Error('allocation must be between 0 and 1');
        }
    }
}
