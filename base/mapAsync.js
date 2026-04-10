/**
 * A utility function that maps an array of items to an array of results using an asynchronous callback function. It processes all items in parallel, returning a promise that resolves when all the promises returned by the callback have resolved.
 * 
 * @template T, U
 * @param {Array<T>} array An array of items to map
 * @param {(item: T, index: number, array: Array<T>) => Promise<U>} callback An async function to apply to each item
 * @returns {Promise<Array<U>>} A promise that resolves to an array of the mapped results
 */
const mapAsync = async (array, callback) => {
    return Promise.all(array.map(callback))
}

