// @import{getElements}
// @import{createElementExtended}
// @import{RegistrationManager}
// @import{registerDomNodeMutatedUnique}
// @import{HookableValue}
// @import{forEachSync}
// @import{font46tools}

/**
 * @typedef {{data: Uint8Array, width: number, height: number}} ImageStruct
 */

/**
 * A class that patches the shortcut icon of the current page to add a information on it. The original icon is restored when the patch is unregistered.
 */
class ShortcutIconPatcher {
    constructor() {
        /** @type{HookableValue<ImageStruct|null>} */
        this.originalImageStruct = new HookableValue("originalImageStruct", null);
        /** @type{HookableValue<String|null>} */
        this.macaronColor = new HookableValue("macaronColor", null);
        /** @type{HookableValue<String|null>} */
        this.textFgColor = new HookableValue("textFgColor", "#000000");
        /** @type{HookableValue<String|null>} */
        this.textBgColor = new HookableValue("textBgColor", "rgba(255, 255, 255, 0.8)");
        /** @type{HookableValue<String|null>} */
        this.text = new HookableValue("text", null);
        this.currentShortcutIcon = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 32;
        this.canvas.height = 32;

        this.registrationManager = new RegistrationManager({ autoCleanupOnAfterFirstCleanup: true });
    }


    /**
     * Register the creation of the patched shortcut icon and the mutations observer to update it when the original shortcut icon changes. 
     * Also register the cleanup function to restore the original shortcut icon when the patch is unregistered.
     * @returns {Promise<function(): Promise<void>>} A function that can be called to unregister the patch and restore the original shortcut icon.
     */
    async register() {
        if (this.registrationManager.cleanupFunctions.length > 0 && !this.registrationManager.hasBeenCleanedUp) {
            await this.registrationManager.cleanupAll()
        }
        if (this.registrationManager.hasBeenCleanedUp) {
            this.registrationManager = new RegistrationManager({ autoCleanupOnAfterFirstCleanup: true });
        }
        this.currentShortcutIcon = createElementExtended('link', {
            parent: document.head,
            attributes: {
                rel: "shortcut icon",
                href: "",
            }
        });

        this.originalImageStruct.register(async (newImageStruct) => {
            await this.updateIcon(newImageStruct, this.macaronColor.value, this.text.value, this.textFgColor.value, this.textBgColor.value);
        })

        this.macaronColor.register(async (newMacaronColor) => {
            await this.updateIcon(this.originalImageStruct.value, newMacaronColor, this.text.value, this.textFgColor.value, this.textBgColor.value);
        })

        this.text.register(async (newText) => {
            await this.updateIcon(this.originalImageStruct.value, this.macaronColor.value, newText, this.textFgColor.value, this.textBgColor.value);
        })

        this.textFgColor.register(async (newTextFgColor) => {
            await this.updateIcon(this.originalImageStruct.value, this.macaronColor.value, this.text.value, newTextFgColor, this.textBgColor.value);
        })

        this.textBgColor.register(async (newTextBgColor) => {
            await this.updateIcon(this.originalImageStruct.value, this.macaronColor.value, this.text.value, this.textFgColor.value, newTextBgColor);
        })

        forEachSync(getElements('link[rel~="icon"]'), async (link) => {
            if (this.currentShortcutIcon !== link) {
                const imageStruct = await this._getImageStructFromImageFromUrl(link.href);
                if (imageStruct) {
                    if (!this.originalImageStruct.value || (this.originalImageStruct.value.width * this.originalImageStruct.value.height < imageStruct.width * imageStruct.height)) {
                        await this.originalImageStruct.setValue(imageStruct);
                    }
                }
            }
        })

        if (!this.originalImageStruct.value) {
            const imageStruct = await this._getImageStructFromImageFromUrl("/favicon.ico");
            if (imageStruct) {
                await this.originalImageStruct.setValue(imageStruct);
            }
        }

        this.registrationManager.onRegistration(
            registerDomNodeMutatedUnique(
                () => getElements('link[rel~="icon"]'),
                async (link) => {
                    if (link !== this.currentShortcutIcon) {
                        const imageStruct = await this._getImageStructFromImageFromUrl(link.href);
                        if (imageStruct) {
                            await this.originalImageStruct.setValue(imageStruct);
                        }
                    }
                }
            )
        )

        this.registrationManager.onRegistration(async () => {
            if (this.currentShortcutIcon) {
                if (this.originalImageStruct.value) {
                    await this._resetCanvasToOriginalImageStruct(this.originalImageStruct.value);
                    this.currentShortcutIcon.href = this.canvas.toDataURL("image/png");
                }


                this.currentShortcutIcon.remove();
                this.currentShortcutIcon = null;

                this.originalImageStruct.setValue(null);
            }
        })

        return async () => {
            await this.registrationManager.cleanupAll();
        }
    }

    /**
     * Set the color of the macaron to be added on the shortcut icon. The macaron is a circle drawn on the bottom right of the icon, that can be used to display a color information on the icon.
     * @param {string} color The color of the macaron, in any format supported by CSS (e.g. "red", "#ff0000", "rgb(255, 0, 0)", etc.)
     * @returns {Promise<void>} A promise that resolves when the macaron color has been updated on the icon
     */
    async setMacaronColor(color) {
        await this.macaronColor.setValue(color);
    }

    /**
     * Set the text to be added on the shortcut icon. The text is drawn on the bottom right of the icon, that can be used to display a textual information on the icon. The text is drawn using a custom 4x6 font, so it is recommended to use short texts (1 or 2 characters) to avoid making the icon unreadable.
     * @param {string} text The text to add on the icon
     * @returns {Promise<void>} A promise that resolves when the text has been updated on the icon
     */
    async setText(text) {
        await this.text.setValue(text);
    }

