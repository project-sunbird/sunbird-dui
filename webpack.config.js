var path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');

var plugins = [];

// plugins.push(new WebpackShellPlugin({
//  onBuildStart: ['echo "Starting"'],
//  onBuildEnd: ['./uploadFile.sh']
// }));

module.exports = {
  devtool: "source-map",
	entry: ["./index.js"],
  output: {
  	path: __dirname + "/dist", 
  	filename: "index_bundle.js", 
  	publicPath: '/dist/',
  	sourceMapFilename: "index_bundle.js.map"
  },
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /\.js$/, 
        exclude: /node_modules\/(?!@juspay)/, 
        loader: "babel-loader"
      },
    ]
  }
}

