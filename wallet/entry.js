const { h, render } = require("preact");
const WalletApp = require("./WalletApp");

const node = document.createElement("div");
document.body.appendChild(node);

render(h(WalletApp, {}), node);
