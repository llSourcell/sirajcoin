let secp = require('secp256k1')
let coins = require('coins')
let { createHash, randomBytes } = require('crypto')

module.exports = function(seed, client) {
  if (!seed) {
    seed = randomBytes(32).toString('hex')
  }
  let creds = {}
  creds.priv = createHash('sha256').update(seed).digest()
  creds.pub = secp.publicKeyCreate(creds.priv)
  creds.address = coins.ed25519Account.getAddress({ pubkey: creds.pub })

  return {
    address: creds.address,
    priv: creds.priv,
    pub: creds.pub,
    getBalance: async function() {
      let state = await client.getState()
      if (!state.accounts[creds.address]) {
        return 0
      }
      let balance = state.accounts[creds.address].balance
      return balance
    },
    send: async function(address, amount) {
      let state = await client.getState()
      let feeAmount = 0.01 * 1e8
      let tx = {
        from: {
          amount: amount + feeAmount,
          sequence: state.accounts[creds.address].sequence,
          pubkey: creds.pub
        },
        to: [{ type: 'fee', amount: feeAmount }, { amount, address }]
      }

      let sigHash = coins.getSigHash(tx)
      tx.from.signature = secp.sign(sigHash, creds.priv).signature
      return await client.send(tx)
    }
  }
}
