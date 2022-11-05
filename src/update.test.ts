import { ProportionalAllocator } from './proportional-allocator';

describe('update', () => {
    it('throws error when added allocation is < 0', () => {
        expect(() => {
            new ProportionalAllocator().update(0, -0.000000000000001);
        }).toThrowError('allocation must be between 0 and 1');
    });

    it('throws error when added allocation is > 1', () => {
        expect(() => {
            new ProportionalAllocator().update(0, 1.000000000000001);
        }).toThrowError('allocation must be between 0 and 1');
    });

    it('does not change any allocation when updating to same value', () => {
        const allocator = new ProportionalAllocator([0.4, 0.25, 0.35]);
        allocator.update(1, 0.25);
        expect(allocator.getAllocations()).toStrictEqual([0.4, 0.25, 0.35]);
    });

    describe('update to lower', () => {
        test.each([
            ['in undefined at position 0 to 0 => []', undefined, 0, 0, []],
            ['in [1] at position 0 to 0.9 => [1]', [1], 0, 0.9, [1]],
            ['in [1] at position 0 to 0.1 => [1]', [1], 0, 0.1, [1]],
            ['in [1] at position 0 to 0 => [1]', [1], 0, 0, [1]],
            [
                'in [0.4, 0.6] at position -1 to 0.5 => [0.4, 0.6]',
                [0.4, 0.6],
                -1, // any negative
                0.5,
                [0.4, 0.6],
            ],
            [
                'in [0.4, 0.6] at position 2 to 0.5 => [0.4, 0.6]',
                [0.4, 0.6],
                2, // higher than last
                0.5,
                [0.4, 0.6],
            ],
            [
                'in [0.4, 0.6] at position 0 to 0 => [0, 1]',
                [0.4, 0.6],
                0,
                0.0,
                [0, 1],
            ],
            [
                'in [0.4, 0.6] at position 1 to 0 => [1, 0]',
                [0.4, 0.6],
                1,
                0.0,
                [1, 0],
            ],
            [
                'in [0.3334, 0.3333, 0.3333] at position 0 to 0.1 => [0.1, 0.44999999999999996, 0.44999999999999996]',
                [0.3334, 0.3333, 0.3333],
                0,
                0.1,
                [0.1, 0.44999999999999996, 0.44999999999999996],
            ],
            [
                'in [0.3333, 0.3334, 0.3333] at position 1 to 0.1 => [0.44999999999999996, 0.1, 0.44999999999999996]',
                [0.3333, 0.3334, 0.3333],
                1,
                0.1,
                [0.44999999999999996, 0.1, 0.44999999999999996],
            ],
            [
                'in [0.3333, 0.3333, 0.3334] at position 2 to 0.1 => [0.44999999999999996, 0.44999999999999996, 0.1]',
                [0.3333, 0.3333, 0.3334],
                2,
                0.1,
                [0.44999999999999996, 0.44999999999999996, 0.1],
            ],
            [
                'in [0.4, 0.1, 0.5] at position 0 to 0 => [0, 0.30000000000000004, 0.7]',
                [0.4, 0.1, 0.5],
                0,
                0.0,
                [0, 0.30000000000000004, 0.7],
            ],
            [
                'in [0.4, 0.1, 0.5] at position 1 to 0 => [0.45, 0, 0.55]',
                [0.4, 0.1, 0.5],
                1,
                0.0,
                [0.45, 0, 0.55],
            ],
            [
                'in [0.4, 0.1, 0.5] at position 2 to 0 => [0.65, 0.35, 0]',
                [0.4, 0.1, 0.5],
                2,
                0.0,
                [0.65, 0.35, 0],
            ],
            [
                'in [0.2, 0.5, 0.3] at position 0 to 0.19 => [0.19, 0.505, 0.305]',
                [0.2, 0.5, 0.3],
                0,
                0.19,
                [0.19, 0.505, 0.305],
            ],
            // TODO add test cases which might cause bugs, e.g. lower to 0.000000000000001
            // TODO add test case with enormous collection (1,000,000)
        ])(
            '%s',
            (
                _: string,
                input: number[] | undefined,
                position: number,
                allocation: number,
                expected: number[]
            ) => {
                const allocator = new ProportionalAllocator(input);
                allocator.update(position, allocation);
                expect(allocator.getAllocations()).toStrictEqual(expected);
            }
        );
    });

    describe('update to higher', () => {
        test.each([
            ['in undefined at position 0 to 1 => []', undefined, 0, 1.0, []],
            ['in [1] at position 0 to 1 => [1]', [1], 0, 1.0, [1]],
            [
                'in [0.5, 0.5] at position 0 to 0.5000000000000001 => [0.5000000000000001, 0.4999999999999999]',
                [0.5, 0.5],
                0,
                0.5000000000000001,
                [0.5000000000000001, 0.4999999999999999],
            ],
            [
                'in [0.5, 0.5] at position 0 to 0.99999999999999999 => [1, 0]',
                [0.5, 0.5],
                0,
                0.99999999999999999,
                [1, 0],
            ],
            [
                'in [0.5, 0.5] at position 1 to 1.0 => [1, 0]',
                [0.5, 0.5],
                0,
                1.0,
                [1, 0],
            ],
            [
                'in [0.5, 0.5] at position 1 to 0.5000000000000001 => [0.4999999999999999, 0.5000000000000001]',
                [0.5, 0.5],
                1,
                0.5000000000000001,
                [0.4999999999999999, 0.5000000000000001],
            ],
            [
                'in [0.5, 0.5] at position 1 to 0.99999999999999999 => [0, 1]',
                [0.5, 0.5],
                1,
                0.99999999999999999,
                [0, 1],
            ],
            [
                'in [0.5, 0.5] at position 1 to 0.9999999999999999 => [0, 0.9999999999999999]',
                [0.5, 0.5],
                1,
                0.9999999999999999,
                [0, 0.9999999999999999],
            ],
            [
                'in [0.5, 0.5] at position 1 to 1.0 => [0, 1]',
                [0.5, 0.5],
                1,
                1.0,
                [0, 1],
            ],
            [
                'in [0.2, 0.5, 0.3] at position 0 to 0.2000000000000001 => [0.2000000000000001, 0.49999999999999994, 0.29999999999999993]',
                [0.2, 0.5, 0.3],
                0,
                0.2000000000000001,
                [0.2000000000000001, 0.49999999999999994, 0.29999999999999993],
            ],
            [
                'in [0.2, 0.5, 0.3] at position 0 to 1.0 => [1, 0, 0]',
                [0.2, 0.5, 0.3],
                0,
                1.0,
                [1, 0, 0],
            ],
            [
                'in [0.2, 0.4, 0.2, 0.2] at position 0 to 1.0 => [1, 0, 0, 0]',
                [0.2, 0.4, 0.2, 0.2],
                0,
                1.0,
                [1, 0, 0, 0],
            ],
            [
                'in [0.5, 0.2, 0.2, 0.1] at position 0 to 1.0 => [1, 0, 0, 0]',
                [0.5, 0.2, 0.2, 0.1],
                0,
                1.0,
                [1, 0, 0, 0],
            ],
            [
                'in [0.5, 0.2, 0.2, 0.05, 0.05, 0.05] at position 0 to 1.0 => [1, 0, 0, 0, 0, 0]',
                [0.5, 0.2, 0.15, 0.05, 0.05, 0.05],
                0,
                1.0,
                [1, 0, 0, 0, 0, 0],
            ],
            [
                'in [0.2, 0.5, 0.3] at position 0 to 0.8 => [0.8, 0.19999999999999996, 0]',
                [0.2, 0.5, 0.3],
                0,
                0.8,
                [0.8, 0.19999999999999996, 0],
            ],
            // TODO add test case with enormous collection (1,000,000)
        ])(
            '%s',
            (
                _: string,
                input: number[] | undefined,
                position: number,
                allocation: number,
                expected: number[]
            ) => {
                const allocator = new ProportionalAllocator(input);
                allocator.update(position, allocation);
                expect(allocator.getAllocations()).toStrictEqual(expected);
            }
        );
    });
});
