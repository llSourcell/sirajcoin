const path = require("path");

const commonConfig = {
  entry: path.join(__dirname, "wallet/entry.js"),
  output: {
    filename: "app.bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: path.join(__dirname, "node_modules"),
        loader: "babel-loader",
        options: {
          presets: ["babel-preset-env", "babel-preset-react"]
        }
      }
    ]
  }
};

module.exports = commonConfig;
