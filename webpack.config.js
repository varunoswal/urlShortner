var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/static/html/index.html',
  filename: 'index.html',
  inject: 'body'
});
var ProdPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify("production")
});
module.exports = {
  entry: [
    './index.js'
  ],
  output: {
    path: __dirname + '/templates',
    filename: "index_bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  plugins: [HTMLWebpackPluginConfig, ProdPlugin]
};
