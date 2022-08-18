const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);
// https://github.com/webpack/webpack/tree/main/examples/source-map

// html 模板插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 1）定义不同的打包类型
const allModes = [
	'eval',
	'eval-cheap-source-map',
	'eval-cheap-module-source-map',
	'eval-source-map',
	'cheap-source-map',
	'cheap-module-source-map',
	'inline-cheap-source-map',
	'inline-cheap-module-source-map',
	'source-map',
	'inline-source-map',
	'hidden-source-map',
	'nosources-source-map',
];

// 2）循环不同 SourceMap 模式，生成多个打包入口
module.exports = allModes.map((devtool) => ({
	// 开发模式
	mode: 'development',
	// 入口文件
	entry: './src/devtool.js',
	// 打包输出
	output: {
		// 输出文件目录（将来所有资源输出的公共目录，包括css和静态文件等等）
		path: resolvePath('../devtoolDist'),
		// 输出文件名，默认main.js
		filename: `js/${devtool}.js`,
		// 打包前清空输出目录，相当于clean-webpack-plugin插件的作用,webpack5新增。
		clean: true,
	},
	// source-map配置
	devtool,
	// 模块
	module: {
		rules: [
			{
				// 匹配js
				test: /.js$/,
				use: {
					// 使用babel-loader将高级js语法转换成浏览器支持的js
					loader: 'babel-loader',
				},
			},
		],
	},
	// 插件
	plugins: [
		//   3）输出到不同的页面
		new HtmlWebpackPlugin({
			template: './src/devtool.html',
			filename: `${devtool}.html`,
		}),
	],
	// 优化
	optimization: {
		// runtimeChunk作用是为了线上更新版本时，充分利用浏览器缓存，使用户感知的影响到最低。
		// https://blog.csdn.net/fy_java1995/article/details/110119934
		// runtimeChunk: true,
	},
}));
