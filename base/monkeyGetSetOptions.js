// @import{monkeyGetSetValue}

/**
 * Get options using the values stored in monkey store or the default values
 * 
 * @param {Object<String, Object>} baseOptions Default values
 * @returns {Object<String, Object>} Options to use
 */
const monkeyGetSetOptions = async (baseOptions) => {
    const options = Object.fromEntries(await Promise.all(Object.entries(baseOptions).map(async ([k, v]) => [k, await monkeyGetSetValue(k, v)])));
    return options;
}
