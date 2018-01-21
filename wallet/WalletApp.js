const { h, Component } = require("preact");
const LoadingIndicator = require("./components/LoadingIndicator");
const Wallet = require("../lib/Wallet");
const Credentials = require("../lib/Credentials");
const { getClient } = require("../lib/client");

class WalletApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      balance: 0,
      address: null
    };
  }

  async componentDidMount() {
    const [client, credentials] = await Promise.all([
      getClient(),
      Credentials.fromFile()
    ]);

    this.wallet = new Wallet(client, credentials);
    const balance = await this.wallet.getBalance();
    const address = this.wallet.getAddress();
    this.setState({
      isLoading: false,
      balance,
      address
    });
  }

  render(props, { isLoading, balance, address }) {
    return h(
      "div",
      { style: styles.container },
      isLoading
        ? h("div", {}, [
            h(LoadingIndicator, {
              color: "#1481ff",
              backgroundColor: "#1481ff"
            })
          ])
        : h("div", {}, [
            h("span", { style: styles.title }, "Balance"),
            h("h1", { style: styles.balance }, `${balance / 1e8} SRJ`),
            h("span", { style: styles.title }, "Address"),
            h("h3", { style: styles.balance }, address)
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
  title: {
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "3px",
    display: "block",
    margin: "20px auto",
    textAlign: "center"
  },
  balance: {
    fontWeight: "100",
    textAlign: "center",
    margin: "0px auto"
  }
};

module.exports = WalletApp;
