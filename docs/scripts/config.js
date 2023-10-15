"use strict";

/* 离线文档 */
navigator?.serviceWorker?.register?.('scripts/sw.js');

/**@see https://docsify.js.org/#/zh-cn/configuration */
var $docsify = {
	repo: 'https://github.com/n9gc/mcdjs',
	basePath: '/docs/',
	relativePath: true,
	logo: '/packages/mcdjs/lib/logo.svg',
	coverpage: 'coverpage.md',
	loadSidebar: 'sidebar.md',
	subMaxLevel: 2,
	name: 'McdJS - 指令生成器',
	themeColor: '#a5b2eb',
	search: {
		placeholder: '搜索文档',
		noData: '没搜到！',
		depth: 6,
	},
	copyCode: {
		buttonText: '复制',
		errorText: '失败',
		successText: '成功',
	},
	auto2top: false,
	fallbackLanguages: ['zh', 'en'],
	loadNavbar: 'navbar.md',
};

function setCookies(/**@type {string} */key,/**@type {string} */value,/**@type {number} */limitTime) {
	let data = new Date(new Date().getTime() + limitTime * 24 * 60 * 60 * 1000).toUTCString();
	document.cookie = `${key}=${value};expires=${data}`;
}
function searchCookie(/**@type {string} */cookieName) {
	let re = new RegExp("\s?" + cookieName + "=([^;]+)(;|$)");
	return document.cookie.match(re)?.[1];
}

let isDarkNow = matchMedia('(prefers-color-scheme: dark)').matches;
function changeStyle(/**@type {boolean|null} */to = null) {
	if (to === `${isDarkNow}`) return;
	isDarkNow = !isDarkNow;
	/**@type {HTMLLinkElement} */
	const ELinkDark = window.ELinkDark;
	/**@type {HTMLLinkElement} */
	const ELinkLight = window.ELinkLight;
	[ELinkDark.media, ELinkLight.media] = [ELinkLight.media, ELinkDark.media];
	document.cookie += '';
	setCookies('styleSetted', isDarkNow, 9999);
}
changeStyle(searchCookie('styleSetted') ?? isDarkNow);