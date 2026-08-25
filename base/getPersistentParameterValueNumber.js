// @import{getPersistentParameterValue}

/**
 * Gets the persistent number value of a parameter, and registers menu commands to change it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * The menu command will be "Change {parameterName} (current : {currentValue})". When the menu command is selected, the new value will be asked, and the parameter value will be updated.
 * 
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {Number} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<Number>>} The hookable value for the parameter
 */
const getPersistentParameterValueNumber = async (parameterName, defaultValue, options) => {
    return await getPersistentParameterValue(parameterName, defaultValue, {
        onParameterNeedNewValue: async (oldValue) => {
            const newValueString = prompt(`⌨️ Enter new value for ${parameterName}:`, oldValue);
            const newValue = Number(newValueString);
            return newValue;
        },
        getMenuLabel: async (parameterName, newValue, scopeName) => {
            return `⚙️ Change ${parameterName} (current : ${newValue}${scopeName ? `, scope: ${scopeName}` : ''})`;
        },
        ...options,
    })
}
