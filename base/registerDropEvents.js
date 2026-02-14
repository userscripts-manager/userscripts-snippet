// @import{registerEventListener}
/**
 * Register all drag and drop events on an element.
 * 
 * @param {HTMLElement} element The element to register the events on.
 * @param {(element: HTMLElement, event: DragEvent) => void} onDrop The callback function to execute when a drop event occurs.
 * @param {Object} options Additional options for configuring the drag and drop behavior.
 * @param {string} options.classNameOnDrag The class name to add to the element when a drag event occurs (default: 'x-dragover').
 * @returns {() => void} A function to unregister all the registered events.
 */
const registerDropEvents = (element, onDrop, options) => {
    if (!options) {
        options = {}
    }
    const classNameOnDrag = options.classNameOnDrag || 'x-dragover';

    const eventNames = ['dragenter', 'dragover', 'dragleave', 'drop'];
    const actionsByEventName = {
        dragenter: (element) => element.classList.add(classNameOnDrag),
        dragover: (element) => element.classList.add(classNameOnDrag),
        dragleave: (element) => element.classList.remove(classNameOnDrag),
        drop: async (element, eventName, event) => {
            element.classList.remove(classNameOnDrag)
            onDrop(element, event);
        },
    }

    const unregisterList = []
    eventNames.forEach((eventName) => {
        unregisterList.push(registerEventListener(element, eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
            actionsByEventName[eventName](element, eventName, event);
        }));
    });

    return () => {
        unregisterList.forEach((unreg) => unreg());
        unregisterList.splice(0, unregisterList.length);
    };
}