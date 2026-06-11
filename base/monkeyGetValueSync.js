// @grant{GM_getValue}
/**
 * Get a value from the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM_getValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key The key of the value to get
 * @returns {Object} The value stored in the monkey storage for the given key
 */
const monkeyGetValueSync = (key) => GM_getValue(key);
