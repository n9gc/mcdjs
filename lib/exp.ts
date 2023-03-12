declare global {
	var exp: false | typeof window;
	var McdJS: typeof import('.');
}
import * as imp from '.';
exp === false ? window.McdJS = imp : exp.exports = imp;
