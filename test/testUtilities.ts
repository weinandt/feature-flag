export class TestUtilities {
    static wait(timeToWaitInMs: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeToWaitInMs).unref?.()
        })
    }
}