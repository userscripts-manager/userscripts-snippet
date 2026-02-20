/**
 * Ensure that an element is visible in a scrollable container by scrolling if needed
 * 
 * @param {HTMLElement} element The element to ensure is visible
 * @param {HTMLElement} scrollableContainer The scrollable container than can scroll to ensure the element is visible
 */
const ensureVisible = (element, scrollableContainer, dirMinName = 'top', dirMaxName = 'bottom') => {
    const elementRect = element.getBoundingClientRect()
    const containerRect = scrollableContainer.getBoundingClientRect()
    const elementDirMin = elementRect[dirMinName]
    const elementDirMax = elementRect[dirMaxName]
    const containerDirMin = containerRect[dirMinName]
    const containerDirMax = containerRect[dirMaxName]
    if (elementDirMin < containerDirMin) {
        scrollableContainer.scrollBy({ [dirMinName]: (elementDirMin + elementDirMax) / 2 - (containerDirMin + containerDirMax) / 2, behavior: 'smooth' })
    } else if (elementDirMax > containerDirMax) {
        scrollableContainer.scrollBy({ [dirMinName]: (elementDirMin + elementDirMax) / 2 - (containerDirMin + containerDirMax) / 2, behavior: 'smooth' })
    }
}
