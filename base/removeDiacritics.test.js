describe('removeDiacritics', () => {
    test('should remove diacritics from a string', () => {
        expect(removeDiacritics('café')).toBe('cafe');
        expect(removeDiacritics('naïve')).toBe('naive');
        expect(removeDiacritics('façade')).toBe('facade');
        expect(removeDiacritics('résumé')).toBe('resume');
        expect(removeDiacritics('coöperate')).toBe('cooperate');
        expect(removeDiacritics('São Paulo')).toBe('Sao Paulo');
        expect(removeDiacritics('München')).toBe('Munchen');
        expect(removeDiacritics('crème brûlée')).toBe('creme brulee');
        expect(removeDiacritics('élève')).toBe('eleve');
        expect(removeDiacritics('français')).toBe('francais');
        expect(removeDiacritics('')).toBe('');
        expect(removeDiacritics('hello')).toBe('hello');
        expect(removeDiacritics('123')).toBe('123');
    });

    test('should handle null and undefined input', () => {
        expect(removeDiacritics(null)).toBe(undefined);
        expect(removeDiacritics(undefined)).toBe(undefined);
    });
});