const path = require("path");
const commonConfig = require("./webpack.common");
const merge = require("webpack-merge");

const config = merge(commonConfig, {
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, "assets")
  }
});
module.exports = config;
