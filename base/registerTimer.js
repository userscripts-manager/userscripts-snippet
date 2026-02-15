/**
 * Registers a timer that repeatedly calls the provided callback function at the specified delay interval using the register pattern.
 * @param {() => void} callback The function to be called at each interval
 * @param {number} delay The delay in milliseconds between each call to the callback function
 * @returns {() => void} A function to unregister (clear the timer)
 */
const registerTimer = (callback, delay) => {
    let timerId = setInterval(() => {
        callback();
    }, delay);
    return () => {
        clearInterval(timerId);
    }
}