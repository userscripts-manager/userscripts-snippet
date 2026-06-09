/**
 * Remove diacritics from a string, by normalizing it to NFD form and removing the combining diacritical marks
 * @param {String} string
 * @returns {String}
 */
const removeDiacritics = (string) => string?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '')
