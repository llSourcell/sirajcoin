let secp = require('secp256k1')
let coins = require('coins')
let axios = require('axios')
let { createHash, randomBytes } = require('crypto')

module.exports = function(seed) {
  if (!seed) {
    seed = randomBytes(32).toString('hex')
  }
  let creds = {}
  creds.priv = createHash('sha256').update(seed).digest()
  creds.pub = secp.publicKeyCreate(creds.priv)
  console.log(creds.pub.toString('hex'))
  creds.address = coins.pubkeyCoin.getAddress({ pubkey: creds.pub })

  return {
    address: creds.address,
    priv: creds.priv,
    pub: creds.pub,
    getBalance: async function() {
      let state = await getState()
      if (!state.accounts[creds.address]) {
        return 0
      }
      let balance = state.accounts[creds.address].balance
      return balance
    },
    send: async function(address, amount) {
      let state = await getState()
      let feeAmount = 0.01 * 1e8
      let tx = {
        from: {
          amount: amount + feeAmount,
          sequence: state.accounts[creds.address].sequence,
          pubkey: creds.pub
        },
        to: [
          { type: 'fee', amount: feeAmount },
          { amount, address }
        ]
      }

      let sigHash = coins.getSigHash(tx)
      tx.from.signature = secp.sign(sigHash, creds.priv).signature
      return await sendTx(tx)
    },
    grant (id, address, amount) {
      let tx = {
        from: {
          type: 'communityGrowth',
          amount: 12.5 * 1e8,
          id
        },
        to: [
          {
            address,
            amount: 10 * 1e8
          },
          {
            address: 'treasury',
            amount: 1.5 * 1e8
          },
          {
            address: 'siraj',
            amount: 1 * 1e8
          }
        ]
      }

      let sigHash = coins.getSigHash(tx)
      tx.from.signature = secp.sign(sigHash, creds.priv).signature
      return sendTx(tx)
    }
  }
}

function sendTx(tx) {
  return axios.post('http://localhost:3000/txs', tx)
}

function getState() {
  return axios.get('http://localhost:3000/state').then(res => res.data)
}
