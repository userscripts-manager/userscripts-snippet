// @import{font46}

const font46tools = {
    getPixelsFromByte: function* (/** @type{Number} */byte) {
        for (let bit = 4; bit < 12; bit++) {
            if ((byte & (1 << (bit%8))) !== 0) {
                if (bit >= 8) {
                    yield [bit%8, 0];
                } else {
                    yield [bit%8 - 4, 1];
                }
            }
        }
    },
    getPixelsFromBytes: function* (/** @type{Number[]} */bytes) {
        for (let t = 0; t < bytes.length; t++) {
            const charPixel = bytes[t];
            for (const [x, y] of font46tools.getPixelsFromByte(charPixel)) {
                yield [x, (2 - t) * 2 + y];
            }
        }
    },
    getInfosPixels: (/** @type{String} */data) => {
        const minX = 0;
        const minY = 0;
        const maxX = data.length * 4;
        const maxY = 6;
        const getPixels = function* () {
            for (let i = 0; i < data.length; i++) {
                const charCode = data.charCodeAt(i);
                if (charCode < font46.length) {
                    const charPixels = font46[charCode];
                    for (const [x, y] of font46tools.getPixelsFromBytes(charPixels)) {
                        yield [x + i * 4 + 1, y];
                    }
                }
            }
        }
        return { minX, minY, maxX, maxY, getPixels };
    }
};