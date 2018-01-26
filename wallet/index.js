const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const Credentials = require("../lib/Credentials");
const Wallet = require("../lib/Wallet");
const { getClient } = require("../lib/client");

// This class is responsible for setting up the GUI wallet using electron.
class SirajcoinWallet {
  constructor() {
    this.window = null;
    this.handleClose = this.handleClose.bind(this);
    this.handleReady = this.handleReady.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.wallet$ = Promise.all([getClient(), Credentials.fromFile()]).then(
      ([client, credentials]) => {
        return new Wallet(client, credentials);
      }
    );

    ipcMain.on("getBalance", async event => {
      const wallet = await this.wallet$;
      const balance = await wallet.getBalance();
      event.sender.send("balance", balance);
    });

    ipcMain.on("getAddress", async event => {
      const wallet = await this.wallet$;
      const address = await wallet.getAddress();
      event.sender.send("address", address);
    });

    ipcMain.on("send", async (event, address, amount) => {
      const wallet = await this.wallet$;
      try {
        //await wallet.send(address, amount);
        await new Promise(resolve => setTimeout(resolve, 2000));
        event.sender.send("send", true);
      } catch (e) {
        event.sender.send("send", false);
      }
      //console.log(arg1, arg2);
      // TODO send sirajcoin
      //const wallet = await this.wallet$;
    });
  }

  handleClose() {
    this.window = null;
  }

  handleReady() {
    this.window = this.createWindow();
  }

  handleActivate() {
    if (!this.window) {
      this.window = this.createWindow();
    }
  }

  handleAllClosed() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  start() {
    app.on("ready", this.handleReady);
    app.on("activate", this.handleActivate);
    app.on("window-all-closed", this.handleAllClosed);
  }

  createWindow() {
    // Create the browser window.
    const window = new BrowserWindow({ width: 500, height: 400 });
    window.setTitle("Sirajcoin Wallet");
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
      })
    );
    //window.loadURL("http://localhost:8080");

    if (process.env.NODE_ENV !== "production") {
      window.webContents.openDevTools();
    }

    return window;
  }
}

const sirajcoinWallet = new SirajcoinWallet();
sirajcoinWallet.start();
