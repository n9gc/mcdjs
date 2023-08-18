/// <reference path="./lib.js" />
// @ts-check
"use strict";

async function getUmlUrl(/**@type {string} */uml) {
	const res = await fetch(uml);
	const text = replace(await res.text(), [['\n', ';'], ['"', '\\"']]);
	return `https://www.gravizo.com/svg?${text}`;
}
window.onload = async () => {
	const [EdiagramList] = ['EdiagramList'].map(getN);
	EdiagramList.innerHTML += `
		<img src="${await getUmlUrl('/packages/aocudeo/lib/arch.puml')}" />
	`;
}
