import webpack from 'webpack';
import path from 'path';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HashPlugin from 'hash-webpack-plugin';
import WebpackAutoInject from 'webpack-auto-inject-version';

const isDeveloping = process.env.NODE_ENV !== 'production';

const staticBuildPath = path.resolve('./build');

let jsFileName, cssFileName, devToolSourceMap, publicPath, AppConfig,
	prodPluginsConfig = [], devPluginsConfig = [], styleLoaderConfig;

if (isDeveloping) {
	//configuration for development
	styleLoaderConfig = [ 'style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap', 'postcss-loader?sourceMap' ];
	publicPath = 'http://127.0.0.1:9000/build/';
	jsFileName = 'js/[name].js';
	cssFileName = 'css/[name].css';
	devToolSourceMap = 'cheap-module-source-map';
	devPluginsConfig = [
		new webpack.HotModuleReplacementPlugin()
	];
	AppConfig = require('./config/dev');
} else {
	//configuration for production
	styleLoaderConfig = ExtractTextPlugin.extract({
		fallback: 'style-loader',
		use: [
			{
				loader: 'css-loader',
				options: {
					sourceMap: true
				}
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true
				}
			},
			{
				loader: 'postcss-loader',
				options: {
					sourceMap: true
				}
			}
		]
	});
	publicPath = '/build/';
	jsFileName = 'js/[name]-[hash].js';
	cssFileName = 'css/[name]-[hash].css';
	devToolSourceMap = 'none';
	prodPluginsConfig = [
		new ExtractTextPlugin({
			filename: cssFileName
		}),
		new HashPlugin({ path: staticBuildPath, fileName: 'hash.txt' }),
		new webpack.optimize.UglifyJsPlugin({
			comments: false,
			sourceMap: false,
			compress: {
				warnings: false,
				drop_console: true
			},
		})
	];
	AppConfig = require('./config/prod');
}

const config = {
	entry: {
		front: isDeveloping ? [
			'babel-polyfill',
			'whatwg-fetch',
			'react-hot-loader/patch',
			'webpack-dev-server/client?http://127.0.0.1:9000',
			'webpack/hot/only-dev-server',
			'./src/front.js'
		] : [
			'babel-polyfill',
			'whatwg-fetch',
			'./src/front.js'
		]
	},
	output: {
		path: staticBuildPath,
		publicPath: publicPath,
		filename: jsFileName,
		chunkFilename: jsFileName
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(scss|css)$/,
				use: styleLoaderConfig
			},
			{
				test: /\.less$/,
				use: [
					{loader: 'style-loader'},
					{loader: 'css-loader'},
					{loader: 'less-loader'}
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'file-loader',
				options: {
					outputPath: 'files/',
					publicPath: publicPath
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
				loader: 'file-loader',
				options: {
					outputPath: 'files/',
					publicPath: publicPath
				}
			},
			{
				test: /\.json($|\?)/,
				use: 'json-loader'
			}
		]
	},
	devServer: {
		host: '127.0.0.1',
		port: 9000,
		hot: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
		},
		watchOptions: {
			ignored: /node_modules/
		}
	},
	devtool: devToolSourceMap,
	resolve: {
		alias: {
			react: path.resolve('./node_modules/react'),
		},
	},
	plugins: [
		new WebpackAutoInject({
			SILENT: true,
			components: {
				AutoIncreaseVersion: true
			},
			componentsOptions: {
				AutoIncreaseVersion: {
					runInWatchMode: false
				},
				InjectAsComment: {
					tag: 'Version: {version} - {date}',
					dateFormat: 'yyyy-mm-dd hh:MM:ss TT'
				}
			}
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'AppConfig': JSON.stringify(AppConfig)
		}),
		new LodashModuleReplacementPlugin(),
		new BundleAnalyzerPlugin({analyzerPort: 8889}),
		...devPluginsConfig,
		...prodPluginsConfig
	]
};

module.exports = config;