    /**
     * Set the foreground color of the text to be added on the shortcut icon. The text is drawn on the bottom right of the icon, that can be used to display a textual information on the icon. The text is drawn using a custom 4x6 font, so it is recommended to use short texts (1 or 2 characters) to avoid making the icon unreadable.
     * @param {string} color The foreground color of the text, in any format supported by CSS (e.g. "red", "#ff0000", "rgb(255, 0, 0)", etc.)
     * @returns {Promise<void>} A promise that resolves when the text foreground color has been updated on the icon
     */
    async setTextFgColor(color) {
        await this.textFgColor.setValue(color);
    }

    /**
     * Set the background color of the text to be added on the shortcut icon. The text is drawn on the bottom right of the icon, that can be used to display a textual information on the icon. The text is drawn using a custom 4x6 font, so it is recommended to use short texts (1 or 2 characters) to avoid making the icon unreadable.
     * @param {string} color The background color of the text, in any format supported by CSS (e.g. "red", "#ff0000", "rgb(255, 0, 0)", etc.)
     * @returns {Promise<void>} A promise that resolves when the text background color has been updated on the icon
     */
    async setTextBgColor(color) {
        await this.textBgColor.setValue(color);
    }

    /**
     * Get an HTMLImageElement from a url, that can be used to draw on a canvas
     * 
     * @param {string} url 
     * @returns {Promise<HTMLImageElement>}
     */
    _getImageForCanvasFromUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = url;
        });
    }

    /**
      * Get an object containing the data, width and height of the image at the provided url. The data is a Uint8Array containing the RGBA values of the image (4 bytes per pixel).
      * 
      * @param {string} url 
      * @returns {Promise<ImageStruct>}
      */
    _getImageStructFromImageFromUrl(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const img = await this._getImageForCanvasFromUrl(url);
                const canvas = document.createElement('canvas');
                const width = img.width;
                const height = img.height;

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                // console.log({ canvas })
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = new Uint8Array(imageData.data.buffer);
                resolve({ data, width, height });
            } catch (err) {
                console.log(`Exception during _getImageStructFromImageFromUrl for url ${url}:`, err);
                resolve(null);
            }
        });
    }

    /**
     * Reset the canvas to the original image struct, by putting the original image data on the canvas. This is used to restore the original icon before drawing the macaron on it.
     * @param {ImageStruct} imageStruct The image struct to use as background
     * @returns {Promise<void>} A promise that resolves when the canvas has been reset to the original image struct
     */
    async _resetCanvasToOriginalImageStruct(imageStruct) {
        if (imageStruct) {
            this.canvas.width = imageStruct.width;
            this.canvas.height = imageStruct.height;

            const imageData = this.ctx.createImageData(imageStruct.width, imageStruct.height);
            imageData.data.set(imageStruct.data);
            this.ctx.putImageData(imageData, 0, 0);
        }
    }

    /**
     * Update the shortcut icon by drawing the original icon on the canvas, then drawing a macaron with the provided color on it, and finally setting the href of the shortcut icon to the data URL of the canvas.
     * @param {ImageStruct} imageStruct The image struct to use as background
     * @param {string|null} macaronColor The macaron color to ass
     * @param {string|null} text The text to add on the icon (not implemented yet)
     * @param {string|null} textFgColor The foreground color of the text
     * @param {string|null} textBgColor The background color of the text
     * @returns {Promise<void>} A promise that resolves when the icon has been updated
     */
    async updateIcon(imageStruct, macaronColor, text, textFgColor, textBgColor) {
        if (this.currentShortcutIcon) {
            await this._resetCanvasToOriginalImageStruct(imageStruct);
            if (macaronColor) {
                const radius = Math.min(this.ctx.canvas.width, this.ctx.canvas.height) / 4;
                this.ctx.beginPath();
                this.ctx.arc(this.ctx.canvas.width - radius, this.ctx.canvas.height - radius, radius, 0, 2 * Math.PI);
                this.ctx.fillStyle = macaronColor;
                this.ctx.fill();
                this.ctx.closePath();
            }
            if (text) {
                const { minX, minY, maxX, maxY, getPixels } = font46tools.getInfosPixels(text);
                const scale = Math.max(Math.floor(Math.min((this.ctx.canvas.width * 0.75) / (maxX - minX), (this.ctx.canvas.height * 0.6) / (maxY - minY))), 1);
                const xMin = this.ctx.canvas.width - scale * (maxX - minX + 1) - 1;
                const yMin = 1;
                const deltaX = scale * (maxX - minX - 1);
                const deltaY = scale * (maxY - minY - 1);

                const rect = (x, y, w, h, c) => {
                    this.ctx.fillStyle = c;
                    this.ctx.fillRect(x, this.canvas.height - y - h, w, h);
                }
                if (textBgColor) {
                    rect(xMin + scale, yMin + scale, deltaX, deltaY, textBgColor);
                    rect(xMin, yMin + scale, scale, deltaY, textBgColor);
                    rect(xMin + scale + deltaX, yMin + scale, scale, deltaY, textBgColor);
                    rect(xMin + scale, yMin, deltaX, scale, textBgColor);
                    rect(xMin + scale, yMin + scale + deltaY, deltaX, scale, textBgColor);
                }

                if (textFgColor) {
                    for (const [x, y] of getPixels()) {
                        rect(xMin + x * scale, yMin + y * scale, scale, scale, textFgColor);
                    }
                }
            }
            this.currentShortcutIcon.href = this.canvas.toDataURL("image/png");
        }

    }
}
