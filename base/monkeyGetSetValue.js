// @grant{GM_getValue}
// @grant{GM_setValue}
/**
 * Get the value from the monkey (Tampermonkey/Greasemonkey/Violentmonkey/etc.) storage, and set them with the default if nothing already exists
 * 
 * @param {String} key The key to use to name the value to get or set
 * @param {Object} value The default value to set and return if not defined
 * @returns {Object} The value to use
 */
const monkeyGetSetValue = (key, value) => {
    const storedValue = GM_getValue(key);
    if (storedValue === undefined && value !== undefined) {
        GM_setValue(key, value);
        return value;
    }
    return storedValue;
}
