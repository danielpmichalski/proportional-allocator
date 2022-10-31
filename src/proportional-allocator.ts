// stateless? no! no need; it's easier to use the lib that way

// how should one use the lib? what is the API?
// if it's stateless, then it needs to return a new object everytime

// operations?
// mode: proportional
// + push item
// - add item at index
// - remove last item by popping it
// - remove item at index
// - increase item's allocation by X%
// - decrease item's allocation by X%
// mode: equal
// - push item
// - add item at index
// - remove last item by popping it
// - remove item at index
// - increase item's allocation by X% with equal mode
// - decrease item's allocation by X% with equal mode
// - clean up - remove all items that have allocation equal to 0

// questions
// - can an item have 0% allocation? e.g. add item1 -> 100%, lock it, add item2 -> 0% ? yes, this is a valid use case
// - what should happen when item is added with specified allocation, but all other are locked? should it get 0%? yes
// - do we want to allow increase/decrease of multiple items at the same time? what's the use case for this? let's skip it for now
//

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

    /**
     * Adds a new allocation at given position.
     *
     * The position can be negative or exceed the current collection's length. See examples below.
     *
     * @example
     * // empty allocator
     * allocator.add(0, undefined) => [1]
     * allocator.add(-1) => [1]
     * allocator.add(1) => [1]
     * // allocator with [0.4, 0.6]
     * allocator.add(0) => [0.333..., 0.222..., 0.444...]
     * allocator.add(-1) => [0.222..., 0.444..., 0.333...]
     * allocator.add(7) => [0.222..., 0.333..., 0.444...]
     * // add with value
     * allocator.add(7, 0.5) => [0.2, 0.5, 0.3]
     *
     * @param position the destined position of added element in the collection
     * @param allocation value of allocation
     */
    add(
        position: number,
        allocation?: number | undefined
    ): ProportionalAllocator {
        allocation && this.validate(allocation);

        if (allocation) {
            return new ProportionalAllocator(
                this.recalculateAndInsert(allocation, position)
            );
        } else {
            return new ProportionalAllocator(
                this.recalculateAndInsert(
                    1 / (this.allocations.length + 1),
                    position
                )
            );
        }
    }

    getRawAllocations() {
        return [...this.allocations];
    }

    // TODO add JSDoc
    /**
     *
     * @param allocation
     * @returns
     */
    push(allocation?: number): ProportionalAllocator {
        allocation && this.validate(allocation);

        if (this.allocations.length === 0) {
            return new ProportionalAllocator([1]);
        } else {
            if (allocation) {
                return new ProportionalAllocator(
                    this.recalculateAndInsert(allocation)
                );
            } else {
                return new ProportionalAllocator(
                    this.recalculateAndInsert(1 / (this.allocations.length + 1))
                );
            }
        }
    }

    private recalculateAndInsert(
        allocation: number,
        position?: number | undefined
    ) {
        const remainingAllocation = 1 - allocation;

        let newAllocations: number[] = [];
        newAllocations.push(
            ...this.allocations.map((i) => i * remainingAllocation)
        );
        if (position) {
            newAllocations = [
                ...newAllocations.slice(0, position),
                allocation,
                ...newAllocations.slice(position, newAllocations.length - 1),
            ];
            // TODO handle position < 0
            // TODO handle position > length - 1 (or length?)
        } else {
            newAllocations.push(allocation);
        }

        const newTotal = this.getTotal(newAllocations);
        newAllocations[newAllocations.length - 1] += 1 - newTotal;

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
