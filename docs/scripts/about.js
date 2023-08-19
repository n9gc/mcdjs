/// <reference path="./lib.js" />
// @ts-check
"use strict";

async function getUmlUrl(/**@type {string} */uml) {
	const res = await fetch(`${uml}?=${Math.random()}`);
	const text = replace(await res.text(), [['\n', ';']]);
	return `https://www.gravizo.com/svg?${text}`;
}
window.onload = async () => {
	const [EdiagramList] = ['EdiagramList'].map(getN);
	/**@type {{[alt:string]:string}} */
	const umls = {
		'Aocudeo 架构图': '/packages/aocudeo/lib/arch.puml',
		'McdJS 架构图': '/packages/mcdjs/lib/arch.puml',
	};
	for (const alt in umls) {
		const Eimg = document.createElement('img');
		Eimg.src = await getUmlUrl(umls[alt]);
		Eimg.alt = alt;
		EdiagramList.appendChild(Eimg);
		EdiagramList.appendChild(document.createElement('br'));
	}
}
