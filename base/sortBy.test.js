describe('sortBy', () => {
    it('should sort an array by the values returned by the callback functions', () => {
        const array = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 30 },
            { name: 'David', age: 25 },
        ]
        const sorted = sortBy(array, (x) => x.age, (x) => x.name)
        expect(sorted).toEqual([
            { name: 'Bob', age: 25 },
            { name: 'David', age: 25 },
            { name: 'Alice', age: 30 },
            { name: 'Charlie', age: 30 },
        ])
    })
    it('should sort an array by the items themselves if no callbacks are provided', () => {
        const array = [3, 1, 4, 2]
        const sorted = sortBy(array)
        expect(sorted).toEqual([1, 2, 3, 4])
    })
    it('should return a new array and not modify the original array', () => {
        const array = [3, 1, 4, 2]
        const sorted = sortBy(array)
        expect(sorted).toEqual([1, 2, 3, 4])
        expect(array).toEqual([3, 1, 4, 2])
    })
    it('should handle an empty array', () => {
        const array = []
        const sorted = sortBy(array, (x) => x)
        expect(sorted).toEqual([])
    })
    it('should handle a single callback function', () => {
        const array = [
            { name: 'Alice', age: 31 },
            { name: 'Bob', age: 26 },
            { name: 'Charlie', age: 30 },
            { name: 'David', age: 25 },
        ]
        const sorted = sortBy(array, (x) => x.age)
        expect(sorted).toEqual([
            { name: 'David', age: 25 },
            { name: 'Bob', age: 26 },
            { name: 'Charlie', age: 30 },
            { name: 'Alice', age: 31 },
        ])
    })
    it('should handle callbacks that return non-string values', () => {
        const array = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 30 },
            { name: 'David', age: 25 },
        ]
        const sorted = sortBy(array, (x) => x.age, (x) => -x.name.charCodeAt(0))
        expect(sorted).toEqual([
            { name: 'David', age: 25 },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 30 },
            { name: 'Alice', age: 30 },
        ])
    })

})