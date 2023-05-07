import { LoaderAsync as Loader } from '..';

const timeout = (n: number) => new Promise(res => setTimeout(res, n));
function log<T>(n: T) {
	return async () => {
		console.log('go', n);
		await timeout(200);
		console.log('end', n);
	}
}

const loader = new Loader;

const a = new Loader(1);

loader.insert(0, {}, log(0))
loader.insert(1, {after:[0, 2]}, log(1))
loader.insert(2, {}, log(2))
loader.addAct(Loader.END, log('end'))
//loader.insert(9, { preOf: 0, after: 2 }, log(9))
loader.insert(8, { postOf: 2 }, log(8))

a.insert('a', { after: 'b' });
a.insert('b', { after: 'a' });
a.insert('c', { after: 'b' });
// console.log(a);
// console.log(a.walk())

// console.log(loader);
loader.load()
