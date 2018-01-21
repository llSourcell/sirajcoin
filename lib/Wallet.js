const coins = require("coins");
const secp = require("secp256k1");

class Wallet {
  constructor(client, credentials) {
    this.client = client;
    this.credentials = credentials;
  }

  async getBalance() {
    const state = await this.client.getState();
    const address = this.getAddress();
    if (address in state.accounts) {
      return state.accounts[address].balance;
    }
    return 0;
  }

  getAddress() {
    return coins.secp256k1Account.getAddress({
      pubkey: this.credentials.getPublicKey()
    });
  }

  async send(address, amount) {
    const state = await this.client.getState();
    const feeAmount = 0.01 * 1e8;
    const myAddress = this.getAddress();
    const publicKey = this.credentials.getPublicKey();
    const tx = {
      from: {
        amount: amount + feeAmount,
        sequence: state.accounts[myAddress].sequence,
        pubkey: publicKey
      },
      to: [{ type: "fee", amount: feeAmount }, { amount, address }]
    };

    const signedTransaction = this._signTransaction(tx);
    return await this.client.send(signedTransaction);
  }

  _signTransaction(tx) {
    const privateKey = this.credentials.getPrivateKey();
    const sigHash = coins.getSigHash(tx);
    const { signature } = secp.sign(sigHash, privateKey);

    return Object.assign({}, tx, {
      from: Object.assign({}, tx.from, {
        signature
      })
    });
  }
}

module.exports = Wallet;
