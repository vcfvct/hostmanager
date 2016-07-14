var webpack = require("webpack");

module.exports = {
	entry: {
		finraHost: __dirname + '/public/js/index.js'

	},
	devtool: 'source-map',
	output: {
		path: __dirname + '/public/dist',
		filename: '[name].bundle.js'
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'jshint-loader'

			}
		],
		loaders: [
			{test: /\.js$/, loader: 'babel', exclude: /node_modules/},
			{test: /\.css$/, loaders: ["style", "css"]},
			{test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?[a-z0-9=\.]+)?$/, loader: 'url'},
			{
				// HTML LOADER
				// Reference: https://github.com/webpack/raw-loader
				// Allow loading html through js
				test: /\.html$/,
				loader: 'raw'
			}
		]
	},
	plugins: [
		//enable jquery globally so that the jQuery plugin can be loaded
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	],
	devServer: {
		proxy: {
			//route dev-server which is on 8080 requests to the 3000 where backend server runs
			'/api/*': {
				target: 'http://localhost:3000',
				secure: false
			}
		}
	}
};