/**
 * 自动运行
 * @module @mcdjs/dev/tool/checkrun
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './checkrun';

export default function (n: (...args: any[]) => any) {
	const r = process.argv[process.argv.length - 1];
	if (r.slice(0, 2) !== '-R') return;
	n(...(r[2] === '=' ? eval(`(${r.slice(3)})`) : []));
}
