var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/static/html/index.html',
  filename: 'index.html',
  inject: 'body'
});
module.exports = {
  entry: [
    './static/js/index.js'
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
  plugins: [HTMLWebpackPluginConfig]
};