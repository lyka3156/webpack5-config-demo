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

##### 2. style-loader [官方地址](https://webpack.docschina.org/loaders/style-loader/)

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

##### 3. less-loader [官方地址](https://webpack.docschina.org/loaders/less-loader/)

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

##### 4. sass-loader [官方地址](https://webpack.docschina.org/loaders/sass-loader/)

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

##### 5. postcss-loader [官方地址](https://webpack.docschina.org/loaders/postcss-loader/)

1. 使用 PostCSS 处理 CSS 的 loader
2. 一般搭配 autoprefixer 为 css 添加浏览器前缀

首先，你需要先安装 sass , sass-loader , autoprefixer

```js
yarn add -D postcss-loader  postcss autoprefixer
```

`webpack.config.js`

```js
// 模块匹配规则: 在这里为模块配置loader
module: {
    rules: [
        {
            // 匹配所有的 css 文件
            test: /\.(css|less)$/i,
            use: [
                // 将 JS 字符串生成为 style 节点
                'style-loader',
                // 将 CSS 转化成 CommonJS 模块
                'css-loader',
                // 添加 CSS 浏览器前缀
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [require('autoprefixer')],
                        },
                    },
                },
                // 将 Less 编译成 CSS
                'less-loader',
            ],
        },
    ],
},
```

