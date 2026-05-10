// @import{exportOnWindow}
// @import{monkeyGetSetValue}
// @import{monkeySetValue}
// @import{registerMenuCommand}
// @import{HookableValue}
/**
 * Gets the activation value of a flag, and registers menu commands to toggle it.
 * The flag state is persisted in the monkey storage, so it will be remembered across page reloads.
 * 
 * The menu command will be "Enable {flagName}" if the flag is currently disabled, 
 * and "Disable {flagName}" if the flag is currently enabled. When the menu command is selected, 
 * the flag value will be toggled, and the `onFlagChange` callback will be called with the new value.
 *
 * @param {String} flagName The name of the flag (used for menu command and storage)
 * @param {Boolean} defaultValue The default value of the flag
 * @param {((newValue: Boolean) => Promise<void>|undefined)} onFlagChange A callback function that is called when the flag value changes
 * @returns {Promise<HookableValue<boolean>>} The hookable value for the flag
 */
const getFlagActivationValue = (() => {
    const menuCommandUnregisterFunctions = {};
    /**
     * @type {{[flagName: string]: HookableValue<boolean>}}
     */
    const hookableValueFlags = {};

    /**
     * Register activation deactivation menu command for a flag, and update the menu command when the flag value changes
     * @param {string} flagName 
     * @param {HookableValue<boolean>} hookableValue 
     * @returns {Promise<HookableValue<boolean>>}
     */
    async function registerActivation(flagName, hookableValue) {
        if (menuCommandUnregisterFunctions[flagName]) {
            await menuCommandUnregisterFunctions[flagName]();
            delete menuCommandUnregisterFunctions[flagName];
        }
        const value = hookableValue.value;
        const label = value ? `Disable ${flagName}` : `Enable ${flagName}`;
        menuCommandUnregisterFunctions[flagName] = await registerMenuCommand(label, async () => {
            await hookableValue.setValue(!value);
        });
        return hookableValueFlags[flagName];
    }

    /**
     * Gets the activation value of a flag, and registers menu commands to toggle it.
     * The menu command will be "Enable {flagName}" if the flag is currently disabled, 
     * and "Disable {flagName}" if the flag is currently enabled. When the menu command is selected, 
     * the flag value will be toggled, and the `onFlagChange` callback will be called with the new value.
     *
     * @param {String} flagName The name of the flag (used for menu command and storage)
     * @param {Boolean} defaultValue The default value of the flag
     * @param {((newValue: Boolean) => Promise<void>|undefined)} onFlagChange A callback function that is called when the flag value changes
     * @returns {Promise<HookableValue<boolean>>} The hookable value for the flag
     */
    const getFlagActivationValue = async (flagName, defaultValue, onFlagChange) => {
        if (!hookableValueFlags[flagName]) {
            const value = await monkeyGetSetValue(flagName, defaultValue);
            hookableValueFlags[flagName] = new HookableValue(flagName, value);
            const hookableValue = hookableValueFlags[flagName];
            await onFlagChange?.(value);
            hookableValue.register(async (newValue) => {
                await monkeySetValue(flagName, newValue);
                if (onFlagChange !== undefined) {
                    if (onFlagChange) {
                        await onFlagChange(newValue);
                    }
                } else {
                    if (newValue) {
                        alert(`[${flagName}] has been enabled. Please reload the page for the change to take effect.`);
                    } else {
                        alert(`[${flagName}] has been disabled. Please reload the page for the change to take effect.`);
                    }
                }
                await registerActivation(flagName, hookableValue);
                console.log(`Flag [${flagName}] is set to ${hookableValue.value}`);
            });
            await registerActivation(flagName, hookableValue);
        }

        return hookableValueFlags[flagName];
    }
    exportOnWindow({ getFlagActivationValue, hookableValueFlags });
    return getFlagActivationValue;
})();
