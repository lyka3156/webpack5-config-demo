import './index.css'; // css-loader
import './index.less'; // less-loader

// 图片
import logo from './assets/images/logo.jpg';
const img = new Image();
img.src = logo;
document.getElementById('imgBox').appendChild(img);

const sum = (a, b) => {
	return a + b;
};
const count = sum(1, 2);
console.log(count);

// babel-loader 的预设preset-env
class Person {
	name = 'zhangshan';
	age = 18;

	info = () => {
		return {
			name: this.name,
			age: this.age,
		};
	};
}

// babel-loader 的插件
// 装时器的问题 https://www.cnblogs.com/Annely/p/14613567.html
@log('打印log')
class MyClass {
	// 直接声明实例化成员
	a = 1;
}

function log(text) {
	return function (target) {
		target.prototype.logger = () => `${text}，${target.name}`;
	};
}

const test = new MyClass();
console.log(test, 2222, test.logger());

export { sum, Person };