或者使用 PostCSS 本身的 [配置文件](https://webpack.docschina.org/loaders/postcss-loader/#config)

-   创建 `/postcss.config.js`
    Loader 将会自动搜索配置文件

```js
// postcss.config.js

// {
// loader: 'postcss-loader',
// options: {
//     postcssOptions: {
//         plugins: [require('autoprefixer')],
//     },
// },

// 导出去的就是postcss - loader里面的options的postcssOptions属性对象
module.exports = {
	plugins: [require('autoprefixer')],
};
```

-   修改 `/build/webpack.config.js`;

```js
// 模块匹配规则: 在这里为模块配置loader
module: {
    rules: [
        {
            // 匹配所有的 css 文件
            test: /\.(css|less)$/i,
            use: [
                // 将 JS 字符串生成为 style 节点
                'style-loader',
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
```

##### 6. MiniCssExtractPlugin.loader [官方地址](https://webpack.docschina.org/loaders/postcss-loader/#extract-cssextractplugin)

1. 分离样式文件
2. 前面，我们都是依赖 style-loader 将样式通过 style 标签的形式添加到页面上
3. 但是，更多时候，我们都希望可以通过 CSS 文件的形式引入到页面上

首先，你需要先安装 mini-css-extract-plugin

```js
yarn add -D  mini-css-extract-plugin
```

`webpack.config.js`

```js
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
    // 该插件将CSS提取到单独的文件中。它会为每个chunk创造一个css文件。需配合loader一起使用
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        // chunkFilename: 'css/[name].[contenthash:8].css',
    }),
],
```

#### 2. file 的 loader

Webpack5.0 新增资源模块(asset module)，它是一种模块类型，允许使用资源文件（字体，图标等）而无需 配置额外 loader。支持以下四个配置

1. asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
2. asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
3. asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
4. asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资 源体积限制实现。

##### 1. 图片文件处理

图片小于 10kb 的使用 base64,大于 10kb 的拷贝文件

`webpack.config.js`

```js
// 模块匹配规则: 在这里为模块配置loader
module: {
	rules: [
		{
			// 匹配图片文件
			test: /\.(png|jpg|jpeg|gif|svg)$/i,
			// 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
			type: 'asset',
			generator: {
				// 输出文件位置以及文件名
				filename: 'images/[name]_[hash:8][ext]',
				// 打包之后图片的访问公共前缀
				// publicPath: '../',
			},
			parser: {
				dataUrlCondition: {
					maxSize: 10 * 1024, // 超过10kb不转 base64
				},
			},
		},
	];
}
```

##### 2. 字体文件的处理

首先，从 [iconfont.cn](https://www.iconfont.cn/home/index?spm=a313x.7781069.1998910419.2) 下载字体文件到本地

`webpack.config.js`

```js
// 模块匹配规则: 在这里为模块配置loader
module: {
	rules: [
		{
			// 匹配字体文件
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
			// 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
			type: 'asset/resource',
			generator: {
				// 输出文件位置以及文件名
				filename: 'images/[name]_[hash:8][ext]',
			},
		},
	];
}
```

#### 3. js 的 loader

##### 1. babel-loader [官方地址](https://webpack.docschina.org/loaders/babel-loader/)

1. 在开发中我们想使用最新的 Js 特性，但是有些新特性的浏览器支持并不是很好，所以 Js 也需要做兼容处理，常见的就是将 ES6 语法转化为 ES5。
2. babel-loader 就是用来处理 js 兼容的 loader

首先，你需要先安装 `babel-loader` `@babel/core`

-   babel-loader 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
-   @babel/core Babel 编译的核心包

```js
yarn add -D babel-loader @babel/core
```

###### 1. 配置 Babel 预设

安装 `@babel/preset-env`

-   @babel/preset-env Babel 编译的预设，可以理解为 Babel 插件的超集
    -   将 es6+的语法转换成浏览器识别的 js 语法

```js
yarn add -D @babel/preset-env
```

`webpack.config.js`

```js
module: {
	rules: [
		{
			// 匹配js文件
			test: /\.js$/,
			// 不包含哪些目录
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					// 将 babel-loader 提速至少两倍。这会将转译的结果缓存到文件系统中
					// cacheDirectory: true,
				},
			},
		},
	];
}
```

为了避免 webpack.config.js 太臃肿，建议将 Babel 配置文件提取出来

根目录下新增 .babelrc.js

```js
// ./babelrc.js

module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				// useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
				// useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
				// useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
				useBuiltIns: 'entry',
				corejs: '3.9.1', // 是 core-js 版本号
				targets: {
					chrome: '58',
					ie: '11',
				},
			},
		],
	],
};
```

常见 Babel 预设还有：

-   @babel/preset-flow
    -   将 flow 语法 转换成浏览器识别的 js 代码
-   @babel/preset-react
    -   将 react 转换成浏览器识别的 js 代码
-   @babel/preset-typescript
    -   将 ts 语法 转换成浏览器识别的 js 代码

###### 2. 配置 Babel 插件

对于正在提案中，还未进入 ECMA 规范中的新特性，Babel 是无法进行处理的，必须要安装对应的插件，例如：

```js
// ./ index.js

// 新增装饰器的使用
@log('打印log')
class MyClass {}

function log(text) {
	return function (target) {
		target.prototype.logger = () => `${text}，${target.name}`;
	};
}

const test = new MyClass();
test.logger();
```

不出所料，识别不了

怎么才能使用呢？Babel 其实提供了对应的插件：

-   @babel/plugin-proposal-decorators
    -   解析@装饰器语法
-   @babel/plugin-proposal-class-properties
    -   解析直接在 class 里面声明实例化成员,不用在 constructor 里面声明了

安装插件

```js
yarn add -D @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
```

@装饰器语法在 vscode 编辑器报错,[解决办法](https://www.cnblogs.com/Annely/p/14613567.html)

根目录下新增 jsconfig.json

```js
{
	// 去掉@装饰器语法带来的错误警告
	"compilerOptions": {
		"experimentalDecorators": true // 主要是这个
	}
}
```

### 2.5 配置 plugin [文档地址](https://webpack.docschina.org/plugins/)

1. 与 Loader 用于转换特定类型的文件不同，插件（Plugin）可以贯穿 Webpack 打包的生命周期，执行不同的任务
2. 可以用于执行范围更广的任务。从打包优化和压缩，一直到重新定义环境中的变量等

#### 1. HtmlWebpackPlugin [文档地址](https://webpack.docschina.org/plugins/html-webpack-plugin/)

该插件将为你生成一个 HTML5 文件， 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle。 只需添加该插件到你的 webpack 配置中

安装

```js
yarn add -D html-webpack-plugin
```

基本用法

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolvePath = (p) => path.resolve(__dirname, p);
module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name]_[contenthash:8].js',
	},
	plugins: [
		// 把打包后的资源文件，例如：js 或者 css 文件可以自动引入到 Html 中
		new HtmlWebpackPlugin({
			// 模板html地址
			template: resolvePath('../src/index.html'),
			// 输出后的html文件名
			filename: 'index.html',
		}),
	],
};
```

如果你有多个 webpack 入口，他们都会在已生成 HTML 文件中的 `<script>` 标签内引入。

如果在 webpack 的输出中有任何 CSS 资源（例如，使用 [MiniCssExtractPlugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/) 提取的 CSS），那么这些资源也会在 HTML 文件 `<head>` 元素中的 `<link>` 标签内引入。

#### 2. MiniCssExtractPlugin [文档地址](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)

本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

安装

```js
yarn add -D mini-css-extract-plugin
```

基本用法

-   建议 mini-css-extract-plugin 与 css-loader 一起使用

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
	module: {
		rules: [
			{
				// 匹配所有的 css 文件
				test: /\.css$/i,
				use: [
					// 将 JS 字符串生成为 style 节点
					// 'style-loader',
					// MiniCssExtractPlugin.loader的作用就是把css-loader处理好的样式资源（js文件内），单独提取出来 成为css样式文件
					MiniCssExtractPlugin.loader, // 生产环境下使用，开发环境还是推荐使用style-loader
					// 将 CSS 转化成 CommonJS 模块
					'css-loader',
				],
			},
		],
	},
	plugins: [
		// 该插件将CSS提取到单独的文件中。它会为每个chunk创造一个css文件。需配合loader一起使用
		new MiniCssExtractPlugin({
			filename: 'css/[name]_[contenthash:8].css',
			// chunkFilename: 'css/[name]_[contenthash:8].css',
		}),
	],
};
```

