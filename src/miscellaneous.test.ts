import { ProportionalAllocator } from './proportional-allocator';

describe('miscellaneous', () => {
    it('returns empty array when allocator is empty', () => {
        const allocator = new ProportionalAllocator();
        expect(allocator.getAllocations()).toStrictEqual([]);
    });

    it('returns raw allocations when allocator is created with an specific allocations', () => {
        const allocator = new ProportionalAllocator([0.75, 0.25]);
        expect(allocator.getAllocations()).toStrictEqual([0.75, 0.25]);
    });

    it('chaining operations is possible', () => {
        expect(
            new ProportionalAllocator()
                .add(0)
                .add(0)
                .add(2, 0.4)
                .push()
                .push(0.11)
                .update(2, 0.3)
                .getAllocations()
        ).toStrictEqual([
            0.192, 0.192, 0.3, 0.21425000000000002, 0.10175000000000002,
        ]);
    });
});
