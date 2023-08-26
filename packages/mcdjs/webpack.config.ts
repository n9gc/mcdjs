import { Configuration } from 'webpack';
const config: Configuration = {
	entry: __dirname + '/lib/exp.js',
	mode: 'production',
	output: {
		path: __dirname,
		filename: 'packed.js',
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx"],
		extensionAlias: {
			".js": [".js", ".ts"],
			".cjs": [".cjs", ".cts"],
			".mjs": [".mjs", ".mts"],
		},
	},
	module: {
		rules: [
			{
				test: /\.([cm]?ts|tsx)$/,
				use: {
					loader: "ts-loader",
					options: {
						transpileOnly: true,
						compilerOptions: {
							declaration: false,
							emitDeclarationOnly: false,
						},
					},
				},
			},
		],
	},
};
export default config;