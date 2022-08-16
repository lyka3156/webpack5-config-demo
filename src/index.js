import './index.css'; // css-loader
import './index.less'; // less-loader

import logo from './assets/images/logo.jpg';
const img = new Image();
img.src = logo;
document.getElementById('imgBox').appendChild(img);

const sum = (a, b) => {
	return a + b;
};
const count = sum(1, 2);
console.log(count);

export { sum };
