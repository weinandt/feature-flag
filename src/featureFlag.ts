export type FlagValueLookupFunction = (flagNames: string[]) => Map<string, boolean>

export interface FeatureFlagConfig {
    flagValueLookUps: FlagValueLookupFunction[]
    ignoreErrorsDuringLookup?: boolean // TODO: not yet implemented.
}

export class FeatureFlag {
    private flagValueLookUps: FlagValueLookupFunction[]
    private ignoreErrorsDuringLookup: boolean = true

    constructor(config: FeatureFlagConfig){
        this.flagValueLookUps = config.flagValueLookUps
    }

    public async initialize(): Promise<void> {

    }

    public isEnabled(flagName: string): boolean {
        return true
    }


}