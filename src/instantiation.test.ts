import { ProportionalAllocator } from './proportional-allocator';

describe('instantiation', () => {
    const errorMsg = 'allocation must be between 0 and 1';

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
        expect(() => new ProportionalAllocator([0.9999, 0.0002])).toThrowError(
            'sum of input allocations must equal 1'
        );
    });

    it('throws error when sum of allocations is < 1', () => {
        expect(() => new ProportionalAllocator([0.9998, 0.0001])).toThrowError(
            'sum of input allocations must equal 1'
        );
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
