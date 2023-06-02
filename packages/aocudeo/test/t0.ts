import { LoaderSync as Loader } from '..';

const timeout = (n: number) => new Promise(res => setTimeout(res, n));
function log<T>(n: T) {
	return () => console.log(n)
	return async () => {
		console.log('go', n);
		await timeout(200);
		console.log('end', n);
	}
}

const loader = new Loader();


loader.insert(0, {}, log(0))
loader.insert(1, {after:[0, 2]}, log(1))
loader.insert(2, {}, log(2))
loader.addAct(Loader.END, log('end'))
//loader.insert(9, { preOf: 0, after: 2 }, log(9))
loader.insert(8, { postOf: [2] }, log(8))
loader.insert(5, { after: 2, preJudger() { return true; } }, log(5))
loader.checkCircle()
loader.checkLost();

const a = new Loader<number>;
const s0 = Symbol(0);
const s1 = Symbol(1);
const s2 = Symbol(2);
a.insert(s0, { before: s1 });
a.insert(s1, { before: s0 });
a.insert(s1, { before: s2 });
// console.log(a);
// console.log(a.walk())

// new Loader().addAct(Loader.END, log('hh')).load();
// console.log(loader);

//loader.show();

loader.load();
//loader.load().then(() => loader.load());
