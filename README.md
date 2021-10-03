# Feature Flag
Simple feature flag library for node js.

## TODO:
1. Add a way to group flags by some value. For example, a group of users could have a value set for that group id.
1. Errors looking up a value are ignored. Should they be surfaced to the caller via a callback?
1. Unit test.
1. Add a timeout to the amount of time to spend looking up flags.
1. Make sure everything works in the browser.