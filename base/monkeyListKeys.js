// @grant{GM_listValues}
/**
 * List all keys stored in the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM_listValues, for coherence use with monkeyGetSetValue.
 * 
 * @returns {String[]} An array of all keys stored in the monkey storage
 */
const monkeyListKeys = () => {
    return GM_listValues();
};
