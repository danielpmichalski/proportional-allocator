import { ProportionalAllocator } from './proportional-allocator';

describe('pop', () => {
    test('popping empty allocations always results in empty allocations', () => {
        const allocator = new ProportionalAllocator();
        const firstPopped = allocator.pop();
        const secondPopped = allocator.pop();
        expect(firstPopped).toEqual(undefined);
        expect(secondPopped).toEqual(undefined);
        expect(allocator.getAllocations()).toStrictEqual([]);
    });

    test.each([
        ['pop from undefined => undefined, []', undefined, undefined, []],
        ['pop from [1] => 1, []', [1], 1, []],
        ['pop from [0.425, 0.575] => 0.575, [1]', [0.425, 0.575], 0.575, [1]],
        [
            'pop from [0.3333, 0.3333,0.3334] => 0.3334, [0.5, 0.5]',
            [0.3333, 0.3333, 0.3334],
            0.3334,
            [0.5, 0.5],
        ],
        [
            'pop from [0.2, 0.4, 0.4] => 0.4, [0.4, 0.6000000000000001]',
            [0.2, 0.4, 0.4],
            0.4,
            [0.4, 0.6000000000000001],
        ],
    ])(
        '%s',
        (
            _: string,
            input: number[] | undefined,
            expectedPoppedValue: number | undefined,
            expectedAllocations: number[]
        ) => {
            const allocator = new ProportionalAllocator(input);
            const poppedValue = allocator.pop();
            expect(poppedValue).toEqual(expectedPoppedValue);
            expect(allocator.getAllocations()).toStrictEqual(
                expectedAllocations
            );
        }
    );
});
