const { ipcRenderer } = require("electron");
const { h, Component } = require("preact");
const LoadingIndicator = require("./components/LoadingIndicator");

class WalletApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      balance: null,
      address: null,
      sendAddress: null,
      sendAmount: null
    };
    ipcRenderer.on("balance", (_, balance) => {
      this.setState({ balance });
    });
    ipcRenderer.on("address", (_, address) => {
      this.setState({ address });
    });
    ipcRenderer.on("send", (_, success) => {
      this.setState({ sending: false });
      if (success) {
        alert("Transaction completed.");
      } else {
        alert("Could not complete transaction.");
      }
    });
  }

  async componentDidMount() {
    ipcRenderer.send("getBalance");
    ipcRenderer.send("getAddress");
  }

  handleOnSend() {
    this.setState({ sending: true });
    ipcRenderer.send("send", this.state.sendAddress, this.state.sendAmount);
  }

  render(props, { sending, balance, address, sendAmount, sendAddress }) {
    return h(
      "div",
      { style: styles.container },
      h("div", { style: styles.content }, [
        h("div", { style: styles.balanceContainer }, [
          h("span", { style: styles.title }, "Balance"),
          balance !== null
            ? h("h1", { style: styles.balance }, `${balance / 1e8} SRJ`)
            : h("div", {}, [
                h(LoadingIndicator, {
                  color: "#1481ff",
                  backgroundColor: "#1481ff",
                  style: {
                    display: "block",
                    margin: "0 auto"
                  }
                })
              ])
        ]),
        h("div", { style: styles.mainContainer }, [
          h("div", { style: styles.receiveContainer }, [
            h("span", { style: styles.title }, "Receive address"),
            h("span", { type: "text", style: styles.address }, address)
          ]),
          h("div", {}, [
            h("span", { style: styles.title }, "Send"),
            h("div", { style: { display: "flex", flexDirection: "column" } }, [
              h("div", { style: { display: "flex" } }, [
                h("input", {
                  type: "number",
                  style: styles.amountInput,
                  placeholder: "Amount",
                  value: sendAmount,
                  onChange: e => {
                    this.setState({ sendAmount: e.target.value | 0 });
                  }
                }),
                h("input", {
                  style: styles.addressInput,
                  placeholder: "Address",
                  value: sendAddress,
                  onChange: e => {
                    this.setState({ sendAddress: e.target.value });
                  }
                })
              ]),
              h(
                "button",
                {
                  style: styles.sendBtn,
                  onClick: () => this.handleOnSend()
                },
                "Send"
              )
            ])
          ])
        ]),
        sending
          ? h(
              "div",
              {
                style: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }
              },
              [
                h("h2", { style: styles.title }, "Sending"),
                h(LoadingIndicator, {
                  color: "#1481ff",
                  backgroundColor: "#1481ff"
                })
              ]
            )
          : null
      ])
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#181b21",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    color: "rgba(255, 255, 255, 0.75)",
    fontFamily: "Lato, Helvetica Neue, Arial, sans-serif",
    fontWeight: "200",
    borderSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    display: "flex",
    height: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  title: {
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "3px",
    display: "block",
    margin: "10px auto",
    textAlign: "center"
  },
  balanceContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "20px"
  },
  balance: {
    fontWeight: "100",
    textAlign: "center",
    margin: "0px auto",
    color: "white",
    textShadow: "0px 0px 10px #00bfff"
  },
  receiveContainer: {
    padding: "20px"
  },
  address: {
    fontFamily: "Consolas, serif",
    fontSize: "14px",
    fontWeight: "200",
    textAlign: "center",
    margin: "0px auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "8px 12px",
    borderRadius: "5px",
    color: "black",
    border: "none",
    outline: "none",
    letterSpacing: "1px",
    display: "block"
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column"
  },
  sendBtn: {
    display: "block",
    fontFamily: "Lato, Helvetica Neue, Arial, sans-serif",
    fontWeight: "900",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "1px",
    backgroundColor: "#02c7ff",
    border: "none",
    color: "white",
    width: "100%",
    padding: "10px 20px",
    outline: "none",
    cursor: "pointer"
  },
  addressInput: {
    flex: 1,
    fontFamily: "Consolas, serif",
    fontSize: "14px",
    fontWeight: "200",
    textAlign: "center",
    margin: "0px auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "8px 12px",
    borderRadius: "0px",
    color: "black",
    border: "none",
    outline: "none",
    letterSpacing: "1px",
    display: "block",
    borderLeft: "2px solid white"
  },
  amountInput: {
    width: "100px",
    fontFamily: "Consolas, serif",
    fontSize: "14px",
    fontWeight: "200",
    textAlign: "center",
    margin: "0px auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "8px 12px",
    borderRadius: "0px",
    color: "black",
    border: "none",
    outline: "none",
    letterSpacing: "1px",
    display: "block"
  },
  seperator: {
    width: "75%",
    margin: "5px auto",
    border: "none",
    borderBottom: "1px solid rgba(255, 255, 255, 1)"
  }
};

module.exports = WalletApp;
