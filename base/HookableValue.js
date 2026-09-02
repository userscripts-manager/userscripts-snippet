/**
 * A class representing a value that can have hooks on change
 * @template T The type of the value
 */
class HookableValue {
    /**
     * Constructor
     * @param {string} name The name of the hook
     * @param {T|null} defaultValue The default value
     */
    constructor(name, defaultValue = null) {
        this._name = name;
        this._value = defaultValue;
        this.callbacks = [];
    }

    /**
     * Sets the value and calls the hooks if the value changed
     * 
     * @param {T} newValue The new value
     * @returns {Promise<void>} A promise that resolves when all hooks have been called
     */
    async setValue(newValue) {
        const oldValue = this.value;
        if (oldValue !== newValue) {
            this._value = newValue;
            for (const callback of this.callbacks) {
                await callback(newValue, oldValue);
            }
        }
    }

    /**
     * Gets the value
     * 
     * @returns {T} The current value
     */
    getValue() {
        return this._value;
    }

    /**
     * Register a callback to be called when the value changes
     * @param {(newValue:T, oldValue:T)=>Promise<void>} callback The callback (that may be async)
     * @returns {Promise<()=>Promise<void>>} The unregister function
     */
    async register(callback) {
        this.callbacks.push(callback);
        return async () => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        }
    }

    /**
     * Registers a callback and immediately calls it with the current value
     * @param {(newValue:T, oldValue:T)=>Promise<void>} callback The callback (that may be async)
     * @returns {Promise<()=>Promise<void>>} The unregister function
     */
    async registerAndCall(callback) {
        const unregisterFunction = await this.register(callback);
        await callback(this.value, this.value);
        return unregisterFunction;
    }

    /**
     * Registers a callback to be called when any of the given hookable values changes
     * @param {HookableValue[]} hookableValues The hookable values to watch
     * @param {(newValues: any[], oldValues: any[]) => Promise<void>} callback The callback (that may be async) that will receive the new and old values of all the hookable values
     * @returns {Promise<()=>Promise<void>>} The unregister function
     */
    static async registerAll(hookableValues, callback) {
        const unregisterFunctions = await Promise.all(hookableValues.map(
            (hookableValue,indexHookable) => hookableValue.register(
                async (value, oldValue) => await callback(
                    hookableValues.map((hv,indexValue) => indexValue === indexHookable ? value : hv.value), 
                    hookableValues.map((hv,indexValue) => indexValue === indexHookable ? oldValue : hv.value)
                )
            )
        ));
        return async () => {
            for (const unregister of unregisterFunctions) {
                await unregister();
            }
        };
    }

    /**
     * Clears all registered callbacks
     * @returns {Promise<void>}
     */
    async clearCallbacks() {
        for (const callback of this.callbacks) {
            await callback(null, this._value);
        }
        this.callbacks = [];
    }

    get value() {
        return this.getValue();
    }

    set value(newValue) {
        this.setValue(newValue);
    }

    get name() {
        return this._name;
    }
}
/** @typedef {HookableValue} HookableValue */