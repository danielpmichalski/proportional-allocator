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
            const total = allocations.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
            );
            if (total > 1) {
                throw new Error('sum of input allocations cannot exceed 1');
            }
            this.#allocations.push(...allocations);
        }
    }

    getRawAllocations() {
        return [...this.#allocations];
    }

    push(allocation?: number): ProportionalAllocator {
        allocation && this.#validate(allocation);

        const newAllocations = [];
        if (this.#allocations.length === 0) {
            if (allocation) {
                newAllocations.push(allocation);
            } else {
                newAllocations.push(1.0);
            }
        } else {
            if (allocation) {
                //
            } else {
                const newTotal = this.#allocations.length + 1;
                newAllocations.push(
                    ...this.#allocations.map((i) => i / newTotal)
                );
                newAllocations.push(1.0 / newTotal);
            }
        }

        return new ProportionalAllocator(newAllocations);
    }

    #validate(allocation: number) {
        if (allocation < 0 || allocation > 1) {
            throw new Error('allocation must be between 0 and 1');
        }
    }
}
