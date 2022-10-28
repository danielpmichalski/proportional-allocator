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

        it('throws error when sum of allocations is < 1', () => {
            expect(
                () =>
                    new ProportionalAllocator([
                        0.999999999999998, 0.000000000000001,
                    ])
            ).toThrowError('sum of input allocations must equal 1');
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

    describe('push', () => {
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

        test.each([
            ['empty + undefined => [1.0]', undefined, undefined, [1.0]],
            ['empty + 1.0 => [1.0]', undefined, 1, [1]],
            ['[1] + undefined => [0.5, 0.5]', [1], undefined, [0.5, 0.5]],
            [
                '[0.5, 0.5] + undefined => [0.3333, 0.3333, 0.3334]',
                [0.5, 0.5],
                undefined,
                [0.3333, 0.3333, 0.3334],
            ],
            [
                '[0.3333, 0.6667] + undefined => [0.2222, 0.4445, 0.3333]',
                [0.3333, 0.6667],
                undefined,
                [0.2222, 0.4445, 0.3333],
            ],
        ])(
            '%s',
            (
                _: string,
                input: number[] | undefined,
                allocation: number | undefined,
                expected: number[]
            ) => {
                let allocator = new ProportionalAllocator(input);
                allocator = allocator.push(allocation);
                expect(allocator.getRawAllocations()).toStrictEqual(expected);
            }
        );
    });

    describe('getRawAllocations', () => {
        it('returns empty array when allocator is empty', () => {
            const allocator = new ProportionalAllocator();
            expect(allocator.getRawAllocations()).toStrictEqual([]);
        });

        it('returns raw allocations when allocator is created with an specific allocations', () => {
            const allocator = new ProportionalAllocator([0.75, 0.25]);
            expect(allocator.getRawAllocations()).toStrictEqual([0.75, 0.25]);
        });
    });
});
