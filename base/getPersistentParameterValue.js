// @import{exportOnWindow}
// @import{monkeyGetSetValue}
// @import{monkeySetValue}
// @import{registerMenuCommand}
// @import{HookableValue}
// @import{PERSISTENT_PARAMETER_SCOPE}
/**
 * @typedef {Object} GetPersistentParameterValueOptions
 * @property {((oldValue: T) => Promise<T>)} [onParameterNeedNewValue] A callback function that is called when a new parameter value is needed, with the old value as parameter, and that returns the new value
 * @property {((parameterName: string, newValue: T) => Promise<String>)} [getMenuLabel] A callback function that is called to get the menu label, with the parameter name and the new value as parameters, and that returns the menu label
 * @property {PERSISTENT_PARAMETER_SCOPE} [scope] The scope of the persistent parameter. This determines how the parameter value is stored and shared across different pages. Default is PERSISTENT_PARAMETER_SCOPE.BY_SCRIPT.
 * @property {string} [customScopeKey] If the scope is BY_CUSTOM, this key is used to differentiate the parameter value. It can be set to any string, but it should be unique to avoid conflicts with other parameters. Default is an empty string.
 * @property {boolean} [alertOnChange] Whether to alert the user when the parameter value changes. Default is false.
 */

/**
 * Gets the persistent string value of a parameter, and registers menu commands to toggle it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * 
 * The menu command will be "Change {parameterName} (current : {currentValue})". 
 * When the menu command is selected, the value will be asked, the parameter value will be updated.
 * 
 * @template T The type of the parameter value
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {T} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<T>>} The hookable value for the parameter
 */
const getPersistentParameterValue = (() => {
    /**
     * @type {{[parameterName: string]: HookableValue<T>}}
     * @template T
     */
    const hookableValueParameterValues = {};
    exportOnWindow({ hookableValueParameterValues });

    /**
     * @template T The type of the parameter value
     * @param {String} parameterName The name of the parameter (used for menu command and storage)
     * @param {T} defaultValue The default value of the parameter
     * @param {GetPersistentParameterValueOptions} [options] Additional options
     * @returns {Promise<HookableValue<T>>} The hookable value for the parameter
     */
    return async (parameterName, defaultValue, options) => {
        if (!options) {
            options = {};
        }
        const getMenuLabel = options?.getMenuLabel ?? ((parameterName, newValue) => `Change ${parameterName} (current : ${newValue})`);
        const onParameterNeedNewValue = options?.onParameterNeedNewValue ?? (async (oldValue) => {
            const newValue = prompt(`Enter new value for ${parameterName}:`, oldValue);
            return newValue;
        });
        const alertOnChange = options?.alertOnChange ?? false;
        const scope = options?.scope ?? PERSISTENT_PARAMETER_SCOPE.BY_SCRIPT;
        let parameterNameForMonkey = parameterName;
        if (scope === PERSISTENT_PARAMETER_SCOPE.BY_HOST) {
            parameterNameForMonkey = `${parameterName}_host_${location.host}`;
        } else if (scope === PERSISTENT_PARAMETER_SCOPE.BY_DOMAIN) {
            parameterNameForMonkey = `${parameterName}_domain_${location.hostname.split('.').slice(-2).join('.')}`;
        } else if (scope === PERSISTENT_PARAMETER_SCOPE.BY_CUSTOM) {
            const customScopeKey = options?.customScopeKey ?? '';
            parameterNameForMonkey = `${parameterName}_custom_${customScopeKey}`;
        }

        /** @type{(()=>Promise<void>) | null} */
        let menuCommandUnregisterFunction = null;

        if (!hookableValueParameterValues[parameterName]) {
            const value = await monkeyGetSetValue(parameterNameForMonkey, defaultValue);
            hookableValueParameterValues[parameterName] = new HookableValue(parameterName);
            const hookableValue = hookableValueParameterValues[parameterName];
            hookableValue.register(async (newValue) => {
                await monkeySetValue(parameterNameForMonkey, newValue);

                if (menuCommandUnregisterFunction) {
                    await menuCommandUnregisterFunction();
                    menuCommandUnregisterFunction = null;
                }
                const label = await getMenuLabel(parameterName, newValue);
                menuCommandUnregisterFunction = await registerMenuCommand(label, async () => {
                    const nextValue = await onParameterNeedNewValue(newValue);
                    if (nextValue !== null) {
                        await hookableValue.setValue(nextValue);
                    }
                });

                if (alertOnChange) {
                    alert(`Parameter [${parameterName}] is set to ${hookableValue.value}`);
                }
            });
            hookableValue.value = value;
        }

        return hookableValueParameterValues[parameterName];
    }
})();
exportOnWindow({ getPersistentParameterValue });
