#!/usr/bin/env node

// TODO: make this better! if you're reading this,
// you should improve the wallet and send a pull request!

// createHash is not being used at the moment
const { /* createHash, */ randomBytes } = require('crypto')
const fs = require('fs')
const Wallet = require('../client/wallet-methods.js')
const { connect } = require('lotion')
const mkdirp = require('mkdirp').sync
const { dirname, join } = require('path')
const genesis = require('../genesis.json')
const config = require('../config.js')

const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const keyPath = join(HOME, '.sirajcoin/keys.json')

const argv = process.argv.slice(2)

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
    const privkeyContents = fs.readFileSync(keyPath, 'utf8')
    const privkeyHex = JSON.parse(privkeyContents)[0].private
    privkey = Buffer.from(privkeyHex, 'hex')
  } catch (err) {
    if (err.code !== 'ENOENT') throw err

    // no key, generate one
    const keys = [{ private: randomBytes(32).toString('hex') }]
    const keysJson = JSON.stringify(keys, null, '  ')
    mkdirp(dirname(keyPath))
    fs.writeFileSync(keyPath, keysJson, 'utf8')
    privkey = keys[0].private

    console.log(`Generated private key, saving to "${keyPath}"`)
  }

  const timeout = setTimeout(() => console.log('Connecting...'), 2000)

  const nodes = config.peers.map(addr => `ws://${addr}:46657`)

  const client = await connect(null, { genesis, nodes })
  const wallet = Wallet(privkey, client)

  // don't print "Connecting..." if we connect in less than 2s
  clearTimeout(timeout)

  // send
  if (argv.length === 3) {
    const recipientAddress = argv[1]
    const amountToSend = Number(argv[2]) * 1e8

    const res = await wallet
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
    console.log(`your address: ${wallet.address}`)
    console.log(`your balance: ${balance / 1e8} SRJ`)
    process.exit()
  }
}

main().catch(err => console.error(err.stack))
