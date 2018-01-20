let { addressHash } = require('coins/src/common.js')

module.exports = function ({ perValidatorPerBlock }) {
  return {
    // this is a block handler, run it each time a block is made
    type: 'block',
    middleware (state, chainInfo) {
      for (let pubkey in chainInfo.validators) {
        // remove first byte because that just tells us the type
        let pubkeyBuf = Buffer.from(pubkey, 'hex').slice(1)
        let address = addressHash(pubkeyBuf)

        // add to this validator's address
        if (!state.accounts[address]) {
          state.accounts[address] = {
            balance: 0,
            sequence: 0
          }
        }
        state.accounts[address].balance += perValidatorPerBlock
      }
    }
  }
}
