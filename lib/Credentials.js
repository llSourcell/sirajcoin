const path = require("path");
const crypto = require("crypto");
const secp = require("secp256k1");
const coins = require("coins");
const mkdirp = require("mkdirp");
const { readFile, writeFile } = require("./utils");

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

Credentials.generate = async function(fileName = defaultKeyFile) {
  const privateKey = crypto.randomBytes(32);
  const keys = [{ private: privateKey.toString("hex") }];
  const keysJson = JSON.stringify(keys, null, " ".repeat(2));
  mkdirp(path.dirname(fileName));
  await writeFile(fileName, keysJson, "utf8");
  return new Credentials(privateKey);
};

module.exports = Credentials;
