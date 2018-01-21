const { connect } = require("lotion");
const genesis = require("../genesis.json");
const config = require("../config.js");

async function getClient() {
  const nodes = config.peers.map(addr => `http://${addr}:46657`);
  return await connect(null, { genesis, nodes });
}

module.exports = {
  getClient
};
