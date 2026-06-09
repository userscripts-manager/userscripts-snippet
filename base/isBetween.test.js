describe('isBetween', () => {
    it('should return true if the value is between the min and max (inclusive)', () => {
        expect(isBetween(5, 1, 10)).toBe(true)
        expect(isBetween(1, 1, 10)).toBe(true)
        expect(isBetween(10, 1, 10)).toBe(true)
        expect(isBetween('b', 'a', 'c')).toBe(true)
        expect(isBetween('a', 'a', 'c')).toBe(true)
        expect(isBetween('c', 'a', 'c')).toBe(true)
    })
    it('should return false if the value is less than the min', () => {
        expect(isBetween(0, 1, 10)).toBe(false)
        expect(isBetween(-1, 1, 10)).toBe(false)
        expect(isBetween('a', 'b', 'c')).toBe(false)
        expect(isBetween('b', 'A', 'C')).toBe(false)
    })
    it('should return false if the value is greater than the max', () => {
        expect(isBetween(11, 1, 10)).toBe(false)
        expect(isBetween(12, 1, 10)).toBe(false)
        expect(isBetween('d', 'a', 'c')).toBe(false)
        expect(isBetween('C', 'A', 'B')).toBe(false)
        expect(isBetween('B', 'a', 'c')).toBe(false)
    })
})