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
let config = require('../config.js')

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
    privkey = Buffer.from(keys[0].private, 'hex')

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
    let amountToSend = Number(argv[2]) * 1e8

    let res = await wallet
      .send(recipientAddress, amountToSend)
    console.log('done', res)
    process.exit()
  }

  // get balance
  if (argv.length === 1 && argv[0] === 'balance') {
    let balance
    try {
      balance = await wallet.getBalance()
    } catch (err) {
      if (err.message === 'invalid state from full node') {
        // retry if we get this error
        balance = await wallet.getBalance()
      } else {
        throw err
      }
    }
    console.log('your address: ' + wallet.address)
    console.log(`your balance: ${balance / 1e8} SRJ`)
    process.exit()
  }
}

main().catch((err) => console.error(err.stack))
