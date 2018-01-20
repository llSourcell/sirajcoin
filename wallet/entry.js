import React from "react";
import { render } from "react-dom";
import WalletApp from "./WalletApp";

const node = document.createElement("div");
document.body.appendChild(node);

render(<WalletApp />, node);
