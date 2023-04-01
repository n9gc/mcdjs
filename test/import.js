require('export-tester')(
	{
		file: require('path').join(__dirname, '../build/index.js'),
		sign: 'McdJS',
	},
	{
		import() {
			console.log(McdJS);
		}
	}
).then(
	() => process.exit(0),
	() => process.exit(-1),
);
