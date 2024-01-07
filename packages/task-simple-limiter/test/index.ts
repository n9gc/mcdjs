import Limiter from "..";

const a = new Limiter(new Limiter({ concurrency: 2 }));
async function to(t: number, i?: any) {
	await new Promise(res => setTimeout(res, t));
	i && console.log(i);
}

console.log(a);

(async () => {
	const release = await a.hold();
	await to(500, 11);
	release();
	console.log(12);
})();
(async () => {
	const release = await a.hold();
	await to(500, 21);
	release();
	console.log(22);
})();
(async () => {
	const release = await a.hold();
	await to(500, 31);
	release();
	console.log(32);
})();
(async () => {
	const release = await a.hold();
	await to(500, 41);
	release();
	console.log(42);
})();
(async () => {
	const release = await a.hold();
	await to(500, 51);
	release();
	console.log(52);
})();