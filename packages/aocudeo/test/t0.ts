import Loader from '..';

function log<T>(n: T) {
	return () => console.log(n);
}

const loader = new Loader;

const a = new Loader(1);

loader.insert(0, {}, log(0))
loader.insert(1, {after:[0, 2]}, log(1))
loader.insert(2, {}, log(2))
loader.insert('z', {after:'pre:2',before:2}, log('z'))

a.addAct(0, (n) => {
	return n;
})

loader.load();
