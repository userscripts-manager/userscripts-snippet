/**
 * Check if a T is between two other Ts (inclusive)
 * @template T
 * @param {T} value The value to check
 * @param {T} start The start of the range
 * @param {T} end The end of the range
 * @returns {Boolean} True if the value is between start and end (inclusive), false otherwise
 */
const isBetween = (value, start, end) => value >= start && value <= end
