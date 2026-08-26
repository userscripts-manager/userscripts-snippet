// @import{monkeyGetValue}
// @import{monkeySetValue}
/**
 * Get the value from the monkey (Tampermonkey/Greasemonkey/Violentmonkey/etc.) storage, and set them with the default if nothing already exists
 * 
 * @template T
 * @param {String} key The key to use to name the value to get or set
 * @param {T} defaultValue The default value to set and return if not defined
 * @returns {Promise<T>} The value to use
 */
const monkeyGetSetValue = async (key, defaultValue) => {
    const storedValue = await monkeyGetValue(key);
    if (storedValue === undefined && defaultValue !== undefined) {
        await monkeySetValue(key, defaultValue);
        return defaultValue;
    }
    return storedValue;
}
