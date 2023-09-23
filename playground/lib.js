// @ts-check
"use strict";

function getN(/**@type {string} */name) {
	return document.getElementsByName(name)[0];
}

function replace(/**@type {string} */str, /**@type {readonly (readonly [string, string])[]} */[match, ...matchs]) {
	return match ? replace(str.split(match[0]).join(match[1]), matchs) : str;
}

