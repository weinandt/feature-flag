import { OnceLockAsync } from "./onceLockAsync"

export type FlagMap = Map<string, boolean>
export type FlagValueLookupFunction = (flagNames: string[]) => Promise<FlagMap>

export interface FeatureFlagCacheConfig {
    flagLookUp: FlagValueLookupFunction
    flagLookupInterval: number // Interval at which the flagLookUp funciton will be invoked (in ms).
    initialFlagMap?: FlagMap
}

export class FeatureFlagCache {
    private flagLookUp: FlagValueLookupFunction
    private flagMap: FlagMap
    private flagLookupLock: OnceLockAsync = new OnceLockAsync()

    constructor(config: FeatureFlagCacheConfig) {
        if (config.flagLookUp == null) {
            throw new Error('Flag lookup must be present')
        }

        this.flagLookUp = config.flagLookUp
        this.flagMap = config.initialFlagMap == null ? new Map<string, boolean>() : config.initialFlagMap

        const timer = setInterval(() => this.refreshFlags(), config.flagLookupInterval)

        // There is no unref in the browser so, only calling if it is available (in node js).
        timer.unref?.()
    }

    /**
     * This can be immediately called after the constructor to ensure the flags values reflect the current state.
     */
    public async refreshFlags(): Promise<void> {
        // Get the lock
        if (this.flagLookupLock.acquire()) {
            let refreshMap: FlagMap = new Map<string, boolean>()
            try {
                refreshMap = await this.flagLookUp([...this.flagMap.keys()])
            }
            catch (err: any) {
                // TODO: callback to user defined error function.
            }

            refreshMap.forEach((value, key) => this.flagMap.set(key, value))

            this.flagLookupLock.release()
        }
        else {
            await this.flagLookupLock.waitForLockRelease()
        }
    }

    public addFlag(flagName: string, isEnabled = false): void {
        this.flagMap.set(flagName, isEnabled)
    }

    public isEnabled(flagName: string): boolean {
        let isEnabled = this.flagMap.get(flagName)
        if (isEnabled == null) {
            isEnabled = false
            this.addFlag(flagName, isEnabled)
        }

        return isEnabled
    }
}