// @import{monkeyGetSetValue}
/**
 * Complete an array with custom values
 * 
 * @template T The type of the array elements
 * @param {String} key The base of the name to use for the monkey storage value ( will use key + 'Add' suffix )
 * @param {Array<T>} value The array to complete
 * @returns {Promise<Array<T>>} The array to use
 */
const monkeyGetSetValueArrayAdd = async (key, value = []) => {
    const currentValueAdd = await monkeyGetSetValue(`${key}Add`, []);
    return [...value, ...currentValueAdd]
}

