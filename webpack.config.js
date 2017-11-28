const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const config = (env = {}) => {
	const isProduction = env.production === true;
	console.log('env', env)
	console.log('isProdcution', isProduction);

	return {
		entry: isProduction ? [
				'./client/index.js'
			]
			:
			[
				'react-hot-loader/patch',
				'webpack-hot-middleware/client',
				'./client/index.js'
			],
		output: {
			// path: path.resolve(__dirname, 'dist'),
			//ToDO - fix path
			path: path.resolve(__dirname, 'server/static'),
			filename: 'bundle.js',
			publicPath: '/static/'
		},
		devtool: (() => isProduction ? 'source-map' : 'inline-source-map')(),
		module: {
			rules: [
				{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", },
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.styl$/,
					use: [
						{
							loader: 'style-loader',
						},
						{
							loader: 'css-loader'
						},
						/* {
							 loader: 'postcss-loader',
							 options: {
								 sourceMap: 'inline',
							 }
						 },*/
						{
							loader: 'stylus-loader'
						}
					]
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					use: [
						'file-loader'
					]
				},
				{ test: /\.svg$/, exclude: /node_modules/, loader: "file-loader" }
			]
		},
		plugins: (() => {
			return ( !isProduction ?
				[
					new webpack.SourceMapDevToolPlugin({
						filename: '[name].js.map',
						exclude: ['vendor.js']
					}),

					new webpack.HotModuleReplacementPlugin(),
					// enable HMR globally

					new webpack.NamedModulesPlugin(),
					// prints more readable module names in the browser console on HMR updates
					new webpack.DefinePlugin({
						'process.env': {
							'NODE_ENV': JSON.stringify('development')
						}
					})
				]
				:
				[
					new UglifyJSPlugin({
						sourceMap: true,
					}),
					new webpack.DefinePlugin({
						'process.env': {
							'NODE_ENV': JSON.stringify('production')
						}
					})
				] )
		})()
	}
};

module.exports = config;