/**@type {import('webpack').Configuration} */
const a = {
	entry: __dirname + '/dist/exp.js',
	mode: ['development', 'production'][1],
	output: {
		path: __dirname + '/dist',
		filename: 'packed.js'
	},
};
module.exports = a;