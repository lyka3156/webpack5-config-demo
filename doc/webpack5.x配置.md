# webpack5.x 配置

[webpack5.x 官方文档](https://webpack.docschina.org/concepts/)
[webpack5 配置](https://mp.weixin.qq.com/s/juHpe0Pnrdsrd6imRdbkUg)
[webpack5 配置](https://juejin.cn/post/6971743815434993671)
[package.json](https://www.jianshu.com/p/c86d511d99fd)
[yarn](https://blog.csdn.net/weixin_45942220/article/details/123090688)

## 1. webpack 初使用

1. 创建项目目录 webpack5-config-test1

2. 创建 package.json 文件 （包管理器）

    package.json 的文件中跟踪依赖关系和元数据。这是你项目的核心。它包含名称、描述和版本之类的信息，以及运行、开发以及有选择地将项目发布到 NPM 所需的信息

```js
//   与 npm init 一样通过交互式会话创建一个 package.json
yarn int -y
```

3. 安装 webpack webpack-cli

```js
// 1. 安装
npm i -D webpack webpack-cli
yarn add -D webpack webpack-cli
```

4. 创建 src/index.js

`src/index.js`

```js
// webpack打包测试
const sum = (a, b) => {
	console.log(1 + 2);
};
sum(1, 2);
```

5. 在 package.json 中配置 webpack 打包命令脚本

`package.json`

```js
"scripts": {
  "build": "webpack ./src/index.js"
},
```

6. 执行 yarn build 打包命令
   默认打包后在 dist 目录下生成 1 个 main.js 文件(dist/main.js) , 也可以手动配置

## 2. webpack 配置

### 2.1 webpack 配置文件创建

一般我们做项目的时候都会把打包的配置文件单独放在一个 build 目录下面: 例如：

创建 `build/webpack.config.js`，内部导出一个 webpack 的配置对象

```js
const path = require('path');
module.exports = {
	// 入口文件
	entry: path.resolve(__dirname, '../src/index.js'),
	// 打包输出
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, '../dist'),
	},
};
```

修改 package.json，将 webpack 默认配置文件查找路劲修改

```js
"scripts": {
      "build": "webpack --config ./build/webpack.config.js"
},
```

### 2.2 配置入口 (entry)[文档地址](https://webpack.docschina.org/concepts/entry-points)

`入口起点(entry point)` 指示 webpack 应该使用哪个模块，来作为构建其内部 `依赖图(dependency graph)` 的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

默认值是 `./src/index.js`, 你可以通过在 ` webpack configuration` 中配置 `entry` 属性，来指定一个（或多个）不同的入口起点。例如：

`webpack.config.js`

```js
module.exports = {
	entry: './src/index.js',
};
```

### 2.3 配置输出 (output)[文档地址](https://webpack.docschina.org/configuration/output)

`output` 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。

```js
const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = {
	// 入口文件
	entry: './src/index.js',

	// 生产模式打包     devlopment/production
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
};
```

### 2.4 配置 loader [文档地址](https://webpack.docschina.org/concepts/loaders/)

官方介绍：loader 用于对模块的源代码进行转换。loader 可以使你在 import 或 "load(加载)" 模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的得力方式。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS 文件！

总结：Webpack 只能解析 JavaScript 和 json 文件，不能处理其他文件，Loader 就是将 Webpack 不认识的内容转化为认识的内容。

下面是一些常用的 loader

#### 1. css 的 loader

##### 1. css-loader [文档地址](https://webpack.docschina.org/loaders/css-loader/)

1. 加载 CSS 文件并解析 import 的 CSS 文件，最终返回 CSS 代码
2. 主要来处理 background:(url)还有@import 这些语法。让 webpack 能够正确的对其路径进行模块化处理
3. 将 css 文件转换成 webpack 认识的 js 文件

首先，你需要先安装 `css-loader`

```js
yarn add -D css-loader
```

`webpack.config.js`

```js
// 模块匹配规则: 在这里为模块配置loader
module: {
    rules: [
        {
            // 匹配所有的 css 文件
            test: /\.css$/,
            // use: 对应的 Loader 名称
            use: 'css-loader',
        },
    ],
},
```

#### 2. style-loader [官方地址](https://webpack.docschina.org/loaders/style-loader/)

1. style-loader 把 css 插入到 DOM 中
2. 推荐将 style-loader 与 css-loader 一起使用

首先，你需要先安装 `style-loader`

```js
yarn add -D style-loader
```

`webpack.config.js`

```js
// 模块匹配规则: 在这里为模块配置loader
module: {
    rules: [
        {
            // 匹配所有的 css 文件
            test: /\.css$/,
            // use: 对应的 Loader 名称
            use: ['style-loader', 'css-loader'],
        },
    ],
},
```

#### 3. less-loader [官方地址](https://webpack.docschina.org/loaders/less-loader/)

1. webpack 将 Less 编译为 CSS 的 loader。

首先，你需要先安装 less 和 less-loader：

```js
yarn add -D less less-loader
```

`webpack.config.js`

```js
// 模块匹配规则: 在这里为模块配置loader
module: {
    rules: [
        {
            // 匹配所有的 css 文件
            test: /\.(css|less)$/i,
            // use: 对应的 Loader 名称
            use: ['style-loader', 'css-loader', 'less-loader'],
        },
    ],
},
```

#### 4. sass-loader [官方地址](https://webpack.docschina.org/loaders/sass-loader/)

1. 加载 Sass/SCSS 文件并将他们编译为 CSS。

首先，你需要先安装 sass 和 sass-loader：

```js
yarn add -D sass sass-loader
```

`webpack.config.js`

```js
// 模块匹配规则: 在这里为模块配置loader
module: {
    rules: [
        {
            // 匹配所有的 css 文件
            test: /\.(css|scss)$/i,
            use: [
                // 将 JS 字符串生成为 style 节点
                'style-loader',
                // 将 CSS 转化成 CommonJS 模块
                'css-loader',
                // 将 Sass 编译成 CSS
                'sass-loader',
            ],
        },
    ],
},
```
