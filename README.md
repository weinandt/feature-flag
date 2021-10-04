# Feature Flag
Provides a wrapper around a map of feature flags (feature flag name to boolean value). Callers can provide their own async lookup function. This means consumers of the library can keep the feature flags in any storage they choose (MySql, HTTP API, etc.).

## Creating a Feature Flag Cache

```typescript
const flagName = 'myFeatureFlag'
const initialFlagValue = true

// The initial map is optional.
const initialFlagMap = new Map<string, boolean>(
    [[flagName, flagValue]]
)


const flagCache = new FeatureFlagCache({
    flagLookupInterval: 10 * 60 * 1000,
    flagLookUp: async () => {
        // Make your async db/http/etc. call here.
        return new Map<string, boolean>()
    },
    initialFlagMap: initialFlagMap,
})

// Pull all the flag values.
await flagCache.refreshFlags()

// See if a flag is enabled.
const newFlagValue = flagCache.isEnabled(flagName)
```

## TODO:
1. Add a way to group flags by some value. For example, a group of users could have a value set for that group id.
1. Errors looking up a value are ignored. Should they be surfaced to the caller via a callback?
1. Unit test.
1. Add a timeout to the amount of time to spend looking up flags.
1. Make sure everything works in the browser.
1. Write tests for once lock.
1. Determine name of synchronization pattern OnceLock is using.