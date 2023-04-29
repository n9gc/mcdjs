const fsp = require('fs/promises');

(async () => {
	await fsp.rm('dist', { recursive: true, force: true });
	await fsp.rm('tsconfig.buildinfo', { recursive: true, force: true });
})();
