describe('createUniqueIdGenerator', () => {
    test('should createUniqueIdGenerator create unique IDs', () => {
        const generator = createUniqueIdGenerator('prefix');
        expect(generator()).toBe('prefix-1');
        expect(generator()).toBe('prefix-2');
        expect(generator()).toBe('prefix-3');
    });

    test('should createUniqueIdGenerator create unique IDs with different prefixes', () => {
        const generator1 = createUniqueIdGenerator('prefix1');
        const generator2 = createUniqueIdGenerator('prefix2');
        expect(generator1()).toBe('prefix1-1');
        expect(generator1()).toBe('prefix1-2');
        expect(generator2()).toBe('prefix2-1');
        expect(generator1()).toBe('prefix1-3');
        expect(generator2()).toBe('prefix2-2');
    });
});