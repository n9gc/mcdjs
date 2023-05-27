const a = Promise.resolve.bind(Promise);
Promise.resolve = <T>(n?: T) => a(n).then(a => console.log(a));

import { LoaderAsync, PosMap } from '..';

const actMap = new Map([
	["putOnShirt", { run: () => Promise.resolve("put on your shirt") }],
	["putOnShorts", { run: () => Promise.resolve("put on your shorts") }],
	["putOnJacket", { run: () => Promise.resolve("put on your jacket") }],
	["putOnShoes", { run: () => Promise.resolve("put on your shoes") }],
	["tieShoes", { run: () => Promise.resolve("tie your shoes") }],
]);

const dependencies: PosMap = {
	// You need to put your shoes on before you tie them!
	"putOnShoes": { before: "tieShoes" },
	"putOnShirt": { before: "putOnJacket" },
	"putOnJacket": { after: "putOnShorts" },
	"putOnShorts": { before: "putOnShoes" },
};

const loader = new LoaderAsync<void>(actMap, dependencies);
// console.log(loader);
loader.load().catch(n => console.log(n))

