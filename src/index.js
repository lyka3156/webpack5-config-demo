import './index.css';
// webpack打包测试

const sum = (a, b) => {
	return a + b;
};
const count = sum(1, 2);
console.log(count);

export { sum };
