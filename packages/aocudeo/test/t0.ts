import Loader from '..';

function log<T>(n: T) {
	return () => console.log(n);
}

const loader = new Loader;

loader.insert({}, 0, log(0))
loader.insert({after:[0, 2]}, 1, log(1))
loader.insert({}, 2, log(2))

loader.load();
