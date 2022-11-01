// stateless? no! no need; it's easier to use the lib that way

// TODO
// mode: proportional
// + push item
// + add item at index
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
// - add JSDoc to the class

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
     * // index 0 is the first item, as with normal array
     * allocator.add(0) => [0.333..., 0.222..., 0.444...]
     * allocator.add(-1) => [0.222..., 0.444..., 0.333...] // added at the end
     * allocator.add(7) => [0.222..., 0.333..., 0.444...] // position rotated
     * // add with value
     * allocator.add(7, 0.5) => [0.2, 0.5, 0.3]
     *
     * @param position the position of newly added element in the collection
     * @param allocation value of allocation
     */
    add(
        position: number,
        allocation?: number | undefined
    ): ProportionalAllocator {
        allocation && this.validate(allocation);

        if (allocation) {
            this.insertAndRecalculate(allocation, position);
        } else {
            this.insertAndRecalculate(
                1 / (this.allocations.length + 1),
                position
            );
        }
        return this;
    }

    getAllocations() {
        return [...this.allocations];
    }

    /**
     * Adds the given allocation at the end of the collection.
     */
    push(allocation?: number): ProportionalAllocator {
        return this.add(this.allocations.length, allocation);
    }

    private insertAndRecalculate(allocation: number, position: number) {
        const remainingAllocation = 1 - allocation;

        this.allocations.forEach(
            (value, index, array) =>
                (array[index] = value * remainingAllocation)
        );
        this.insertAllocation(position, allocation);

        const newTotal = this.getTotal(this.allocations);
        this.allocations[this.allocations.length - 1] += 1 - newTotal;
    }

    private insertAllocation(position: number, allocation: number) {
        this.allocations.splice(
            this.getRotatedPosition(position),
            0, // delete 0 elements
            allocation
        );
    }

    private getRotatedPosition(position: number) {
        const length = this.allocations.length;
        if (position >= 0) {
            return position % (length + 1);
        } else {
            return (length + 1 + (position % (length + 1))) % (length + 1);
        }
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
