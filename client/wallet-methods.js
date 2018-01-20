const secp = require('secp256k1') // eslint-disable-line import/no-extraneous-dependencies
const coins = require('coins')
const { randomBytes } = require('crypto')

module.exports = (priv, client) => {
  if (!Buffer.isBuffer(priv) || priv.length !== 32) {
    throw Error('Private key must be a 32-byte buffer')
  }

  const creds = {}
  creds.priv = priv
  creds.pub = secp.publicKeyCreate(creds.priv)
  creds.address = coins.secp256k1Account.getAddress({ pubkey: creds.pub })

  return {
    address: creds.address,
    priv: creds.priv,
    pub: creds.pub,
    async getBalance() {
      const state = await client.getState()
      if (!state.accounts[creds.address]) {
        return 0
      }
      // const balance = state.accounts[creds.address].balance
      const { balance } = state.accounts[creds.address]
      return balance
    },
    async send(address, amount) {
      const state = await client.getState()
      const feeAmount = 0.01 * 1e8
      const tx = {
        from: {
          amount: amount + feeAmount,
          sequence: state.accounts[creds.address].sequence,
          pubkey: creds.pub,
        },
        to: [{ type: 'fee', amount: feeAmount }, { amount, address }],
      }

      const sigHash = coins.getSigHash(tx)
      tx.from.signature = secp.sign(sigHash, creds.priv).signature
      // refactor, remove redundant return await
      // eslint-disable-next-line no-return-await
      return await client.send(tx)
    },
  }
}
