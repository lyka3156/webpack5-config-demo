const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = {
	// 入口文件
	entry: resolvePath('../src/index.js'),

	// 打包输出
	output: {
		filename: 'index.js', // 输出文件名
		path: resolvePath('../dist'), // 输出路劲
	},
};
