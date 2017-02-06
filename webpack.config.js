const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    "./app/app" // Your appʼs entry point
  ],
  devtool: process.env.WEBPACK_DEVTOOL || "source-map",
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ["babel?presets[]=es2015"]
      },
      {
        test: /\.(css|sass)$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }

    ]
  },
  devServer: {
      contentBase: "./build",
      noInfo: false, //  --no-info option
      hot: true,
      inline: true
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: './app/template.html'
    }),
    new webpack.ProvidePlugin({
      d3: 'd3',
      $: 'jquery'
    })
  ]
};
