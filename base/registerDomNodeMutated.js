/**
 * Call the callback when the document change
 * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
 * Use the register pattern thus return the unregister function as a result
 * @param {()=>Promise<void>} callback 
 * @param {Object} options
 * @param {HTMLElement} options.rootElement The root element to observe, default to document.documentElement
 * @return {()=>Promise<void>} The unregister function
 */
const registerDomNodeMutated = async (callback, options) => {
    let callbackInProgress = false

    options = options || {}
    const rootElement = options.rootElement || document.documentElement;

    const action = async () => {
        if (!callbackInProgress) {
            callbackInProgress = true
            await callback()
            callbackInProgress = false
        }
    }

    const mutationObserver = new MutationObserver(async (mutationsList, observer) => { await action() });
    await action()
    mutationObserver.observe(rootElement, { childList: true, subtree: true });

    return async () => mutationObserver.disconnect()
}
