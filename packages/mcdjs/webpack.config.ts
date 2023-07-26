import { Configuration } from 'webpack';
const config: Configuration = {
	entry: __dirname + '/lib/exp.ts',
	mode: 'development',
	output: {
		path: __dirname + '/lib',
		filename: 'packed.js',
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
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