// @grant{GM.setValue}
/**
 * Set a value in the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM_setValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key La clé de la valeur à définir
 * @param {Object} value La valeur à définir
 * @returns {Promise<void>} A promise that resolves when the value has been set
 */
const monkeySetValue = async (key, value) => await GM.setValue(key, value);
