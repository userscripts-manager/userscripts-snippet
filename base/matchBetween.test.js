describe('matchBetween', () => {
    it('should return the part of the string that is between the start and end patterns', () => {
        expect(matchBetween('Hello [world]!', '[', ']')).toBe('world')
        expect(matchBetween('abc<def>ghi', '<', '>')).toBe('def')
    })
    it('should return null if the start pattern is not found', () => {
        expect(matchBetween('Hello world!', '[', ']')).toBeNull()
    })
    it('should return null if the end pattern is not found', () => {
        expect(matchBetween('Hello [world!', '[', ']')).toBeNull()
    })
    it('should return null if the end pattern is before the start pattern', () => {
        expect(matchBetween('Hello ]world[!', '[', ']')).toBeNull()
    })
    it('should return the first match if there are multiple matches', () => {
        expect(matchBetween('a[b]c[d]e', '[', ']')).toBe('b')
    })
})