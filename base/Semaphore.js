/**
 * A simple semaphore implementation to control concurrency.
 * Allows a maximum number of concurrent operations.
 */
class Semaphore {
    /**
     * Constructor for Semaphore.
     * @param {Number} maxConcurrent The maximum number of concurrent operations allowed.
     */
    constructor(name, maxConcurrent = 1) {
        this.name = name;
        this.maxConcurrent = maxConcurrent;
        this.current = 0;
        this.queue = [];
        this.debug = false;
    }

    /**
     * Acquires the semaphore, waiting if necessary until it becomes available.
     * 
     * @param {String} name The name or identifier for the acquire request. (for logging/debugging purposes)
     * @returns A promise that resolves when the semaphore is acquired.
     */
    async acquire(name = '') {
        if (this.current < this.maxConcurrent) {
            this.current++;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            this.queue.push(() => {
                resolve();
            });
        });
    }

    /**
     * Releases the semaphore, allowing another waiting operation to proceed.
     * 
     * @param {String} name The name or identifier for the release request. (for logging/debugging purposes)
     */
    async release(name = '') {
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          next();
        } else {
          this.current--;
        }
    }
}
