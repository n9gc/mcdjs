/**@type {import('webpack').Configuration} */
const a = {
	entry: __dirname + '/types/exp.js',
	mode: ['development', 'production'][1],
	output: {
		path: __dirname + '/types',
		filename: 'packed.js'
	},

};
module.exports = a;