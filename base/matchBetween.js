// @import{matchBetweenAndRemaining}
/**
 * Match the part of a string that is between two patterns
 * @param {String} string The string to search within
 * @param {String} startPattern The pattern that marks the start of the part to match
 * @param {String} endPattern The pattern that marks the end of the part to match
 * @return {String|null} The matched part of the string, or null if the patterns are not found in the correct order
 */
const matchBetween = (string, startPattern, endPattern) => {
    const result = matchBetweenAndRemaining(string, startPattern, endPattern)
    return result ? result.matched : null
}
