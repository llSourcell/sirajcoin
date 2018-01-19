#!/usr/bin/env node

let runNode = require('../app')

console.log('Starting node...')

runNode({
  genesis: 'genesis.json',
  keys: 'privkey.json',
  lotionPort: 3000,
  logTendermint: process.env.LOG_TM
}).then(({ tendermintPort }) => {
  console.log('Node successfully started')
  console.log(`Lotion API listening on http://localhost:3000`)
  console.log(`Tendermint API listening on http://localhost:${tendermintPort}`)
}).catch((err) => {
  console.error(err.stack)
})
