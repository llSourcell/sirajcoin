#!/usr/bin/env node

const Wallet = require("../lib/Wallet");
const Credentials = require("../lib/Credentials");
const { getClient } = require("../lib/client");

let argv = process.argv.slice(2);

if (argv.length === 0) {
  console.log(`Usage:

  sirajcoin balance
    Gets your wallet balance and address

  sirajcoin send <address> <amount>
    Sends coins from your wallet to the given address`);
  process.exit(1);
}

async function main() {
  const credentials = await Credentials.fromFile().catch(() => {
    return Credentials.generate();
  });
  const client = await getClient();
  const wallet = new Wallet(client, credentials);

  const command = argv[0];
  if (command === "balance") {
    const address = await wallet.getAddress();
    const balance = await wallet.getBalance();
    console.log(`your address: ${address}`);
    console.log(`your balance: ${balance / 1e8} SRJ`);
    process.exit();
  } else if (command === "send") {
    const recipientAddress = argv[1];
    const amountToSend = parseInt(argv[2]) * 1e8;
    await wallet.console.log("done", res);
    process.exit();
  } else {
    console.log(`Unrecognized command: ${command}`);
  }
}

main().catch(err => console.error(err.stack));
