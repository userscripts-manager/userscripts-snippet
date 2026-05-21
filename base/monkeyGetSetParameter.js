// @import{monkeyGetSetValue}
// @import{HookableValue}
// @import{monkeySetValue}
/**
 * Get the value from the monkey (Tampermonkey/Greasemonkey/Violentmonkey/etc.) storage, and set them with the default if nothing already exists.
 * 
 * @template T
 * @param {String} key The key to use to name the value to get or set
 * @param {T} value The default value to set and return if not defined
 * @returns {Promise<HookableValue<T>>} The value to use wrapped in a HookableValue, so you can register hooks to it and update the value when needed. When the value is updated, it will be persisted in the monkey storage.
 */
const monkeyGetSetParameter = async (key, value) => {
    const value = await monkeyGetSetValue(key, value);
    const hookableValue = new HookableValue(value);
    await hookableValue.register(async (newValue) => {
        await monkeySetValue(key, newValue);
    });
    return hookableValue;
}
