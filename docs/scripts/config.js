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
};