describe('matchBetweenAndRemaining', () => {
    it('should return the part of the string that is between the start and end patterns, along with the remaining string after the end pattern', () => {
        expect(matchBetweenAndRemaining('Hello [world]!', '[', ']')).toEqual({ matched: 'world', remaining: '!' })
        expect(matchBetweenAndRemaining('abc<def>ghi', '<', '>')).toEqual({ matched: 'def', remaining: 'ghi' })
    })
    it('should return null if the start pattern is not found', () => {
        expect(matchBetweenAndRemaining('Hello world!', '[', ']')).toBeNull()
    })
    it('should return null if the end pattern is not found', () => {
        expect(matchBetweenAndRemaining('Hello [world!', '[', ']')).toBeNull()
    })
    it('should return null if the end pattern is before the start pattern', () => {
        expect(matchBetweenAndRemaining('Hello ]world[!', '[', ']')).toBeNull()
    })
    it('should return the first match if there are multiple matches', () => {
        expect(matchBetweenAndRemaining('a[b]c[d]e', '[', ']')).toEqual({ matched: 'b', remaining: 'c[d]e' })
    })
})