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
      loader: 'babel'
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }, {
      // inline base64 URLs for <=8k images, direct URLs for the rest]
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192&name=./images/[hash].[ext]'
    }]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"./js/vendor.bundle.js"),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],

  devtool: 'source-map'
};
