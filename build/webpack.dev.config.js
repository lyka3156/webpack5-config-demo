const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);
// 引入公共配置
const baseConfig = require('./webpack.base.config.js');
// 合并webpack配置
const { merge } = require('webpack-merge');

module.exports = merge(baseConfig, {
	// 开发模式
	mode: 'development',

	// 开发配置的source map
	devtool: 'cheap-module-source-map',

	// 开发服务器
	devServer: {
		// 运行代码的目录   老版写法: 		contentBase: resolvePath('dist'),
		static: {
			directory: resolvePath('dist'),
		},
		// 为每个静态文件开启gzip压缩
		compress: true,
		host: 'localhost', // 域名
		port: 9000, // 端口号
		// open: true, // 自动打开浏览器
		hot: true, //开启HMR功能
		// 设置代理
		proxy: {
			// 一旦devServer(9000端口)接收到/api/xxx的请求，就会用devServer起的服务把请求转发到另外一个服务器（3000）
			// 以此来解决开发中的跨域问题
			api: {
				target: 'htttp://localhost:3000',
				// 发送请求时，请求路径重写：将/api/xxx  --> /xxx （去掉/api）
				pathRewrite: {
					'^api': '',
				},
			},
		},
	},
});
