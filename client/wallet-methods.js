let secp = require('secp256k1')
let coins = require('coins')
let { randomBytes } = require('crypto')

module.exports = function(priv, client) {
  if (!Buffer.isBuffer(priv) || priv.length !== 32) {
    throw Error('Private key must be a 32-byte buffer')
  }

  let creds = {}
  creds.priv = priv
  creds.pub = secp.publicKeyCreate(creds.priv)
  creds.address = coins.secp256k1Account.getAddress({ pubkey: creds.pub })

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
