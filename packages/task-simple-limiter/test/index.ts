import Limiter from "..";

const a = new Limiter(new Limiter({ concurrency: 2 }));
async function to(t: number, i?: any) {
	await new Promise(res => setTimeout(res, t));
	i && console.log(i);
}

console.log(0);

(async () => {
	await a.hold();
	await to(500, 11);
	a.release();
	console.log(12);
})();
(async () => {
	await a.hold();
	await to(1200, 21);
	a.release();
	console.log(22);
})();
(async () => {
	await a.hold();
	await to(500, 31);
	a.release();
	console.log(32);
})();
(async () => {
	await a.hold();
	await to(500, 41);
	a.release();
	console.log(42);
})();
