import Loader from '..';

function log<T>(n: T) {
	return () => console.log(n);
}

const loader = new Loader;

const a = new Loader(1);

loader.insert(9, { preOf: 0, after: 2 }, log(9))
loader.insert(8, { postOf: 2 }, log(8))
loader.insert(0, {}, log(0))
loader.insert(1, {after:[0, 2]}, log(1))
loader.insert(2, {}, log(2))
loader.addAct(Loader.END, log('end'))

a.addAct(0, (n) => {
	return n;
})

loader.load();
