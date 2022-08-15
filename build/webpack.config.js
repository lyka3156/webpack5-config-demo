const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = {
	// 入口文件
	entry: resolvePath('../src/index.js'),
};
