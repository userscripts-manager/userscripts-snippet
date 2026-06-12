// @require{https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js}
/**
 * Download a zip file with the given filename and content provided by the async generator
 * 
 * @param {string} fileName The zip filename to download
 * @param {() => AsyncGenerator<{path: string, data: Uint8Array<ArrayBuffer>, date: Date|undefined}>} contentProvider 
 * @param {Object} [options]
 * @param {(count: number) => void} [options.onFileCount] A callback function that receives the total number of files to be added to the zip. This is called after all files have been added but before generating the zip content.
 * @param {(props: { count: number }, actions: { addFile: (file: { path: string, data: Uint8Array<ArrayBuffer>|string, date?: Date, encoding?: string }) => void, changeFileName: (newFileName: string) => void }) => Promise<void>} [options.onPostFileCount] An async callback function that receives the total file count and an actions object with an addFile method. This is called after onFileCount and allows adding more files to the zip before it is generated.
 * @param {(size: number) => void} [options.onNeedSize] A callback function that receives the size of the generated zip content in bytes. This is called after the zip content is generated but before triggering the download.
 * @param {(content: Blob) => Promise<void>} [options.onBlobContent] An async callback function that receives the generated zip content as a Blob. This is called after the zip content is generated but before triggering the download, allowing for custom handling of the content (e.g., uploading to a server) instead of downloading.
 * @returns {Promise<void>} A promise that resolves when the download has been triggered (or the content has been handled by onBlobContent)
 */
const downloadZip = async (fileName, contentProvider, options = {}) => {
    const zip = new JSZip();
    let fileNameToUse = fileName;
    let count = 0;
    for await (const { path, data, date } of contentProvider()) {
        const options = {};

        if (date) {
            options.date = date;
        }

        zip.file(path, data, options);
        count++;
    }
    if (options.onFileCount) {
        options.onFileCount(count);
    }
    if (options.onPostFileCount) {
        const props = { count };
        const actions = {
            addFile({ path, data, date, encoding }) {
                const options = {};

                if (date) {
                    options.date = date;
                }
                if (encoding) {
                    data = new TextEncoder(encoding).encode(data);
                }

                zip.file(path, data, options);
            },
            changeFileName(newFileName) {
                fileNameToUse = newFileName;
            }
        };
        await options.onPostFileCount(props, actions);
    }
    const content = await zip.generateAsync({ type: "blob" });
    if (options.onNeedSize) {
        const size = content.size;
        options.onNeedSize(size);
    }
    if (options.onBlobContent) {
        await options.onBlobContent(content);
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = fileNameToUse;
    link.click();
}
