const lotion = require('lotion')
const coins = require('coins')
const CommunityGrowth = require('./community-growth.js')
const ValidatorReward = require('./validator-reward.js')
const config = require('../config.js')

const oneSirajcoin = 1e8

module.exports = (opts = {}) => {
  const app = lotion({
    // default options
    p2pPort: 46656,
    tendermintPort: 46657,
    genesis: require.resolve('../genesis.json'),
    peers: config.peers
      .map(addr => `${addr}:46656`),

    // inherit properties from `opts`
    ...opts,
  })

  // create cryptocurrency
  app.use(coins({
    handlers: {
      communityGrowth: CommunityGrowth({
        oraclePubkey: '03659ade07edb05a6474f0278bdc9fb706cd607b17c6c90aa7ef9a21e0b3606f88',
        foundersAddress: 'siraj',
        treasuryPercent: 15,
        foundersPercent: 10,
      }),
    },
  }))

  // enforce fee rules
  app.use((state, tx) => {
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
    perValidatorPerBlock: 0.0016 * oneSirajcoin,
  }))

  const lotionPort = opts.lotionPort || 3000
  return app.listen(lotionPort)
}
