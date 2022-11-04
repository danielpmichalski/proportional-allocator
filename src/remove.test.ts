import { ProportionalAllocator } from './proportional-allocator';

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
        ['remove from [0.4, 0.6] at 0 => 0.4, [1]', [0.4, 0.6], 0, 0.4, [1]],
        ['remove from [0.4, 0.6] at 1 => 0.6, [1]', [0.4, 0.6], 1, 0.6, [1]],
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
