/**
 * Count the number of occurrences of items in an array, grouped by a key returned by a callback function
 * @template T
 * @param {Array<T>} array The array of items to count
 * @param {(item: T) => String} [callback] A function that takes an item and returns a string key to group by. If not provided, the items themselves are used as keys
 * @returns {Object} An object where the keys are the values returned by the callback function and the values are the number of occurrences
 * If the callback is not provided, the items themselves are used as keys
 */
const countBy = (array, callback) => {
    const counts = {}
    if (!callback) {
        callback = (x) => x
    }
    for (const item of array) {
        const key = callback(item)
        counts[key] = (counts[key] || 0) + 1
    }
    return counts
}
