// @import{exportOnWindow}
// @import{monkeyGetSetValue}
// @import{monkeySetValue}
// @import{registerMenuCommand}
// @import{HookableValue}
/**
 * Gets the persistent string value of a parameter, and registers menu commands to toggle it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * 
 * The menu command will be "Change {parameterName} (current : {currentValue})". 
 * When the menu command is selected, the value will be asked, the parameter value will be updated, and the `onParameterChange` callback will be called with the new value.
 *
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {String} defaultValue The default value of the parameter
 * @param {((newValue: String) => Promise<void>|undefined)} onParameterChange A callback function that is called when the parameter value changes
 * @returns {Promise<HookableValue<String>>} The hookable value for the parameter
 */
const getPersistentParameterStringValue = (() => {
    const menuCommandUnregisterFunctions = {};
    /**
     * @type {{[parameterName: string]: HookableValue<String>}}
     */
    const hookableValueParameterValues = {};

    /**
     * Register activation deactivation menu command for a parameter, and update the menu command when the parameter value changes
     * @param {string} parameterName 
     * @param {HookableValue<String>} hookableValue 
     * @returns {Promise<HookableValue<String>>}
     */
    async function registerActivation(parameterName, hookableValue) {
        if (menuCommandUnregisterFunctions[parameterName]) {
            await menuCommandUnregisterFunctions[parameterName]();
            delete menuCommandUnregisterFunctions[parameterName];
        }
        const value = hookableValue.value;
        const label = `Change ${parameterName} (current : ${value})`;
        menuCommandUnregisterFunctions[parameterName] = await registerMenuCommand(label, async () => {
            const newValue = prompt(`Enter new value for ${parameterName}:`, value);
            if (newValue !== null) {
                await hookableValue.setValue(newValue);
            }
        });
        return hookableValueParameterValues[parameterName];
    }

    /**
     * Gets the persistent string value of a parameter, and registers menu commands to toggle it.
     * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
     * 
     * The menu command will be "Change {parameterName} (current : {currentValue})". 
     * When the menu command is selected, the value will be asked, the parameter value will be updated, and the `onParameterChange` callback will be called with the new value.
     *
     * @param {String} parameterName The name of the parameter (used for menu command and storage)
     * @param {String} defaultValue The default value of the parameter
     * @param {((newValue: String) => Promise<void>|undefined)} onParameterChange A callback function that is called when the parameter value changes
     * @returns {Promise<HookableValue<String>>} The hookable value for the parameter
     */
    const getPersistentParameterStringValue = async (parameterName, defaultValue, onParameterChange) => {
        if (!hookableValueParameterValues[parameterName]) {
            const value = await monkeyGetSetValue(parameterName, defaultValue);
            hookableValueParameterValues[parameterName] = new HookableValue(parameterName, value);
            const hookableValue = hookableValueParameterValues[parameterName];
            await onParameterChange?.(value);
            hookableValue.register(async (newValue) => {
                await monkeySetValue(parameterName, newValue);
                if (onParameterChange !== undefined) {
                    if (onParameterChange) {
                        await onParameterChange(newValue);
                    }
                } else {
                    alert(`[${parameterName}] has been set to ${newValue}. Please reload the page for the change to take effect.`);
                }
                await registerActivation(parameterName, hookableValue);
                console.log(`Parameter [${parameterName}] is set to ${hookableValue.value}`);
            });
            await registerActivation(parameterName, hookableValue);
        }

        return hookableValueParameterValues[parameterName];
    }
    exportOnWindow({ getPersistentParameterStringValue, hookableValueParameterValues });
    return getPersistentParameterStringValue;
})();
