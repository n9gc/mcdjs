const tester = require('export-tester');

tester(
	{
		pack: 'mcdjs',
		sign: 'McdJS',
	},
	{
		import() {
			console.log(McdJS);
		}
	}
);