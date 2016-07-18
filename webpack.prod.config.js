var devConf = require('./webpack.config.js');
var webpack = require("webpack");

devConf.devtool = 'eval';
var prodPlugins = [
	new webpack.optimize.DedupePlugin(),
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
];
devConf.plugins.push(...prodPlugins);

module.exports = devConf;