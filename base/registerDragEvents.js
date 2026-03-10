// @import{registerEventListener}
// @import{RegistrationManager}
/**
 * Registers drag and drop events on the given element, allowing you to specify custom behavior for each event type.
 * @param {HTMLElement} element - The element to register the drag events on.
 * @param {Object} options - An object containing options for the drag events.
 * @param {string} [options.classToAdd='x-dragover'] - The CSS class to add to the element when a drag event occurs.
 * @param {function} [options.onDragEnter] - A callback function to execute when a dragenter event occurs.
 * @param {function} [options.onDragOver] - A callback function to execute when a dragover event occurs.
 * @param {function} [options.onDragLeave] - A callback function to execute when a dragleave event occurs.
 * @param {function} [options.onDrop] - A callback function to execute when a drop event occurs.
 * @returns {function} A cleanup function that can be called to remove all registered event listeners.
 */
const registerDragEvents = async (element, options) => {
    if (!options) {
        options = {}
    }
    const registrationManager = new RegistrationManager()
    const classToAdd = options.classToAdd || 'x-dragover';
    const onDragEnter = options.onDragEnter || ((element, eventName, event) => { });
    const onDragOver = options.onDragOver || ((element, eventName, event) => { });
    const onDragLeave = options.onDragLeave || ((element, eventName, event) => { });
    const onDrop = options.onDrop || ((element, eventName, event) => { });
    const actionsByEventName = {
        dragenter: async (element, eventName, event) => {
            element.classList.add(classToAdd);
            onDragEnter(element, eventName, event);
        },
        dragover: async (element, eventName, event) => {
            element.classList.add(classToAdd);
            onDragOver(element, eventName, event);
        },
        dragleave: async (element, eventName, event) => {
            element.classList.remove(classToAdd);
            onDragLeave(element, eventName, event);
        },
        drop: async (element, eventName, event) => {
            element.classList.remove(classToAdd);
            onDrop(element, eventName, event);
        },
    };
    Object.keys(actionsByEventName).forEach((eventName) => {
        registrationManager.onRegistration(registerEventListener(element, eventName, async (event) => {
            event.preventDefault();
            event.stopPropagation();
            await actionsByEventName[eventName](element, eventName, event);
        }));
    })
    return () => {
        registrationManager.cleanupAll();
    }
}
