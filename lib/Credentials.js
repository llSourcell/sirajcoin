const path = require("path");
const secp = require("secp256k1");
const coins = require("coins");
const { readFile } = require("./utils");

class Credentials {
  constructor(privateKey) {
    if (!Buffer.isBuffer(privateKey) || privateKey.length !== 32) {
      throw Error("Private key must be a 32-byte buffer");
    }
    this.privateKey = privateKey;
    this.publicKey = secp.publicKeyCreate(this.privateKey);
  }

  getPublicKey() {
    return this.publicKey;
  }
  getPrivateKey() {
    return this.privateKey;
  }
}
const HOME =
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const defaultKeyFile = path.join(HOME, ".sirajcoin/keys.json");

Credentials.fromFile = async function(fileName = defaultKeyFile) {
  const keysContent = await readFile(fileName, "utf8");
  const keys = JSON.parse(keysContent);
  const privateKeyHex = keys[0].private;
  const privateKey = Buffer.from(privateKeyHex, "hex");
  return new Credentials(privateKey);
};

module.exports = Credentials;
