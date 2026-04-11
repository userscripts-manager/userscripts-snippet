describe('font46tools', () => {
    describe('getPixelsFromByte', () => {
        it('should return correct pixels for byte 0x00', () => {
            const pixels = Array.from(font46tools.getPixelsFromByte(0x00));
            expect(pixels).toEqual([]);
        });
        it('should return correct pixels for byte 0xFF', () => {
            const pixels = Array.from(font46tools.getPixelsFromByte(0xFF));
            expect(pixels).toEqual([[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [1, 0], [2, 0], [3, 0]]);
        });
        it('should return correct pixels for byte 0x10', () => {
            const pixels = Array.from(font46tools.getPixelsFromByte(0x10));
            expect(pixels).toEqual([[0, 1]]);
        });
        it('should return correct pixels for byte 0x25', () => {
            const pixels = Array.from(font46tools.getPixelsFromByte(0x25));
            expect(pixels).toEqual([[1, 1], [0, 0], [2, 0]]);
        });
        it('should return correct pixels for byte 0x75', () => {
            const pixels = Array.from(font46tools.getPixelsFromByte(0x75));
            expect(pixels).toEqual([[0, 1], [1, 1], [2, 1], [0, 0], [2, 0]]);
        });
    });
    describe('getPixelsFromBytes', () => {
        it('should return correct pixels for bytes [0x00, 0x00, 0x00]', () => {
            const pixels = Array.from(font46tools.getPixelsFromBytes([0x00, 0x00, 0x00]));
            expect(pixels).toEqual([]);
        });
        it('should return correct pixels for bytes [0xFF, 0xFF, 0xFF]', () => {
            const pixels = Array.from(font46tools.getPixelsFromBytes([0xFF, 0xFF, 0xFF]));
            expect(pixels).toEqual([
                [0, 5], [1, 5], [2, 5], [3, 5],
                [0, 4], [1, 4], [2, 4], [3, 4],
                [0, 3], [1, 3], [2, 3], [3, 3],
                [0, 2], [1, 2], [2, 2], [3, 2],
                [0, 1], [1, 1], [2, 1], [3, 1],
                [0, 0], [1, 0], [2, 0], [3, 0]
            ]);
        });
        it('should return correct pixels for bytes [0x25, 0x75, 0x50]', () => {
            const pixels = Array.from(font46tools.getPixelsFromBytes([0x25, 0x75, 0x50]));
            expect(pixels).toEqual([
                        [1, 5],
                [0, 4],         [2, 4],
                [0, 3], [1, 3], [2, 3],
                [0, 2],         [2, 2],
                [0, 1],         [2, 1],
                
            ]);
        });
    });
    describe('getInfosPixels', () => {
        it('should return correct pixels for string "A"', () => {
            const { minX, minY, maxX, maxY, getPixels } = font46tools.getInfosPixels("A");
            expect(minX).toBe(0);
            expect(minY).toBe(0);
            expect(maxX).toBe(4);
            expect(maxY).toBe(6);
            const pixels = Array.from(getPixels());
            expect(pixels).toEqual([
                        [2, 5],
                [1, 4],         [3, 4],
                [1, 3], [2, 3], [3, 3],
                [1, 2],         [3, 2],
                [1, 1],         [3, 1],
                
            ]);
        });
        it('should return correct pixels for string "AB"', () => {
            const { minX, minY, maxX, maxY, getPixels } = font46tools.getInfosPixels("AB");
            expect(minX).toBe(0);
            expect(minY).toBe(0);
            expect(maxX).toBe(8);
            expect(maxY).toBe(6);
            const pixels = Array.from(getPixels());
            expect(pixels).toEqual([
                        [2, 5],
                [1, 4],         [3, 4],
                [1, 3], [2, 3], [3, 3],
                [1, 2],         [3, 2],
                [1, 1],         [3, 1],

                [5, 5], [6, 5],
                [5, 4],         [7, 4],
                [5, 3], [6, 3],
                [5, 2],         [7, 2],
                [5, 1], [6, 1],
            ]);
        });
    });
});