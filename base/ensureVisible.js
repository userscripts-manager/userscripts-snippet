/**
 * Ensure that an element is visible in a scrollable container by scrolling if needed
 * 
 * @param {HTMLElement} element The element to ensure is visible
 * @param {HTMLElement} scrollableContainer The scrollable container than can scroll to ensure the element is visible
 * @param {Object} [options] The options for the function
 * @param {string} [options.dirMinName] The name of the minimum direction property (default is 'top')
 * @param {string} [options.dirMaxName] The name of the maximum direction property (default is 'bottom')
 * @param {number} [options.ratioScroll] The ratio to use for scrolling the container (default is 1/5, meaning the element will be scrolled to be 1/5 from the top/left of the container)
 * @param {number} [options.guardScroll] The guard ratio to use for determining when to scroll (default is 1/5, meaning the element will be considered visible if it is within the area defined by 1/5 from the top/left and 1/5 from the bottom/right of the container)
 */
const ensureVisible = (element, scrollableContainer, options) => {
    if (!options) {
        options = {}
    }

    const dirMinName = options.dirMinName || 'top'
    const dirMaxName = options.dirMaxName || 'bottom'
    const ratioScroll = options.ratioScroll !== undefined ? options.ratioScroll : 1/5
    const guardScroll = options.guardScroll !== undefined ? options.guardScroll : 1/5
    let offset = 0

    if (scrollableContainer === document.body || scrollableContainer === document.body.parentElement) {
      offset = dirMinName === 'top' ? window.scrollY : window.scrollX
    }

    const elementRect = element.getBoundingClientRect()
    const elementDirMin = elementRect[dirMinName]
    const elementDirMax = elementRect[dirMaxName]
    const scrollableContainerRect = scrollableContainer.getBoundingClientRect()
    let containerDirMin = scrollableContainerRect[dirMinName] + offset
    let containerDirMax = scrollableContainerRect[dirMaxName] + offset
    let delta = 0
    console.log({elementDirMin, elementDirMax})
    console.log({containerDirMin, containerDirMax})

    if ((elementDirMin+1) < (1-guardScroll)*containerDirMin+guardScroll*containerDirMax) {
        delta = elementDirMax - (ratioScroll * containerDirMin + (1-ratioScroll) * containerDirMax)
    } else if ((elementDirMax-1) > (1-guardScroll)*containerDirMax+guardScroll*containerDirMin) {
        delta = elementDirMin - ((1-ratioScroll) * containerDirMin + ratioScroll * containerDirMax)
    } else {
      return
    }
    const params = { [dirMinName]: delta, behavior: 'smooth'}

    scrollableContainer.scrollBy(params)
}
