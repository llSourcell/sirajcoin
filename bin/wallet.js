#!/usr/bin/env node

// TODO: make this better! if you're reading this,
// you should improve the wallet and send a pull request!

let { createHash, randomBytes } = require('crypto')
let fs = require('fs')
let Wallet = require('../client/wallet-methods.js')
let { connect } = require('lotion')
let mkdirp = require('mkdirp').sync
let { dirname, join } = require('path')
let genesis = require('../genesis.json')
let config = require('../config.json')

const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const keyPath = join(HOME, '.sirajcoin/keys.json')

let argv = process.argv.slice(2)

if (argv.length === 0) {
  console.log(`Usage:

  sirajcoin balance
    Gets your wallet balance and address

  sirajcoin send <address> <amount>
    Sends coins from your wallet to the given address`)
  process.exit(1)
}

async function main() {
  let privkey

  try {
    // load existing key
    let privkeyContents = fs.readFileSync(keyPath, 'utf8')
    let privkeyHex = JSON.parse(privkeyContents)[0].private
    privkey = Buffer.from(privkeyHex, 'hex')

  } catch (err) {
    if (err.code !== 'ENOENT') throw err

    // no key, generate one
    let keys = [ { private: randomBytes(32).toString('hex') } ]
    let keysJson = JSON.stringify(keys, null, '  ')
    mkdirp(dirname(keyPath))
    fs.writeFileSync(keyPath, keysJson, 'utf8')
    privkey = keys[0].private

    console.log(`Generated private key, saving to "${keyPath}"`)
  }

  let timeout = setTimeout(() => console.log('Connecting...'), 2000)

  let nodes = config.peers.map((addr) => `ws://${addr}:46657`)

  let client = await connect(null, { genesis, nodes })
  let wallet = Wallet(privkey, client)

  // don't print "Connecting..." if we connect in less than 2s
  clearTimeout(timeout)

  // send
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

main().catch((err) => console.error(err.stack))
