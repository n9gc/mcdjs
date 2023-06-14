const a = Promise.resolve.bind(Promise);
Promise.resolve = <T>(n?: T) => a(n).then((a: any) => a && console.log(a));

import {LoaderAsync, Positions} from '../';

const actions = new Map([
	["putOnShirt", {run: () => Promise.resolve("put on your shirt")}],
	["putOnShorts", {run: () => Promise.resolve("put on your shorts")}],
	["putOnJacket", {run: () => Promise.resolve("put on your jacket")}],
	["putOnShoes", {run: () => Promise.resolve("put on your shoes")}],
	["tieShoes", {run: () => Promise.resolve("tie your shoes")}],
]);

const positions: Positions = [
	// You need to put your shoes on before you tie them!
	["putOnShoes", "tieShoes"],
	["putOnShirt", "putOnJacket"],
	["putOnShorts", "putOnJacket"],
	["putOnShorts", "putOnShoes"],
];

await new LoaderAsync<void>({actions, positions}).load();
new LoaderAsync().load();
//loader.load().catch(n => console.log(n))

