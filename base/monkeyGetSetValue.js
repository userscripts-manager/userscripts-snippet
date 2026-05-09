// @grant{GM.getValue}
// @grant{GM.setValue}
/**
 * Get the value from the monkey (Tampermonkey/Greasemonkey/Violentmonkey/etc.) storage, and set them with the default if nothing already exists
 * 
 * @template T
 * @param {String} key The key to use to name the value to get or set
 * @param {T} value The default value to set and return if not defined
 * @returns {Promise<T>} The value to use
 */
const monkeyGetSetValue = async (key, value) => {
    const storedValue = await GM.getValue(key);
    if (storedValue === undefined && value !== undefined) {
        await GM.setValue(key, value);
        return value;
    }
    return storedValue;
}
