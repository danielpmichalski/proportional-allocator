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

/**
 * Issues:
 * - some items might get 0 value when adding them to collection of size around the higher boundary, i.e. around 10,000 items (due to precision: 4)
 */
export class ProportionalAllocator {
    private allocations: number[] = [];

    constructor(allocations?: number[]) {
        if (allocations) {
            allocations.forEach((item) => this.validate(item));
            const total = this.getTotal(allocations);
            if (total > 1) {
                throw new Error('sum of input allocations cannot exceed 1');
            }
            if (total < 1) {
                throw new Error('sum of input allocations must equal 1');
            }
            this.allocations.push(...allocations);
        }
    }

    getRawAllocations() {
        return [...this.allocations];
    }

    push(allocation?: number): ProportionalAllocator {
        allocation && this.validate(allocation);

        let newAllocations = [];
        if (allocation) {
            if (this.allocations.length === 0) {
                newAllocations.push(allocation);
            } else {
                newAllocations = this.addAndRecalculate(allocation);
            }
        } else {
            if (this.allocations.length === 0) {
                newAllocations.push(1.0);
            } else {
                const numberOfItems = this.allocations.length + 1;
                const newAllocation = 1 / numberOfItems;

                newAllocations = this.addAndRecalculate(newAllocation);
            }
        }

        return new ProportionalAllocator(newAllocations);
    }

    private addAndRecalculate(allocation: number) {
        const remainingAllocation = 1 - allocation;

        let newAllocations: number[] = [];
        newAllocations.push(
            ...this.allocations.map((i) => i * remainingAllocation)
        );
        newAllocations.push(allocation);

        // add the remainder to the last item
        const newTotal = this.getTotal(newAllocations);
        const remainder = 1 - newTotal;
        newAllocations[newAllocations.length - 1] += remainder;

        return newAllocations;
    }

    private getTotal(allocations: number[]) {
        return allocations.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
        );
    }

    private validate(allocation: number) {
        if (allocation < 0 || allocation > 1) {
            throw new Error('allocation must be between 0 and 1');
        }
    }
}
