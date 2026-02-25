/**
 * Transform an input element into a search filter for a list of items with show/hide and current item management. Use the register pattern.
 * 
 * @param {HTMLInputElement} inputElement The input element to use as a search filter
 * @param {Array<{name: string, element: HTMLElement, shown: boolean}>} list The list of items to filter
 * @param {Object} options Additional options for customizing the behavior
 * @param {string} [options.filteredOutClass] The class to add to items that are filtered out (default is 'x-filtered-out', not used if showItem and hideItem are provided)
 * @param {string} [options.currentItemClass] The class to add to the current item (default is 'x-current-item', not used if setItemCurrent is provided)
 * @param {(item: {name: string, element: HTMLElement, shown: boolean}) => HTMLElement} [options.getElement] A function to get the HTMLElement of an item (default is item.element)
 * @param {(item: {name: string, element: HTMLElement, shown: boolean}, isShown: boolean) => void} [options.setShownItem] A function to set an item as shown or not (default is to set item.shown to the isShown value)
 * @param {(item: {name: string, element: HTMLElement, shown: boolean}) => boolean} [options.isItemShown] A function to determine if an item is shown or not (default is to return item.shown)
 * @param {(item: {name: string, element: HTMLElement, shown: boolean}, isShown: boolean) => void} [options.showItem] A function to show or hide an item (default is to remove the 'x-filtered-out' class from the element)
 * @param {(item: {name: string, element: HTMLElement, shown: boolean}, isCurrent: boolean) => void} [options.setItemCurrent] A function to set an item as current or not (default is to add/remove the 'x-current-item' class from the element)
 * @param {HTMLElement} [options.scrollableContainer] The container element to ensure the current item is visible within the scrollable area when it changes (default is null, no scrolling)
 * @param {(movePosition: (deltaPosition: number) => void) => void} [options.onMovePosition] A function that is called with the movePosition function to allow moving the current position by a delta (e.g. for keyboard navigation)
 * @param {(getCurrentItem: () => null | {name: string, element: HTMLElement, shown: boolean}) => void} [options.onGetCurrentItem] A function that is called with the getCurrentItem function to allow getting the current item (e.g. for keyboard actions on the current item)
 * @param {() => {}} [options.onUpdateFilteredList] A function that is called when the filtered list is updated to allow reacting to changes in the filtered items
 * @param {() => {}} [options.onOnInputChanged] A function that is called when the input value changes to allow reacting to changes in the input value
 * 
 * @returns {()=>void} A function to cleanup the registration
 */
const registerMakeInputSearchFilterList = (inputElement, list, options) => {
    if (!options) {
        options = {}
    }

    const filteredOutClass = options.filteredOutClass || 'x-filtered-out'
    const currentItemClass = options.currentItemClass || 'x-current-item'

    const registrationManager = new RegistrationManager()

    const getElement = options.getElement || ((item) => item.element)
    const setShownItem = options.setShownItem || ((item, isShown) => item.shown = isShown)
    const isItemShown = options.isItemShown || ((item) => item.shown)

    const showItem = options.showItem || ((item, isShown) => {
        if (isShown) {
            setShownItem(item, true)
            getElement(item).classList.remove(filteredOutClass)
        } else {
            setShownItem(item, false)
            getElement(item).classList.add(filteredOutClass)
        }
    })

    const setItemCurrent = options.setItemCurrent || ((item, isCurrent) => {
        if (item) {
            if (isCurrent) {
                getElement(item).classList.add(currentItemClass)
            } else {
                getElement(item).classList.remove(currentItemClass)
            }
        }
    })

    let filteredList = []
    let currentPosition = -1
    let currentItem = null

    const scrollableContainer = options.scrollableContainer || null

    registrationManager.onRegistration(() => {
        if (currentItem !== null) {
            setItemCurrent(currentItem, false)
        }
        currentItem = null;
        currentPosition = -1;
    })
    const updatePosition = (newPosition) => {
        if (currentPosition !== newPosition || currentItem !== filteredList[newPosition]) {
            setItemCurrent(currentItem, false)
            currentPosition = newPosition;
            currentItem = filteredList[currentPosition]
            if (!currentItem) {
                currentItem = null
                currentPosition = -1
            } else {
                setItemCurrent(currentItem, true)
                if (scrollableContainer) {
                    ensureVisible(getElement(currentItem), scrollableContainer)
                }

            }
        }
    }

    const movePosition = (deltaPosition) => {
        let newPosition = currentPosition + deltaPosition;
        if (newPosition < 0) {
            if (currentPosition < 0) {
                newPosition = -1
            } else {
                newPosition = 0
            }
        } else if (newPosition >= filteredList.length) {
            newPosition = filteredList.length - 1
        }
        updatePosition(newPosition)
    }

    const getCurrentItem = () => {
        return currentItem
    }

    const updateFilteredList = () => {
        filteredList = list.filter(isItemShown)
        if (currentPosition >= 0) {
            updatePosition(0)
        }
    }

    if (options.onMovePosition) {
        options.onMovePosition(movePosition)
    }

    if (options.onGetCurrentItem) {
        options.onGetCurrentItem(getCurrentItem)
    }

    if (options.onUpdateFilteredList) {
        options.onUpdateFilteredList(updateFilteredList)
    }


    const getItemValue = options.getItemValue || ((item) => item.name)

    if (!list.every(item => item.name)) {
        list.filter(item => (!item.name)).forEach(item => item.name = item.textContent.trim())
    }

    const onInputChanged = () => {
        const filterValue = inputElement.value.toLowerCase();
        const filterValueParts = filterValue.split(' ').filter((part) => part.length > 0);
        list.forEach((item) => {
            const name = getItemValue(item).toLowerCase();
            const isVisible = filterValueParts.every((part) => name.includes(part));
            showItem(item, isVisible);
        });
        updateFilteredList();
    }

    if (options.onOnInputChanged) {
        options.onOnInputChanged(onInputChanged)
    }

    registrationManager.onRegistration(registerEventListener(inputElement, 'input', onInputChanged));
    onInputChanged()

    return () => registrationManager.cleanupAll()
}
