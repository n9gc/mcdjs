// @ts-check
/**@type {import('lage').ConfigOptions} */
module.exports = {
	"npmClient": "pnpm",
	"concurrency": 8,
	"pipeline": {
		"test": {
			"dependsOn": [
				"^test"
			],
			"inputs": [
				"./**/*.ts"
			]
		},
		"test:cli": {
			"dependsOn": [
				"build",
				"^build"
			]
		},
		"f-clear": {
			"inputs": [
				"./**/*.js",
				"./**/*.js.map",
				"./**/*.d.ts"
			],
			"cache": false,
			"outputs": [
				"./**/*.js",
				"./**/*.js.map",
				"./**/*.d.ts"
			]
		},
		"clear": {
			"dependsOn": [
				"^f-clear"
			],
			"cache": false,
			"inputs": [
				"./**/*.js",
				"./**/*.js.map",
				"./**/*.d.ts"
			],
			"outputs": [
				"./**/*.js",
				"./**/*.js.map",
				"./**/*.d.ts"
			]
		},
		"build": {
			"dependsOn": [
				"^build"
			],
			"inputs": [
				"./**/*.ts"
			],
			"outputs": [
				"./**/*.js",
				"./**/*.js.map",
				"./**/*.d.ts"
			]
		}
	}
}