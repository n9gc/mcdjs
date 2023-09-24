// @ts-check
document.querySelectorAll('.img-puml').forEach(async img => {
	if (!(img instanceof HTMLImageElement)) return;
	const text = await (await fetch(img.src)).text();
	const url = `https://www.gravizo.com/svg?${encodeURIComponent(`${text}`)}`;
	img.src = url;
});
