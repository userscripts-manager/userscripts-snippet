/**
 * Sort an array by one or more callback functions that return the value to sort by for each item. The callbacks are applied in order, so the second callback is used to break ties from the first callback, and so on.
 * @template T
 * @param {Array<T>} array The array to sort
 * @param {...(item: T) => any} callbacks One or more functions that take an item and return the value to sort by for that item
 * @returns {Array<T>} A new array sorted by the values returned by the callback functions
 */
const sortBy = (array, ...callbacks) => {
    if (!callbacks || callbacks.length === 0) {
        callbacks = [(x) => x]
    }
    return [...array].sort((a, b) => {
        for (const callback of callbacks) {
            const aValue = callback(a)
            const bValue = callback(b)
            if (aValue < bValue) return -1
            if (aValue > bValue) return 1
        }
        return 0
    })
}
