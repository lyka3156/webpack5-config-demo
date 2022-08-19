// 引入公共配置
const baseConfig = require('./webpack.base.config.js');
// 合并webpack配置
const { merge } = require('webpack-merge');
// 压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// 压缩js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(baseConfig, {
	// 生产模式
	mode: 'production',

	// 生产不需要生成source map
	devtool: 'none',

	// 优化 (生产环境需要做优化,压缩)
	optimization: {
		minimizer: [
			// 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
			// `...`,
			// 自定义配置压缩js的规则,不使用webpack5自带的压缩js规则
			// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
			new TerserPlugin({
				terserOptions: {
					// parallel: true, // 启用/禁用多进程并发运行功能
					// cache: true,
					compress: {
						warnings: true, // 是否去除warnig
						// drop_console: process.env.BUILD_ENV === 'prod', // 是否去除console
					},
					// output: {
					// 	comments: false,
					// 	// comments: /Build in/i
					// },
					safari10: true,
				},
				extractComments: false, // 启用/禁用剥离注释功能
			}),
			// 启动css压缩  一般在生产模式配置,开发环境不配置,可以通过环境来配置是否压缩css
			new CssMinimizerPlugin(),
		],
		// 如果还想在开发环境下启用 CSS 优化，请将 optimization.minimize 设置为 true:
		// minimize: true,
	},
});
