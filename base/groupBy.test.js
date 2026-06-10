describe('groupBy', () => {
    it('should group items by the specified predicate', () => {
        const items = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 30 },
            { name: 'David', age: 25 },
        ];
        const grouped = groupBy(items, item => item.age.toString());
        expect(grouped).toEqual({
            '25': [
                { name: 'Bob', age: 25 },
                { name: 'David', age: 25 },
            ],
            '30': [
                { name: 'Alice', age: 30 },
                { name: 'Charlie', age: 30 },
            ],
        });
    });
    it('should return an empty object when given an empty array', () => {
        const grouped = groupBy([], item => item);
        expect(grouped).toEqual({});
    });
    it('should handle grouping by a property that does not exist on the items', () => {
        const items = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
        ];
        const grouped = groupBy(items, item => item.nonExistentProperty || 'undefined');
        expect(grouped).toEqual({
            'undefined': [
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 },
            ],
        });
    });
    it('should handle grouping by a property that has the same value for all items', () => {
        const items = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 30 },
        ];
        const grouped = groupBy(items, item => item.age.toString());
        expect(grouped).toEqual({
            '30': [
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 30 },
            ],
        });
    });
    it('should handle grouping by a property that has unique values for all items', () => {
        const items = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
        ];
        const grouped = groupBy(items, item => item.name);
        expect(grouped).toEqual({
            'Alice': [
                { name: 'Alice', age: 30 },
            ],
            'Bob': [
                { name: 'Bob', age: 25 },
            ],
        });
    });
    it('should handle grouping by a property that has mixed values', () => {
        const items = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 30 },
            { name: 'David', age: 25 },
            { name: 'Eve', age: 35 },
        ];
        const grouped = groupBy(items, item => item.age.toString());
        expect(grouped).toEqual({
            '25': [
                { name: 'Bob', age: 25 },
                { name: 'David', age: 25 },
            ],
            '30': [
                { name: 'Alice', age: 30 },
                { name: 'Charlie', age: 30 },
            ],
            '35': [
                { name: 'Eve', age: 35 },
            ],
        });
    });
});