#### 3. CssMinimizerWebpackPlugin [文档地址](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#root)

这个插件使用 cssnano 优化和压缩 CSS。

就像 [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) 一样，但在 source maps 和 assets 中使用查询字符串会更加准确，支持缓存和并发模式下运行

安装

```js
yarn add -D  css-minimizer-webpack-plugin
```

基本用法

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
	mode: 'production', // 生产环境
	module: {
		rules: [
			{
				test: /.s?css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [new MiniCssExtractPlugin()],
	// 优化
	optimization: {
		minimizer: [
			// 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
			`...`,
			// 启动css压缩  一般在生产模式配置,开发环境不配置,可以通过环境来配置是否压缩css
			new CssMinimizerPlugin(),
		],
		// 如果还想在开发环境下启用 CSS 优化，请将 optimization.minimize 设置为 true:
		// minimize: true,
	},
};
```

#### 4. TerserWebpackPlugin [文档地址](https://webpack.docschina.org/plugins/terser-webpack-plugin/)

该插件使用 [terser](https://github.com/terser/terser) 来压缩 JavaScript

webpack v5 开箱即带有最新版本的 `terser-webpack-plugin`。如果你使用的是 webpack v5 或更高版本，同时希望自定义配置，那么仍需要安装 `terser-webpack-plugin`。如果使用 webpack v4，则必须安装 `terser-webpack-plugin` v4 的版本

安装

```js
yarn add -D terser-webpack-plugin
```

基本用法

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	// 优化
	optimization: {
		minimizer: [
			// 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
			// `...`,
			// 自定义配置压缩js的规则,不使用webpack5自带的压缩js规则
			// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
			new TerserPlugin({
				terserOptions: {
					parallel: true, // 启用/禁用多进程并发运行功能
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
		],
		// 如果还想在开发环境下启用 CSS 优化，请将 optimization.minimize 设置为 true:
		// minimize: true,
	},
};
```

#### 5. CopyWebpackPlugin [文档地址](https://webpack.docschina.org/plugins/copy-webpack-plugin)

将已存在的单个文件或整个目录复制到打包目录

安装

```js
yarn add -D copy-webpack-plugin
```

基本用法

-   例如: 我要把 src/static 目录的所有静态文件原封不动的全部拷贝一份到打包目录 static 中

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	plugins: [
		// 拷贝文件或者目录
		new CopyWebpackPlugin({
			patterns: [
				// from: 从哪里  to: 到哪里
				{ from: 'src/static', to: 'static' },
			],
		}),
	],
};
```

#### 6. DefinePlugin [文档地址](https://webpack.docschina.org/plugins/define-plugin/)

`DefinePlugin` 允许在 编译时 将你代码中的变量替换为其他值或表达式。
这在需要根据开发模式与生产模式进行不同的操作时，非常有用。
例如，如果想在开发构建中进行日志记录，而不在生产构建中进行，就可以定义一个全局常量去判断是否记录日志。
这就是 DefinePlugin 的发光之处，设置好它，就可以忘掉开发环境和生产环境的构建规则。

基本用法

传递给 DefinePlugin 的每个键都是一个标识符或多个以 . 连接的标识符。

-   如果该值为字符串，它将被作为代码片段来使用。
-   如果该值不是字符串，则将被转换成字符串（包括函数方法）。
-   如果值是一个对象，则它所有的键将使用相同方法定义。
-   如果键添加 typeof 作为前缀，它会被定义为 typeof 调用。

```js
module.exports = {
	plugins: [
		// 定义全局变量
		new webpack.DefinePlugin({
			PRODUCTION: JSON.stringify(true), // true
			VERSION: JSON.stringify('5fa3b9'), // '5fa3b9'
			BROWSER_SUPPORTS_HTML5: true, // true
			TWO: '1+1', // 2
			'typeof window': JSON.stringify('object'), // `object`
			// 用来区分环境
			// 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
	],
};
```

Tips

-   ` 请注意，由于本插件会直接替换文本，因此提供的值必须在字符串本身 中再包含一个 实际的引号 。通常，可以使用类似 '"production"' 这样的替换引号，或者直接用 JSON.stringify('production')。`
-   注意: 它定义的全局变量只是在代码层次上,也就是每个 js 模块里面都能访问次变量,不会定义到 window 上面去
