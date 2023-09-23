/// <reference path="../../playground/lib.js" />
// @ts-check
"use strict";

window.onload = () => {
	/**@type {{[x:string]:[string,string?]}} */
	const indexList = {
		playground: ['试验场'],
		about: ['详细了解'],
		mcdjs: ['项目代码仓库', 'https://github.com/n9gc/mcdjs'],
		mcd: ['《MC 指令设计》系列教程', 'https://github.com/n9gc/the-minecraft-command-design'],
	};
	const [Eindex] = ['Eindex'].map(getN);
	for (const id in indexList) {
		const Ea = document.createElement('a');
		Ea.setAttribute('data-umami-event', `/docs/ 索引-${id}`);
		Ea.innerText = indexList[id][0];
		Ea.href = indexList[id][1] ?? `./${id}/`;
		const Eli = document.createElement('li');
		Eli.appendChild(Ea);
		Eindex.appendChild(Eli);
	}
}

