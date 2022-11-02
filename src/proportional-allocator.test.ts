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
                () => new ProportionalAllocator([0.9999, 0.0002])
            ).toThrowError('sum of input allocations cannot exceed 1');
        });

        it('throws error when sum of allocations is < 1', () => {
            expect(
                () => new ProportionalAllocator([0.9998, 0.0001])
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

    describe('add', () => {
        describe('without value', () => {
            test.each([
                [
                    'undefined + undefined at 0 => [1]',
                    undefined,
                    0,
                    undefined,
                    [1],
                ],
                ['undefined + 1.0 at 0 => [1]', undefined, 0, 1, [1]],
                ['undefined + 0.5 at 0 => [1]', undefined, 0, 0.5, [1]],
                [
                    '[1] + undefined at 0 => [0.5, 0.5]',
                    [1],
                    0,
                    undefined,
                    [0.5, 0.5],
                ],
                [
                    '[1] + undefined at 1 => [0.5, 0.5]',
                    [1],
                    1,
                    undefined,
                    [0.5, 0.5],
                ],
                [
                    '[0.3, 0.7] + undefined at 0 => [0.3333333333333333, 0.2, 0.4666666666666667]',
                    [0.3, 0.7],
                    0,
                    undefined,
                    [0.3333333333333333, 0.2, 0.4666666666666667],
                ],
                [
                    '[0.3, 0.7] + undefined at 1 => [0.2, 0.3333333333333333, 0.4666666666666667]',
                    [0.3, 0.7],
                    1,
                    undefined,
                    [0.2, 0.3333333333333333, 0.4666666666666667],
                ],
                [
                    '[0.3, 0.7] + undefined at 2 => [0.2, 0.4666666666666667, 0.3333333333333333]',
                    [0.3, 0.7],
                    2,
                    undefined,
                    [0.2, 0.4666666666666667, 0.3333333333333333],
                ],
                [
                    '[0.3, 0.7] + undefined at 3 => [0.3333333333333333, 0.2, 0.4666666666666667]',
                    [0.3, 0.7],
                    3, // 1st
                    undefined,
                    [0.3333333333333333, 0.2, 0.4666666666666667],
                ],
                [
                    '[0.3, 0.7] + undefined at 4 => [0.2, 0.3333333333333333, 0.4666666666666667]',
                    [0.3, 0.7],
                    4, // 2nd
                    undefined,
                    [0.2, 0.3333333333333333, 0.4666666666666667],
                ],
                [
                    '[0.3, 0.7] + undefined at 5 => [0.2, 0.4666666666666667, 0.3333333333333333]',
                    [0.3, 0.7],
                    5, // last
                    undefined,
                    [0.2, 0.4666666666666667, 0.3333333333333333],
                ],
                [
                    '[0.1, 0.9] + undefined at -1 => [0.06666666666666668, 0.6000000000000001, 0.3333333333333333]',
                    [0.1, 0.9],
                    -1, // last
                    undefined,
                    [
                        0.06666666666666668, 0.6000000000000001,
                        0.3333333333333333,
                    ],
                ],
                [
                    '[0.1, 0.9] + undefined at -2 => [0.06666666666666668, 0.3333333333333333, 0.6000000000000001]',
                    [0.1, 0.9],
                    -2, // 2nd to last
                    undefined,
                    [
                        0.06666666666666668, 0.3333333333333333,
                        0.6000000000000001,
                    ],
                ],
                [
                    '[0.1, 0.9] + undefined at -3 => [0.3333333333333333, 0.06666666666666668, 0.6000000000000001]',
                    [0.1, 0.9],
                    -3, // last to last
                    undefined,
                    [
                        0.3333333333333333, 0.06666666666666668,
                        0.6000000000000001,
                    ],
                ],
                [
                    '[0.1, 0.9] + undefined at -4 => [0.06666666666666668, 0.6000000000000001, 0.3333333333333333]',
                    [0.1, 0.9],
                    -4, // last
                    undefined,
                    [
                        0.06666666666666668, 0.6000000000000001,
                        0.3333333333333333,
                    ],
                ],
                [
                    '[0.1, 0.9] + undefined at -5 => [0.06666666666666668, 0.6000000000000001, 0.3333333333333333]',
                    [0.1, 0.9],
                    -5, // 2nd to last
                    undefined,
                    [
                        0.06666666666666668, 0.3333333333333333,
                        0.6000000000000001,
                    ],
                ],
                [
                    '[0.1, 0.9] + undefined at -6 => [0.06666666666666668, 0.6000000000000001, 0.3333333333333333]',
                    [0.1, 0.9],
                    -6, // last to last
                    undefined,
                    [
                        0.3333333333333333, 0.06666666666666668,
                        0.6000000000000001,
                    ],
                ],
            ])(
                '%s',
                (
                    _: string,
                    input: number[] | undefined,
                    position: number,
                    allocation: number | undefined,
                    expected: number[]
                ) => {
                    const allocator = new ProportionalAllocator(input);
                    allocator.add(position, allocation);
                    expect(allocator.getAllocations()).toStrictEqual(expected);
                }
            );
        });

        describe('with value', () => {
            test.each([
                ['undefined + 1.0 at 0 => [1]', undefined, 0, 1.0, [1]],
                ['undefined + 0.5 at 1 => [1]', undefined, 1, 0.5, [1]],
                ['undefined + 0.5 at 100 => [1]', undefined, 100, 0.5, [1]],
                ['undefined + 0.5 at -100 => [1]', undefined, -100, 0.5, [1]],
                ['[1] + 1.0 at -1 => [0, 1]', [1], -1, 1.0, [0, 1]],
                ['[1] + 1.0 at 0 => [1, 0]', [1], 0, 1.0, [1, 0]],
                ['[1] + 1.0 at 1 => [0, 1]', [1], 1, 1.0, [0, 1]],
                ['[1] + 1.0 at 2 => [1, 0]', [1], 2, 1.0, [1, 0]],
                [
                    '[1] + 0.75 at -1 => [0.25, 0.75]',
                    [1],
                    -1,
                    0.75,
                    [0.25, 0.75],
                ],
                ['[1] + 0.75 at 0 => [0.75, 0.25]', [1], 0, 0.75, [0.75, 0.25]],
                ['[1] + 0.75 at 1 => [0.25, 0.75]', [1], 1, 0.75, [0.25, 0.75]],
                ['[1] + 0.75 at 2 => [0.75, 0.25]', [1], 2, 0.75, [0.75, 0.25]],
                [
                    '[0.4, 0.6] + 0.85 at -1 => [0.06000000000000001, 0.09000000000000001, 0.85]',
                    [0.4, 0.6],
                    -1,
                    0.85,
                    [0.06000000000000001, 0.09000000000000001, 0.85],
                ],
                [
                    '[0.4, 0.6] + 0.85 at 0 => [0.85, 0.06000000000000001, 0.09000000000000001]',
                    [0.4, 0.6],
                    0,
                    0.85,
                    [0.85, 0.06000000000000001, 0.09000000000000001],
                ],
                [
                    '[0.4, 0.6] + 0.85 at 1 => [0.06000000000000001, 0.85, 0.09000000000000001]',
                    [0.4, 0.6],
                    1,
                    0.85,
                    [0.06000000000000001, 0.85, 0.09000000000000001],
                ],
                [
                    '[0.4, 0.6] + 0.85 at 2 => [0.06000000000000001, 0.09000000000000001, 0.85]',
                    [0.4, 0.6],
                    2, // last
                    0.85,
                    [0.06000000000000001, 0.09000000000000001, 0.85],
                ],
                [
                    '[0.4, 0.6] + 0.85 at 3 => [0.85, 0.06000000000000001, 0.09000000000000001]',
                    [0.4, 0.6],
                    3, // at 1st
                    0.85,
                    [0.85, 0.06000000000000001, 0.09000000000000001],
                ],
            ])(
                '%s',
                (
                    _: string,
                    input: number[] | undefined,
                    position: number,
                    allocation: number | undefined,
                    expected: number[]
                ) => {
                    const allocator = new ProportionalAllocator(input);
                    allocator.add(position, allocation);
                    expect(allocator.getAllocations()).toStrictEqual(expected);
                }
            );
        });
    });

    describe('push', () => {
        it('throws error when added allocation is < 0', () => {
            expect(() => {
                new ProportionalAllocator().push(-0.000000000000001);
            }).toThrowError(errorMsg);
        });

        it('throws error when added allocation is > 1', () => {
            expect(() => {
                new ProportionalAllocator().push(1.000000000000001);
            }).toThrowError(errorMsg);
        });

        describe('without value', () => {
            test.each([
                ['undefined + undefined => [1.0]', undefined, undefined, [1.0]],
                ['[1] + undefined => [0.5, 0.5]', [1], undefined, [0.5, 0.5]],
                [
                    '[0.5, 0.5] + undefined => [0.33333333333333337, 0.33333333333333337, 0.3333333333333333]',
                    [0.5, 0.5],
                    undefined,
                    [
                        0.33333333333333337, 0.33333333333333337,
                        0.3333333333333333,
                    ],
                ],
                [
                    '[0.3333, 0.6667] + undefined => [0.2222, 0.4444666666666667, 0.3333333333333333]',
                    [0.3333, 0.6667],
                    undefined,
                    [0.2222, 0.4444666666666667, 0.3333333333333333],
                ],
                [
                    '[0.6666, 0.3334] + undefined => [0.4444, 0.22226666666666667, 0.3333333333333333]',
                    [0.6666, 0.3334],
                    undefined,
                    [0.4444, 0.22226666666666667, 0.3333333333333333],
                ],
                [
                    '[0.0001, 0.9999] + undefined => [0.00006666666666666668, 0.6666000000000001, 0.3333333333333333]',
                    [0.0001, 0.9999],
                    undefined,
                    [
                        0.00006666666666666668, 0.6666000000000001,
                        0.3333333333333333,
                    ],
                ],
                [
                    '[0.9999, 0.0001] + undefined => [0.6666000000000001, 0.00006666666666666668, 0.3333333333333333]',
                    [0.9999, 0.0001],
                    undefined,
                    [
                        0.6666000000000001, 0.00006666666666666668,
                        0.3333333333333333,
                    ],
                ],
                [
                    '[0.3333, 0.3333, 0.3334] + undefined => [0.249975, 0.249975, 0.25005, 0.25]',
                    [0.3333, 0.3333, 0.3334],
                    undefined,
                    [0.249975, 0.249975, 0.25005, 0.25],
                ],
                [
                    '[0.0001, 0.0001, 0.9998] + undefined => [0.00007500000000000001, 0.00007500000000000001, 0.74985, 0.25]',
                    [0.0001, 0.0001, 0.9998],
                    undefined,
                    [
                        0.00007500000000000001, 0.00007500000000000001, 0.74985,
                        0.25,
                    ],
                ],
                [
                    '[0.0001, 0.9998, 0.0001] + undefined => [0.00007500000000000001, 0.74985, 0.00007500000000000001, 0.25]',
                    [0.0001, 0.9998, 0.0001],
                    undefined,
                    [
                        0.00007500000000000001, 0.74985, 0.00007500000000000001,
                        0.25,
                    ],
                ],
                [
                    '[0.9998, 0.0001, 0.0001] + undefined => [0.74985, 0.00007500000000000001, 0.00007500000000000001, 0.25]',
                    [0.9998, 0.0001, 0.0001],
                    undefined,
                    [
                        0.74985, 0.00007500000000000001, 0.00007500000000000001,
                        0.25,
                    ],
                ],
            ])(
                '%s',
                (
                    _: string,
                    input: number[] | undefined,
                    allocation: number | undefined,
                    expected: number[]
                ) => {
                    const allocator = new ProportionalAllocator(input);
                    allocator.push(allocation);
                    expect(allocator.getAllocations()).toStrictEqual(expected);
                }
            );
        });

        describe('with value', () => {
            test.each([
                ['empty + 0.1 => [1.0]', undefined, 0.5, [1]],
                ['empty + 1.0 => [1.0]', undefined, 1, [1]],
                ['[1] + 0.5 => [0.5, 0.5]', [1], 0.5, [0.5, 0.5]],
                [
                    '[0.5, 0.5] + 0.0001 => [0.49995, 0.49995, 0.0001]',
                    [0.5, 0.5],
                    0.0001,
                    [0.49995, 0.49995, 0.0001],
                ],
                [
                    '[0.5, 0.5] + 0.0002 => [0.4999, 0.4999, 0.0002]',
                    [0.5, 0.5],
                    0.0002,
                    [0.4999, 0.4999, 0.0002],
                ],
                [
                    '[0.5, 0.5] + 0.3334 => [0.33330000000000004, 0.33330000000000004, 0.3334]',
                    [0.5, 0.5],
                    0.3334,
                    [0.33330000000000004, 0.33330000000000004, 0.3334],
                ],
                [
                    '[0.5, 0.5] + 0.9998 => [0.00009999999999998899, 0.00009999999999998899, 0.9998]',
                    [0.5, 0.5],
                    0.9998,
                    [0.00009999999999998899, 0.00009999999999998899, 0.9998],
                ],
                [
                    '[0.5, 0.5] + 0.9999 => [0.00004999999999999449, 0.00004999999999999449, 0.9999]',
                    [0.5, 0.5],
                    0.9999,
                    [0.00004999999999999449, 0.00004999999999999449, 0.9999],
                ],
                ['[0.5, 0.5] + 1 => [0, 0, 1]', [0.5, 0.5], 1, [0, 0, 1]],
            ])(
                '%s',
                (
                    _: string,
                    input: number[] | undefined,
                    allocation: number | undefined,
                    expected: number[]
                ) => {
                    const allocator = new ProportionalAllocator(input);
                    allocator.push(allocation);
                    expect(allocator.getAllocations()).toStrictEqual(expected);
                }
            );
        });
    });

    describe('getAllocations', () => {
        it('returns empty array when allocator is empty', () => {
            const allocator = new ProportionalAllocator();
            expect(allocator.getAllocations()).toStrictEqual([]);
        });

        it('returns raw allocations when allocator is created with an specific allocations', () => {
            const allocator = new ProportionalAllocator([0.75, 0.25]);
            expect(allocator.getAllocations()).toStrictEqual([0.75, 0.25]);
        });
    });

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
            [
                'pop from [0.425, 0.575] => 0.575, [1]',
                [0.425, 0.575],
                0.575,
                [1],
            ],
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

    describe('remove', () => {
        test.each([
            [
                'remove from undefined at -100 => undefined, []',
                undefined,
                -100,
                undefined,
                [],
            ],
            [
                'remove from undefined at -1 => undefined, []',
                undefined,
                -1,
                undefined,
                [],
            ],
            [
                'remove from undefined at 0 => undefined, []',
                undefined,
                0,
                undefined,
                [],
            ],
            [
                'remove from undefined at 1 => undefined, []',
                undefined,
                1,
                undefined,
                [],
            ],
            [
                'remove from undefined at 100 => undefined, []',
                undefined,
                100,
                undefined,
                [],
            ],
            ['remove from [1] at -2 => undefined, []', [1], -2, undefined, [1]],
            ['remove from [1] at -1 => undefined, []', [1], -1, undefined, [1]],
            ['remove from [1] at 0 => 1, []', [1], 0, 1, []],
            ['remove from [1] at 1 => undefined, []', [1], 1, undefined, [1]],
            ['remove from [1] at 2 => undefined, []', [1], 2, undefined, [1]],
            [
                'remove from [0.4, 0.6] at -1 => undefined, [0.4, 0.6]',
                [0.4, 0.6],
                -1,
                undefined,
                [0.4, 0.6],
            ],
            [
                'remove from [0.4, 0.6] at 0 => 0.4, [1]',
                [0.4, 0.6],
                0,
                0.4,
                [1],
            ],
            [
                'remove from [0.4, 0.6] at 1 => 0.6, [1]',
                [0.4, 0.6],
                1,
                0.6,
                [1],
            ],
            [
                'remove from [0.4, 0.6] at 2 => undefined, [0.4, 0.6]',
                [0.4, 0.6],
                2,
                undefined,
                [0.4, 0.6],
            ],
            [
                'remove from [0.2, 0.3, 0.5] at 0 => 0.2, [0.4, 0.6]',
                [0.2, 0.3, 0.5],
                0,
                0.2,
                [0.4, 0.6],
            ],
            [
                'remove from [0.2, 0.3, 0.5] at 1 => 0.3, [0.35, 0.65]',
                [0.2, 0.3, 0.5],
                1,
                0.3,
                [0.35, 0.65],
            ],
            [
                'remove from [0.2, 0.3, 0.5] at 2 => 0.5, [0.45, 0.55]',
                [0.2, 0.3, 0.5],
                2,
                0.5,
                [0.45, 0.55],
            ],
        ])(
            '%s',
            (
                _: string,
                input: number[] | undefined,
                position: number,
                expectedRemovedValue: number | undefined,
                expectedAllocations: number[]
            ) => {
                const allocator = new ProportionalAllocator(input);
                const removedValue = allocator.remove(position);
                expect(removedValue).toEqual(expectedRemovedValue);
                expect(allocator.getAllocations()).toStrictEqual(
                    expectedAllocations
                );
            }
        );
    });

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

        test.each([
            [
                'update in undefined at position 0 to 0.0 => []',
                undefined,
                0,
                0,
                [],
            ],
            [
                'update in undefined at position 0 to 1.0 => []',
                undefined,
                0,
                1.0,
                [],
            ],
            ['update in [1] at position 0 to 0.0 => [1]', [1], 0, 0.0, [1]],
            [
                'update in [0.4, 0.6] at position -1 to 0.5 => [0.4, 0.6]',
                [0.4, 0.6],
                -1, // any negative
                0.5,
                [0.4, 0.6],
            ],
            [
                'update in [0.4, 0.6] at position 2 to 0.5 => [0.4, 0.6]',
                [0.4, 0.6],
                2, // higher than last
                0.5,
                [0.4, 0.6],
            ],
            // [
            //     'update in [0.4, 0.6] at position 0 to 0.5 => [0.5, 0.5]',
            //     [0.4, 0.6],
            //     0,
            //     0.5,
            //     [0.5, 0.5],
            // ],
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

    describe('miscellaneous', () => {
        it('chaining operations is possible', () => {
            expect(
                new ProportionalAllocator()
                    .add(0)
                    .add(0)
                    .add(2, 0.4)
                    .push()
                    .push(0.11)
                    .getAllocations()
            ).toStrictEqual([
                0.20024999999999998, 0.20024999999999998, 0.26700000000000007,
                0.2225, 0.11,
            ]);
        });
    });
});
