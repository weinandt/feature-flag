/**
 * A lock which can ensure code is only executed once. This can be useful for shared caches.
 */
export class OnceLockAsync {
    private resolve: ((value:void) => void) | null = null
    private promise: Promise<void> | null = null

    public acquire(): boolean {
        if (this.resolve != null) {
            return false
        }

        // Making the promise resolver outside the scoping of the promise.
        this.promise = new Promise((resolve) => {this.resolve = resolve})

        return true
    }

    /**
     * It is possible for callers without the lock to release the lock. Proper enforcement of
     * lock ownership is up to the caller.
     */
    public release(): void {
        this.resolve?.()
        this.resolve = null
        this.promise = null
    }

    public async waitForLockRelease(): Promise<void> {
        if (this.promise == null) {
            throw new Error('Should not be waiting for release of un-locked lock.')
        }

        return this.promise
    }
}