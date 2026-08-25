// @grant{GM.deleteValue}
/**
 * Delete a value from the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM.deleteValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key The key of the value to delete
 * @returns {Promise<void>} A promise that resolves when the value has been deleted
 */
const monkeyDeleteValue = async (key) => await GM.deleteValue(key);
