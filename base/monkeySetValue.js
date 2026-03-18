// @grant{GM_setValue}
/**
 * Set a value in the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM_setValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key La clé de la valeur à définir
 * @param {Object} value La valeur à définir
 */
const monkeySetValue = (key, value) => GM_setValue(key, value);
