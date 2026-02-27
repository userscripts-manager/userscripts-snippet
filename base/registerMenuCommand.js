// @grant{GM.registerMenuCommand}
/**
 * Register a menu command in the userscript manager's menu (e.g., Tampermonkey, Greasemonkey, Violentmonkey).
 * @param {string} name The name of the menu command to display.
 * @param {() => void} callback The function to execute when the menu command is selected.
 */
const registerMenuCommand = (name, callback) => {
    GM.registerMenuCommand(name, callback);
}