// @import{monkeyGetSetValue}
/**
 * Complete an array with custom values
 * 
 * @param {String} key The base of the name to use for the monkey storage value ( will use key + 'Add' suffix )
 * @param {Object} value The array to complete
 * @returns {Object} The array to use
 */
const monkeyGetSetValueArrayAdd = (key, value = []) => {
    const currentValueAdd = monkeyGetSetValue(`${key}Add`, []);
    return [...value, ...currentValueAdd]
}

