const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

// This class is responsible for setting up the GUI wallet using electron.
class SirajcoinWallet {
  constructor() {
    this.window = null;
    this.handleClose = this.handleClose.bind(this);
    this.handleReady = this.handleReady.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
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
    const window = new BrowserWindow({ width: 800, height: 600 });

    if (process.env.NODE_ENV === "production") {
      winow.loadURL(
        url.format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true
        })
      );
    } else {
      window.loadURL("http://localhost:3000");
      // Open the DevTools.
      window.webContents.openDevTools();
    }
    return window;
  }
}

const sirajcoinWallet = new SirajcoinWallet();
sirajcoinWallet.start();
