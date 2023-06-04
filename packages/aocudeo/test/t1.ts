import Loader from '../async';

function log(n: any) {
	return async () => new Promise(res => {
		console.log('start', n);
		setTimeout(res, 300);
	}).then(() => console.log('end', n));
}
new Loader({
	1: log(1),
	2: log(2),
	3: log(3),
	4: log(4),
	5: log(5),
	6: log(6),
}).load();

