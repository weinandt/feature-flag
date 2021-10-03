import {expect} from 'chai'
import { FeatureFlag} from '../../src/main'
import { Constants } from '../testConstants'

describe('Feature Flag Initialization', () => {
    it('Initial flags passed are used.', () => {
        // Arrange.
        const flagName = 'test'
        const flagValue = true
        const initialFlags = new Map<string, boolean>()
        initialFlags.set(flagName, flagValue)

        const featureFlag = new FeatureFlag({
            initialFlagMap: initialFlags,
            flagLookupInterval: Constants.MaxTimeOut,
            flagLookUp: async () => {return new Map<string, boolean>()}
        })

        // Act.
        const isEnabled = featureFlag.isEnabled(flagName)

        // Assert.
        expect(isEnabled).to.be.true
    })
  })