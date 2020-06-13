const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IgnorePlugin = require('webpack').IgnorePlugin;

module.exports = {
	entry: './src/main.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle-[hash].js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	devServer: {
		contentBase: 'dist',
		compress: true,
		port: 3000,
	},
	module: {
		rules: [
			// {
			// 	test: /\.ts$/,
			// 	// test: /.+(?<!\.test)\.ts$/,
			// 	enforce: 'pre',
			// 	loader: 'tslint-loader',
			// 	exclude: /\.test\.ts/,
			// 	options: {
			// 		/* Loader options go here */
			// 	},
			// },
			// {
			// 	test: /\.test\.ts/,
			// 	enforce: 'pre',
			// 	loader: 'ts-loader',
			// 	options: {
			// 		configFile: 'tsconfig.test.json'
			// 	}
			// },
			{
<<<<<<< Updated upstream
				test: /\.ts?$/,
				// test: /^(?!.*\.test\.ts$).*\.ts$/,
				// test: /^\/(?!node_modules).*\/.*\/test\/.*\.ts$/,
				enforce: 'pre',
				loader: 'tslint-loader',
				options: {
					/* Loader options go here */
				},
			},
			{
				// test: /\.tsx?$/,
				loader: 'ts-loader',
				test: function(modulePath) {
					if (modulePath.endsWith('.ts') || modulePath.endsWith('.tsx')) {
						console.log([/.+(?<!\.test)\.tsx?$/.test(modulePath), modulePath]);
					}
				
					
					return (modulePath.endsWith('.ts') || modulePath.endsWith('.tsx')) && !modulePath.endsWith('test.ts');
				},
=======
				// test: /.+(?<!\.test)\.tsx?$/,
				test: /\.tsx?$/,
				// test: /.+(?<!\.test)\.tsx?$/,
				loader: 'ts-loader',
				exclude: [/\.test\.ts/],
>>>>>>> Stashed changes
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: process.env.NODE_ENV === 'development',
						},
					},
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
				loader: 'file-loader?name=assets/fonts/[name].[ext]',
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{
				from: 'src/index.html',
				to: './index.html',
			},
			{
				from: 'src/assets/**/*',
				to: './assets',
				transformPath(targetPath, absolutePath) {
					return targetPath.replace('src/assets', '');
				},
			},
		]),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
			},
		}),
		new MiniCssExtractPlugin({
			filename: 'style-[hash].css',
			allChunks: true,
		}),
<<<<<<< Updated upstream
		// new IgnorePlugin({
		// 	resourceRegExp: /\.test\.ts$/,
		// 	// checkResource(resource, context) {
		// 	// 	console.log(resource, context);

		// 	// 	// do something with resource
		// 	// 	return true;
		// 	// }
		// })
=======
		new IgnorePlugin({
			checkResource(resource) {
				console.log(resource);
				
				// do something with resource
				return true | false;
			}
		})
>>>>>>> Stashed changes
	],
};
