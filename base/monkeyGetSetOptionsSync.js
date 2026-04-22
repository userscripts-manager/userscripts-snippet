// @import{monkeyGetSetValueSync}

/**
 * Get options using the values stored in monkey store or the default values
 * 
 * @param {Object<String, Object>} baseOptions Default values
 * @returns {Object<String, Object>} Options to use
 */
const monkeyGetSetOptionsSync = (baseOptions) => {
    const options = Object.fromEntries(Object.entries(baseOptions).map(([k, v]) => [k, monkeyGetSetValueSync(k, v)]));
    return options;
}
