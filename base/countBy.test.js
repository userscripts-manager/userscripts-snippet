describe('countBy', () => {
    it('should count the occurrences of items in an array grouped by a key returned by a callback function', () => {
        expect(countBy(['apple', 'banana', 'cherry'], (x) => x[0])).toEqual({ a: 1, b: 1, c: 1 })
        expect(countBy(['apple', 'apricot', 'banana'], (x) => x[0])).toEqual({ a: 2, b: 1 })
    })
    it('should count the occurrences of items in an array grouped by the items themselves if no callback is provided', () => {
        expect(countBy(['apple', 'banana', 'apple'])).toEqual({ apple: 2, banana: 1 })
        expect(countBy([1, 2, 2, 3])).toEqual({ 1: 1, 2: 2, 3: 1 })
    })
    it('should return an empty object if the array is empty', () => {
        expect(countBy([])).toEqual({})
    })
    it('should handle items that are not strings', () => {
        expect(countBy([true, false, true])).toEqual({ true: 2, false: 1 })
        expect(countBy([null, null, undefined])).toEqual({ null: 2, undefined: 1 })
    })
    it('should handle a callback that returns non-string keys', () => {
        expect(countBy(['apple', 'banana', 'cherry'], (x) => x.length)).toEqual({ 5: 1, 6: 2 })
    })
})