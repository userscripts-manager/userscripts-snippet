// @import{getPersistentParameterValue}

/**
 * Gets the persistent boolean value of a parameter, and registers menu commands to toggle it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * 
 * The menu command will be "Enable {parameterName}" if the parameter is currently disabled, 
 * and "Disable {parameterName}" if the parameter is currently enabled. When the menu command is selected, 
 * the parameter value will be toggled.
 * 
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {Boolean} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<Boolean>>} The hookable value for the parameter
 */
const getPersistentParameterValueBoolean = async (parameterName, defaultValue, options) => {
    return await getPersistentParameterValue(parameterName, defaultValue, {
        onParameterNeedNewValue: async (oldValue) => {
            return !oldValue;
        },
        getMenuLabel: async (parameterName, newValue, scopeName) => {
            return `${newValue ? '❌ Disable' : '✅ Enable'} ${parameterName}${scopeName ? ` (scope: ${scopeName})` : ''}`;
        },
        ...options,
    })
}
