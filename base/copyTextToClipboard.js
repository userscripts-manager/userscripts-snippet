/**
 * Copy some text to clipboard
 * 
 * @param {string} text text to copy to clipboard
 * @returns {Promise<void>}
 */
const copyTextToClipboard = async (text) => {
    if (!navigator.clipboard) {
        console.log(`Can't copy [${text}] : No navigator.clipboard API`)
        return;
    }

    await navigator.clipboard.writeText(text)
}
