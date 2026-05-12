/**
 * Call the callback when the document change
 * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
 * Use the register pattern thus return the unregister function as a result
 * @param {()=>Promise<void>} callback 
 * @return {()=>Promise<void>} The unregister function
 */
const registerDomNodeMutated = async (callback) => {
    let callbackInProgress = false

    const action = async () => {
        if (!callbackInProgress) {
            callbackInProgress = true
            await callback()
            callbackInProgress = false
        }
    }

    const mutationObserver = new MutationObserver(async (mutationsList, observer) => { await action() });
    await action()
    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

    return async () => mutationObserver.disconnect()
}
