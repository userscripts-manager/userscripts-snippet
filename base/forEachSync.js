/**
 * A utility function that maps an array of items to an array of results using an asynchronous callback function. It processes each item sequentially, waiting for the promise returned by the callback to resolve before moving on to the next item.
 * 
 * @template T, U
 * @param {Array<T>} array An array of items to map
 * @param {(item: T, index: number, array: Array<T>) => Promise<U>} callback An async function to apply to each item
 * @returns {Promise<void>} A promise that resolves when all the callbacks have been executed
 */
const forEachSync = async (array, callback) => {
    for (const [index, item] of array.entries()) {
        await callback(item, index, array)
    }
}
