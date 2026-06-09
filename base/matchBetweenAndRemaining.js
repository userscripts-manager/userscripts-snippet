/**
 * Match the part of a string that is between two patterns, and return it along with the remaining string after the end pattern
 * @param {String} string The string to search within
 * @param {String} startPattern The pattern that marks the start of the part to match
 * @param {String} endPattern The pattern that marks the end of the part to match
 * @returns {{matched: String, remaining: String}|null} An object containing the matched part and the remaining string after the end pattern, or null if the patterns are not found in the correct order
 */
const matchBetweenAndRemaining = (string, startPattern, endPattern) => {
    const startIndex = string.indexOf(startPattern)
    if (startIndex === -1) {
        return null
    }
    const endIndex = string.indexOf(endPattern, startIndex + startPattern.length)
    if (endIndex === -1) {
        return null
    }
    const matched = string.substring(startIndex + startPattern.length, endIndex)
    const remaining = string.substring(endIndex + endPattern.length)
    return { matched, remaining }
}
