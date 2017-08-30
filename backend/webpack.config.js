var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
/*webpack solo para el server*/
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './server.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'backend.js'
  },
  externals: nodeModules,
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    /*new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })*/
  ],
  devtool: 'sourcemap'
}