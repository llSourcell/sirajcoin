let lotion = require('lotion')
let coins = require('coins')
let CommunityGrowth = require('./community-growth.js')

module.exports = function (opts = {}) {
  let app = lotion({
    // default options
    p2pPort: 46656,
    tendermintPort: 46657,

    // inherit properties from `opts`
    ...opts
  })
  //
  // let communityGrowth = CommunityGrowth({
  //   oraclePubkey: '',
  //   foundersAddress: '',
  //   treasuryPercent: 15,
  //   foundersPercent: 10
  // })
  //
  // app.use(coins({
  //   modules: { communityGrowth }
  // }))

  let lotionPort = opts.lotionPort || 3000
  return app.listen(lotionPort)
}
