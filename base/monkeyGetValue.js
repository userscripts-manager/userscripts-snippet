// @grant{GM.getValue}
/**
 * Get a value from the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM.getValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key The key of the value to get
 * @returns {Promise<Object>} The value stored in the monkey storage for the given key
 */
const monkeyGetValue = async (key) => await GM.getValue(key);
