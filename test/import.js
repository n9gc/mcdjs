require('export-tester')(
	{
		pack: 'mcdjs',
		sign: 'McdJS',
	},
	{
		import() {
			console.log(McdJS);
		}
	}
).then(() => process.exit(0));
