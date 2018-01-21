const { addressHash } = require('coins/src/common.js')

module.exports = ({ perValidatorPerBlock }) => ({
  // this is a block handler, run it each time a block is made
  type: 'block',
  middleware(state, chainInfo) {
    // @TODO Refactor the for in instead of disabling eslint rules
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const pubkey in chainInfo.validators) {
      // remove first byte because that just tells us the type
      const pubkeyBuf = Buffer.from(pubkey, 'hex').slice(1)
      const address = addressHash(pubkeyBuf)

      // add to this validator's address
      if (!state.accounts[address]) {
        state.accounts[address] = {
          balance: 0,
          sequence: 0,
        }
      }
      state.accounts[address].balance += perValidatorPerBlock
    }
  },
})
