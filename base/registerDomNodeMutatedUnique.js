// @import{registerDomNodeMutated}
/**
 * Call the callback once per element provided by the elementProvider when the document change
 * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
 * Use the register pattern thus return the unregister function as a result
 * 
 * Ensure that when an element matching the query elementProvider, the callback is called with the element 
 * exactly once for each element
 * @param {()=>[HTMLElement]} elementProvider 
 * @param {(element: HTMLElement)=>{}} callback 
 * @param {(element: HTMLElement)=>{}} callbackOnNotHere called when an element is not here anymore (not provided by the elementProvider anymore)
 */
const registerDomNodeMutatedUnique = (elementProvider, callback, callbackOnNotHere) => {
    const domNodesHandled = new Map()
    let indexIteration = 0

    return registerDomNodeMutated(() => {
        indexIteration++;
        let currentIndexIteration = indexIteration
        for (let element of elementProvider()) {
            if (!domNodesHandled.has(element)) {
                domNodesHandled.set(element, {element, indexIteration: currentIndexIteration})
                const result = callback(element)
                if (result === false) {
                    domNodesHandled.delete(element)
                }
            } else {
                domNodesHandled.get(element).indexIteration = currentIndexIteration
            }
        }
        for (let item of domNodesHandled.values().filter(item=>item.indexIteration !== currentIndexIteration)) {
            if (callbackOnNotHere) {
                callbackOnNotHere(item.element)
            }
            domNodesHandled.delete(item.element)
        }
    })
}
