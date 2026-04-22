// @grant{GM.listValues}
/**
 * List all keys stored in the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM.listValues, for coherence use with monkeyGetSetValue.
 * 
 * @returns {Promise<String[]>} A promise that resolves to an array of all keys stored in the monkey storage
 */
const monkeyListKeys = async () => {
    return await GM.listValues();
};
