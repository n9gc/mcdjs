'use strict';

var through = require('@ljharb/through');

var nextTick = typeof setImmediate === 'undefined'
	? process.nextTick
	: setImmediate;

/** @type {import('./resumer')} */
module.exports = function resumer(write, end) {
	var tr = through(write, end);
	tr.pause();
	var resume = tr.resume;
	var pause = tr.pause;
	var paused = false;

	tr.pause = function () {
		paused = true;
		// @ts-expect-error https://github.com/microsoft/TypeScript/issues/57164
		return pause.apply(this, arguments);
	};

	tr.resume = function () {
		paused = false;
		// @ts-expect-error https://github.com/microsoft/TypeScript/issues/57164
		return resume.apply(this, arguments);
	};

	nextTick(function () {
		if (!paused) { tr.resume(); }
	});

	return tr;
};
