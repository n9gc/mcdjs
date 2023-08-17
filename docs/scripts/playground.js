/// <reference types="mcdjs/browser.d.ts" />
/// <reference path="./lib.js" />
// @ts-check
"use strict";

window.onload = () => {
	McdJS.appinf.globalify();
	const [Ebutton, Einput, Eoutput] = ['Ebutton', 'Einput', 'Eoutput'].map(getN);
	Ebutton.onclick = async () => {
		const result = await McdJS.appinf.parse('playground', () => {
			const Escript = document.createElement('script');
			if ('value' in Einput && typeof Einput.value === 'string') Escript.innerHTML = Einput.value;
			document.head.appendChild(Escript);
		});
		Eoutput.innerHTML = JSON.stringify(result, null, '  ');
	};
};