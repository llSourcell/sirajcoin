let lotion = require('lotion')
let coins = require('coins')
let CommunityGrowth = require('./community-growth.js')
let ValidatorReward = require('./validator-reward.js')

const oneSirajcoin = 1e8

module.exports = function (opts = {}) {
  let app = lotion({
    // default options
    p2pPort: 46656,
    tendermintPort: 46657,

    // inherit properties from `opts`
    ...opts
  })

  // create cryptocurrency
  app.use(coins({
    handlers: {
      communityGrowth: CommunityGrowth({
        oraclePubkey: '031ae24d50f453b0f2f961382985bf527093d725f45bcc12c9a82c53e6ae990065',
        foundersAddress: 'siraj',
        treasuryPercent: 15,
        foundersPercent: 10
      })
    }
  }))

  // enforce fee rules
  app.use(function (state, tx) {
    // no fees for communityGrowth grants
    if (tx.from[0].type === 'communityGrowth') return

    if (tx.to[0].type !== 'fee') {
      throw Error('First output must pay fee')
    }
    if (tx.to[0].amount !== 0.01 * oneSirajcoin) {
      throw Error('Fee must be 0.01 SRJ')
    }
  })

  // pay rewards to validators
  app.use(ValidatorReward({
    perValidatorPerBlock: 0.0016 * oneSirajcoin
  }))

  let lotionPort = opts.lotionPort || 3000
  return app.listen(lotionPort)
}
