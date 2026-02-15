// @import{downloadData}

const getInfluxString = (str) => `"${str.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`
const getInfluxStringTag = (str) => `${str.replaceAll('\\', '\\\\').replaceAll(' ', '\\ ').replaceAll('"', '\\"')}`
const getInfluxBoolean = (str) => `${str === true}`
const getInfluxInteger = (str) => `${str}i`

const getInfluxValueField = (value) => {
    switch (typeof value) {
        case 'string': return getInfluxString(value)
        case 'boolean': return getInfluxBoolean(value)
        case 'number': return getInfluxInteger(value)
        default: return value
    }
}
const getInfluxValueTag = (value) => {
    switch (typeof value) {
        case 'string': return getInfluxStringTag(value)
        default: return getInfluxValueField(value)
    }
}

const get_influx_dict = (dict, getValue) => Object.entries(dict).map(([key, value]) => `${key}=${getValue(value)}`).join(',')
const get_influx_dict_tags = (dict) => get_influx_dict(dict, getInfluxValueTag)
const get_influx_dict_fields = (dict) => get_influx_dict(dict, getInfluxValueField)

/**
 * Format a line for InfluxDB line protocol. 
 * @param {string} measurement
 * @param {{[key: string]: string}} tags The tag values must be strings. They will be escaped and quoted as needed.
 * @param {{[key: string]: string|number|boolean}} fields The field values can be strings, numbers or booleans. Strings will be quoted, numbers and booleans will not.
 * @param {number|Date} date The date of the measurement. Can be a unix timestamp in seconds or a JavaScript Date object (requires options.jsdate to be true for that).
 * @param {Object} [options] Additional options.
 * @param {boolean} [options.jsdate] If true, the date is a JavaScript Date object. If false or undefined, the date is a unix timestamp in seconds.
 * @returns {string} The formatted line for InfluxDB line protocol.
 */
const formatInfluxLine = (measurement, tags, fields, date, options) => {
    if (!options) {
        options = {}
    }

    const tagsString = get_influx_dict_tags(tags)
    const fieldsString = get_influx_dict_fields(fields)
    const timestamp = options.jsdate ? date.getTime() * 1000000 : date * 1000000000
    return `${measurement},${tagsString} ${fieldsString} ${timestamp}`
}

/**
 * Format the content for an InfluxDB line protocol file from an async iterable of lines. Each line should be an object with the following properties:
 * - measurement: The measurement name for the line.
 * - tags: An object containing the tags for the line. The keys are the tag names and the values are the tag values (strings).
 * - fields: An object containing the fields for the line. The keys are the field names and the values are the field values (strings, numbers or booleans).
 * - date: The date of the measurement. Can be a unix timestamp in seconds or a JavaScript Date object (requires options.jsdate to be true for that).
 * @param {AsyncIterable<{measurement: string, tags: {[key: string]: string}, fields: {[key: string]: string|number|boolean}, date: number|Date}>} lineProvider An async iterable that provides the lines to format. Each item should be an object with the following properties:
 * - measurement: The measurement name for the line.
 * - tags: An object containing the tags for the line. The keys are the tag names and the values are the tag values (strings).
 * - fields: An object containing the fields for the line. The keys are the field names and the values are the field values (strings, numbers or booleans).
 * - date: The date of the measurement. Can be a unix timestamp in seconds or a JavaScript Date object (requires options.jsdate to be true for that).
 * @param {Object} [options] Additional options.
 * @param {boolean} [options.jsdate] If true, the date is a JavaScript Date object. If false or undefined, the date is a unix timestamp in seconds.
 * @returns {Promise<string>} The formatted content for the InfluxDB line protocol file.
 */
const formatInfluxFileContent = async (lineProvider, options) => {
    if (!options) {
        options = {}
    }
    let content = ''
    for await (const line of lineProvider) {
        const formattedLine = formatInfluxLine(line.measurement, line.tags, line.fields, line.date, options)
        content += formattedLine + '\n'
    }
    return content
}

/**
 * Download an InfluxDB line protocol file from an async iterable of lines. Each line should be an object with the following properties:
 * @param {string} filename The name of the file to download.
 * @param {AsyncIterable<{measurement: string, tags: {[key: string]: string}, fields: {[key: string]: string|number|boolean}, date: number|Date}>} lineProvider An async iterable that provides the lines to format. Each item should be an object with the following properties:
 * - measurement: The measurement name for the line.
 * - tags: An object containing the tags for the line. The keys are the tag names and the values are the tag values (strings).
 * - fields: An object containing the fields for the line. The keys are the field names and the values are the field values (strings, numbers or booleans).
 * - date: The date of the measurement. Can be a unix timestamp in seconds or a JavaScript Date object (requires options.jsdate to be true for that).
 * @param {Object} [options] Additional options.
 * @param {boolean} [options.jsdate] If true, the date is a JavaScript Date object. If false or undefined, the date is a unix timestamp in seconds.
 * @returns {Promise<void>} A promise that resolves when the file has been downloaded.
 */
const downloadInfluxFile = async (filename, lineProvider, options) => {
    if (!options) {
        options = {}
    }
    const content = await formatInfluxFileContent(lineProvider, options)
    downloadData(filename, content, { mimetype: 'text/plain', encoding: 'utf-8' })
}
