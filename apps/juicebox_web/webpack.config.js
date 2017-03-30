var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: path.join(__dirname, 'assets', 'js', 'index.js'),
    vendor: ['react', 'react-dom']
  },

  output: {
    path: path.join(__dirname, 'priv', 'static'),
    filename: "./js/bundle.js"
  },

  module: {
    loaders: [{
      //test: path.join(__dirname, "web", "static", "js"),
      test: /\.jsx?$/i,
      exclude: path.join(__dirname, 'node_modules'),
      loader: 'babel-loader'
    }, {
      test: /\.scss$/,
      loaders: [
        "style-loader",
        "css-loader?modules&importLoaders=1&localIdentName=[name]_[local]__[hash:base64:5]",
        "sass-loader"
      ]
    }, {
      // inline base64 URLs for <=8k images, direct URLs for the rest]
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192&name=./images/[hash].[ext]'
    }, {
      test: /\.(svg)$/,
      loader: `file?name=/images/[hash].[ext]`,
    }]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: './js/vendor.bundle.js'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: process.env.NODE_ENV !== 'production',
      __ROOTPATH__: JSON.stringify(process.env.ROOT_PATH || '/'),
    })
  ],

  devtool: 'source-map'
};
