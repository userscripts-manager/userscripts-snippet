/**
 * Groups an array of items by a specified predicate function.
 * The predicate function takes an item and returns a string key that determines the group it belongs to.
 * The result is an object where the keys are the group identifiers and the values are arrays of items that belong to each group.
 * @template T
 * @param {Array<T>} array 
 * @param {(item: T) => string} predicate 
 * @returns {Object<string, Array<T>>}
 */
const groupBy = (array, predicate) => {
    return array.reduce((acc, item) => {
        const key = predicate(item);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, /** @type {Object<string, Array<T>>} */ ({}));
}