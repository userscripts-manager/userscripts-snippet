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
    it('should handle grouping simple objects', () => {
        const items = ['apple', 'banana', 'avocado', 'blueberry'];
        const grouped = groupBy(items, item => item[0]);
        expect(grouped).toEqual({
            'a': ['apple', 'avocado'],
            'b': ['banana', 'blueberry'],
        });
    });
    it('should handle grouping numbers', () => {
        const items = [1, 2, 3, 4, 5];
        const grouped = groupBy(items, item => (item % 2 === 0 ? 'even' : 'odd'));
        expect(grouped).toEqual({
            'odd': [1, 3, 5],
            'even': [2, 4],
        });
    });
});
