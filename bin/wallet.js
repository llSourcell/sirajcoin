#!/usr/bin/env node

let { createHash } = require('crypto')
let coins = require('coins')
let secp = require('secp256k1')
let fs = require('fs')
let Wallet = require('../client/wallet-methods.js')
let argv = process.argv.slice(2)
let { connect } = require('lotion')
let genesis = require('../genesis.json')
let config = require('../config.json')

if (argv.length === 0) {
  console.log(`Usage:

  sirajcoin balance
    Gets your wallet balance and address

  sirajcoin send <address> <amount>
    Sends coins from your wallet to the given address`)
  process.exit(1)
}

async function main() {
  let client = await connect(null, { genesis, nodes: config.seeds })
  let privkeyContents = fs.readFileSync('privkey.json', 'utf8')
  let wallet = Wallet(JSON.parse(privkeyContents).priv_key.data)
  if (argv.length === 3) {
    let recipientAddress = argv[1]
    let amountToSend = Number(argv[2])

    wallet
      .send(recipientAddress, amountToSend)
      .then(function(res) {
        console.log('done', res.data.result)
        process.exit()
      })
      .catch(err => console.error(err.stack))
  }

  // get balance
  if (argv.length === 1 && argv[0] === 'balance') {
    wallet.getBalance().then(balance => {
      console.log('your address: ' + wallet.address)
      console.log('your balance: ' + balance)
      process.exit()
    })
  }
}

main()
