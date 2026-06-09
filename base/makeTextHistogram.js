/**
 * Create a string representation of a histogram based on the values of an object, using a specified character for the bars and sorting the entries by a specified function
 * @param {Object} obj An object where the keys are the labels and the values are the values to create the histogram from
 * @param {Object} [options]
 * @param {String} [options.char] The character to use for the bars of the histogram, default is '█'
 * @param {Number} [options.length] The maximum length of the bars in characters, default is 20
 * @param {(key: String, value: Number) => any} [options.sortBy] A function to sort the entries by, it takes the key and value as parameters and returns the value to sort by for that entry
 * @returns {String} A string representation of the histogram, with one line per entry in the object, formatted as "key | bar value"
 */
const makeTextHistogram = (obj, options) => {
    if (!options) {
        options = {}
    }
    const char = options.char || '█'
    const maxBarLength = options.length || 20
    const sortBy = options.sortBy
    const maxValue = Math.max(...Object.values(obj))
    const maxLabelLength = Math.max(...Object.keys(obj).map((k) => k.length))
    /** @type{string[]} */
    const lines = []
    const entries = Object.entries(obj)
    if (sortBy) {
        entries.sort((a, b) => {
            const aValue = sortBy(a[0], a[1])
            const bValue = sortBy(b[0], b[1])
            if (aValue < bValue) return -1
            if (aValue > bValue) return 1
            return 0
        }
        )
    }
    for (const [key, value] of entries) {
        const barLength = Math.round((value / maxValue) * maxBarLength)
        const bar = char.repeat(barLength)
        const line = `${key.padStart(maxLabelLength)} | ${bar} ${value}`
        lines.push(line)
    }
    return lines.join('\n')
}
