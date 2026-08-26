const byLines = (lines) => lines.join('\n')

describe('makeTextHistogram', () => {
    it('should create a text histogram from an object of counts', () => {
        const data = { apple: 10, banana: 5, cherry: 15 }
        const histogram = makeTextHistogram(data)
        const expected = byLines([
            ` apple | █████████████ 10`,
            `banana | ███████ 5`,
            `cherry | ████████████████████ 15`,
        ])
        expect(histogram).toBe(expected)
    })
    it('should use the specified character for the bars', () => {
        const data = { apple: 10, banana: 5, cherry: 15 }
        const histogram = makeTextHistogram(data, { char: '#' })
        const expected = byLines([
            ` apple | ############# 10`,
            `banana | ####### 5`,
            `cherry | #################### 15`,
        ])
        expect(histogram).toBe(expected)
    })
    it('should limit the length of the bars to the specified maximum', () => {
        const data = { apple: 10, banana: 5, cherry: 15 }
        const histogram = makeTextHistogram(data, { length: 10 })
        const expected = byLines([
            ` apple | ███████ 10`,
            `banana | ███ 5`,
            `cherry | ██████████ 15`,
        ])
        expect(histogram).toBe(expected)
    })
    it('should sort the entries by the specified function', () => {
        const data = { cherry: 15, apple: 10, banana: 5 }
        const histogram = makeTextHistogram(data, { sortBy: (key, value) => value })
        const expected = byLines([
            `banana | ███████ 5`,
            ` apple | █████████████ 10`,
            `cherry | ████████████████████ 15`,
        ])
        expect(histogram).toBe(expected)
    })
    it('should sort the entries by the specified function (other function)', () => {
        const data = { cherry: 15, apple: 10, banana: 5 }
        const histogram = makeTextHistogram(data, { sortBy: (key, value) => key })
        const expected = byLines([
            ` apple | █████████████ 10`,
            `banana | ███████ 5`,
            `cherry | ████████████████████ 15`,
        ])
        expect(histogram).toBe(expected)
    })
    it('should handle an empty object', () => {
        const data = {}
        const histogram = makeTextHistogram(data)
        const expected = byLines([
        ])
        expect(histogram).toBe(expected)
    })
    it('should handle values of zero', () => {
        const data = { apple: 0, banana: 5, cherry: 10 }
        const histogram = makeTextHistogram(data)
        const expected = byLines([
            ` apple |  0`,
            `banana | ██████████ 5`,
            `cherry | ████████████████████ 10`,
        ])
        expect(histogram).toBe(expected)
    })
    it('should handle all values being the same', () => {
        const data = { apple: 10, banana: 10, cherry: 10 }
        const histogram = makeTextHistogram(data)
        const expected = byLines([
            ` apple | ████████████████████ 10`,
            `banana | ████████████████████ 10`,
            `cherry | ████████████████████ 10`,
        ])
        expect(histogram).toBe(expected)
    })
})