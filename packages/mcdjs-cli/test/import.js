require('../../../test/import')({
	webpack: {
		cmd: '--target node',
	},
}, __dirname, '../dist/index.js');
