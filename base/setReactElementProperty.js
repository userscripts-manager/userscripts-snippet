/**
 * Sets a property on a React element and dispatches an event to notify React of the change.
 * This is necessary because React may not detect changes to properties set directly on DOM elements.
 * By dispatching an event, we can trigger React's event system to recognize the change and update the component accordingly.
 *  
 * @param {HTMLElement} element The React element on which to set the property
 * @param {string} eventName The name of the event to dispatch
 * @param {string} propertyName The name of the property to set
 * @param {*} value The value to set for the property
 * @param {Object} [options] Additional options for the event
 * @param {Event} [options.EventType] The type of event to dispatch (default is Event)
 * @param {Object} [options.eventValues] Additional values to include in the event (default is {})
 */
const setReactElementProperty = (element, eventName, propertyName, value, options) => {
    if (!options) {
        options = {}
    }
    const nativeElementPropertySetter =
        Object.getOwnPropertyDescriptor(
            element.__proto__,
            propertyName
        ).set;

    nativeElementPropertySetter.call(element, value);
    
    let eventType = Event
    if (options.EventType) {
        eventType = options.EventType
    }
    let eventValues = {}
    if (options.eventValues) {
        eventValues = options.eventValues
    }
    element.dispatchEvent(new eventType(eventName, { bubbles: true, ...eventValues }));
}
