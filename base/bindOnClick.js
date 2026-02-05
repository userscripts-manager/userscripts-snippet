// @import{registerEventListener}
/**
 * Bind an onClick handler an element. Returns uninstall handler
 * 
 * @param {HTMLElement} element The element to bind the handler
 * @param {()=>boolean|undefined} callback The onClick handler
 * @returns {()=>{}}
 */
const bindOnClick = (element, callback) => {
    const onClick = (e) => {
        const result = callback()
        if (result !== false) {
            e.preventDefault()
            e.stopImmediatePropagation()
        }
    }
    return registerEventListener(element, 'click', onClick, true);
}
