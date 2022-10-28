import { ProportionalAllocator } from "./proportional-allocator";

describe("ProportionalAllocator", () => {
    describe("getRawAllocations", () => {
        it("returns empty array when allocator is empty", () => {
            const allocator = new ProportionalAllocator();
            expect(allocator.getRawAllocations()).toStrictEqual([]);
        })

        it("returns empty array when allocator created with an empty allocator", () => {
            const allocator = new ProportionalAllocator(new ProportionalAllocator());
            expect(allocator.getRawAllocations()).toStrictEqual([]);
        })
    })
})
