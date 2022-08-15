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
