const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);
// HtmlWebpackPlugin帮助你创建html文件，并自动引入打包输出的bundles文件。支持html压缩。
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 该插件将CSS提取到单独的文件中。它会为每个chunk创造一个css文件。需配合loader一起使用
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	// 入口文件
	entry: './src/index.js',

	// 开发模式打包     devlopment/production
	mode: 'development',

	// 打包输出
	output: {
		// 输出文件目录（将来所有资源输出的公共目录，包括css和静态文件等等）
		path: resolvePath('../dist'),
		// 输出文件名，默认main.js
		filename: 'js/[name][contenthash:8].js',
		// 所有资源引入公共路径前缀，一般用于生产环境，小心使用
		publicPath: '',
		// 非入口文件chunk的名称。所谓非入口即import动态导入形成的chunk或者optimization中的splitChunks提取的公共chunk
		// 它支持和 filename 一致的内置变量
		chunkFilename: '[name][contenthash:8].chunk.js',
		// 打包前清空输出目录，相当于clean-webpack-plugin插件的作用,webpack5新增。
		clean: true,
		// 当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到library   (自己写插件的时候用到)
		// library: {
		// 	// 整个库向外暴露的变量名
		// 	name: '[name]',
		// 	// 库暴露的方式
		// 	type: 'window',
		// },
	},
	// 模块匹配规则: 在这里为模块配置loader
	module: {
		rules: [
			{
				// 匹配所有的 css 文件
				test: /\.(css|less)$/i,
				use: [
					// 将 JS 字符串生成为 style 节点
					// 'style-loader',
					// MiniCssExtractPlugin.loader的作用就是把css-loader处理好的样式资源（js文件内），单独提取出来 成为css样式文件
					MiniCssExtractPlugin.loader, // 生产环境下使用，开发环境还是推荐使用style-loader
					// 将 CSS 转化成 CommonJS 模块
					'css-loader',
					// 使用 PostCSS 处理 CSS 的 loader, 里面可以配置 autoprefixer 添加 CSS 浏览器前缀
					'postcss-loader',
					// 将 Less 编译成 CSS
					'less-loader',
				],
			},
		],
	},

	// 插件
	plugins: [
		// 把打包后的资源文件，例如：js 或者 css 文件可以自动引入到 Html 中
		new HtmlWebpackPlugin({
			// 模板html地址
			template: resolvePath('../src/index.html'),
			// 输出后的html文件名
			filename: 'index.html',
		}),
		// 该插件将CSS提取到单独的文件中。它会为每个chunk创造一个css文件。需配合loader一起使用
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css',
			// chunkFilename: 'css/[name].[contenthash:8].css',
		}),
	],
};
