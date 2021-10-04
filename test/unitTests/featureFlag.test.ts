import {expect} from 'chai'
import { FeatureFlagCache} from '../../src/main'
import { Constants } from '../testConstants'
import FakeTimers from '@sinonjs/fake-timers'
import { TestUtilities } from '../testUtilities'

describe('Feature Flag Initialization', () => {
    it('Initial flags passed are used.', () => {
        // Arrange.
        const flagName = 'test'
        const flagValue = true
        const initialFlags = new Map<string, boolean>()
        initialFlags.set(flagName, flagValue)

        const featureFlag = new FeatureFlagCache({
            initialFlagMap: initialFlags,
            flagLookupInterval: Constants.MaxTimeOut,
            flagLookUp: async () => {return new Map<string, boolean>()}
        })

        // Act.
        const isEnabled = featureFlag.isEnabled(flagName)

        // Assert.
        expect(isEnabled).to.be.true
    })
    it('Flag function is called when current values are requested.', async () => {
        // Arrange.
        let hitLookUpFunction = false
        const featureFlagCache = new FeatureFlagCache({
            flagLookupInterval: Constants.MaxTimeOut,
            flagLookUp: async () => {
                hitLookUpFunction = true
                return new Map<string, boolean>()
            }
        })

        // Act.
        await featureFlagCache.refreshFlags()

        // Assert.
        expect(hitLookUpFunction).to.be.true
    })
    it('Flag function is called after specified interval.', async () => {
        // Arrange.
        const clock = FakeTimers.install({
            toFake: ['setInterval']
        })
        const intervalTime = 2000
        let hitLookUpFunction = false
        new FeatureFlagCache({
            flagLookupInterval: intervalTime,
            flagLookUp: async () => {
                hitLookUpFunction = true
                return new Map<string, boolean>()
            }
        })

        // Act.
        await clock.tickAsync(intervalTime)

        // Assert.
        expect(hitLookUpFunction).to.be.true

        // Clean up.
        clock.uninstall()
    })
    it('Flag Cache is updated to reflect current values when refresh is called.', async () => {
        // Arrange.
        const flagName = 'flagName'
        const flagValue = true
        const newFeatureFlagMap = new Map<string, boolean>(
            [[flagName, flagValue]]
        )
        const flagCache = new FeatureFlagCache({
            flagLookupInterval: Constants.MaxTimeOut,
            flagLookUp: async () => {
                return newFeatureFlagMap
            },
            initialFlagMap: null,
        })

        // Act.
        await flagCache.refreshFlags()

        // Assert.
        const newFlagValue = flagCache.isEnabled(flagName)
        expect(newFlagValue).to.be.true
    })
    it('Flag Cache is updated to reflect current values when refresh is called.', async () => {
        // Arrange.
        const flagName = 'flagName'
        const flagValue = true
        const newFeatureFlagMap = new Map<string, boolean>(
            [[flagName, flagValue]]
        )
        const flagCache = new FeatureFlagCache({
            flagLookupInterval: Constants.MaxTimeOut,
            flagLookUp: async () => {
                return newFeatureFlagMap
            },
            initialFlagMap: null,
        })

        // Act.
        await flagCache.refreshFlags()

        // Assert.
        const newFlagValue = flagCache.isEnabled(flagName)
        expect(newFlagValue).to.be.true
    })
    it('Flag Cache keeps previous values when they are not returned by lookup funciton.', async () => {
        // Arrange.
        const flagName = 'flagName'
        const flagValue = true
        const initialFlagMap = new Map<string, boolean>(
            [[flagName, flagValue]]
        )
        const flagCache = new FeatureFlagCache({
            flagLookupInterval: Constants.MaxTimeOut,
            flagLookUp: async () => {
                return new Map<string, boolean>()
            },
            initialFlagMap: initialFlagMap,
        })

        // Act.
        await flagCache.refreshFlags()

        // Assert.
        const newFlagValue = flagCache.isEnabled(flagName)
        expect(newFlagValue).to.be.true
    })
    it('Lookup function is only invoked once if a lookup is already underway.', async () => {
        // Arrange.
        let invocationCount = 0
        const flagCache = new FeatureFlagCache({
            flagLookupInterval: Constants.MaxTimeOut,
            flagLookUp: async () => {
                invocationCount++

                // Registering the rest of the funtion for the next phase of the event loop.
                await TestUtilities.wait(0)
                return new Map<string, boolean>()
            },
        })

        // Act.
        const firstPromise = flagCache.refreshFlags()
        const secondPromise = flagCache.refreshFlags()
        await Promise.all([firstPromise, secondPromise])


        // Assert.
        expect(invocationCount).to.equal(1)
    })
  })