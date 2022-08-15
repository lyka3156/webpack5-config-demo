// 入口更多配置： https://webpack.docschina.org/concepts/entry-points
module.exports = {
	// 入口文件
	// 1. string方式： 单入口，打包形成一个chunk，输出一个buldle文件。chunk的名称默认是main.js
	// entry: ('./src/index.js'),

	// 2. array方式：多入口，所有入口文件最终只会形成一个chunk，输出出去只有一个bundle文件
	// entry: ['./src/index.js', './src/app.js'],

	// 3. object：多入口，有几个入口文件就形成几个chunk，输出几个bundle文件。此时chunk的名称就是对象key值
	entry: {
		index: './src/index.js',
		app: './src/app.js',
	},
	output: {
		clean: true,
	},
};
