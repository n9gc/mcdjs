/**
 * 自动运行
 * @version 1.0.1
 * @license GPL-2.0-or-later
 */
declare module './checkrun';

let runed: (any[] | number | boolean)[] | true;
export default function (n: (...args: any[]) => any) {
	const r = process.argv[process.argv.length - 1];
	if (r.slice(0, 2) !== '-R') return;
	if (!runed) runed = r[2] === '=' ? eval(`(${r.slice(3)})`) : true;
	if (runed === true) { n(); return; }
	const args = runed.shift();
	if (Array.isArray(args)) n(...args);
}
