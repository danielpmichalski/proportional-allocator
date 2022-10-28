import { ProportionalAllocator } from './proportional-allocator';

describe('ProportionalAllocator', () => {
    const errorMsg = 'allocation must be between 0 and 1';

    describe('instantiation', () => {
        it('throws error when any input allocation is < 0', () => {
            expect(
                () => new ProportionalAllocator([0, -0.000000000000001])
            ).toThrowError(errorMsg);
        });

        it('throws error when any input allocation is > 1', () => {
            expect(
                () => new ProportionalAllocator([1.000000000000001, 0])
            ).toThrowError(errorMsg);
        });

        it('does not throw error when all allocations are between 0 and 1', () => {
            expect(
                () =>
                    new ProportionalAllocator([
                        0.999999999999999, 0.000000000000001,
                    ])
            ).not.toThrowError();
        });

        it('throws error when sum of allocations is > 1', () => {
            expect(
                () =>
                    new ProportionalAllocator([
                        0.999999999999999, 0.000000000000002,
                    ])
            ).toThrowError('sum of input allocations cannot exceed 1');
        });

        it('does not throw error when sum of allocations is exactly 1', () => {
            expect(
                () =>
                    new ProportionalAllocator([
                        0.999999999999999, 0.000000000000001,
                    ])
            ).not.toThrowError();
        });
    });

    describe('push allocation', () => {
        it('throws error when added allocation is < 0', () => {
            expect(() => {
                let allocator = new ProportionalAllocator();
                allocator.push(-0.000000000000001);
            }).toThrowError(errorMsg);
        });

        it('throws error when added allocation is > 1', () => {
            expect(() => {
                let allocator = new ProportionalAllocator();
                allocator.push(1.000000000000001);
            }).toThrowError(errorMsg);
        });

        it("adds 1st allocation with 100% when it's added without specified value", () => {
            let allocator = new ProportionalAllocator();
            allocator = allocator.push();
            expect(allocator.getRawAllocations()).toStrictEqual([1.0]);
        });

        it('adds 1st allocation with specified value', () => {
            let allocator = new ProportionalAllocator();
            allocator = allocator.push(0.5);
            expect(allocator.getRawAllocations()).toStrictEqual([0.5]);
        });

        it.skip('adds 2nd allocation and sets both allocations to 50%', () => {
            let allocator = new ProportionalAllocator([1]);
            allocator.push();
            expect(allocator.getRawAllocations()).toStrictEqual([0.5, 0.5]);
        });
    });

    describe('getRawAllocations', () => {
        it('returns empty array when allocator is empty', () => {
            const allocator = new ProportionalAllocator();
            expect(allocator.getRawAllocations()).toStrictEqual([]);
        });

        it('returns empty array when allocator is created with an empty allocations', () => {
            const allocator = new ProportionalAllocator([]);
            expect(allocator.getRawAllocations()).toStrictEqual([]);
        });

        it('returns raw allocations when allocator is created with an specific allocations', () => {
            const allocator = new ProportionalAllocator([0.75, 0.25]);
            expect(allocator.getRawAllocations()).toStrictEqual([0.75, 0.25]);
        });
    });
});
