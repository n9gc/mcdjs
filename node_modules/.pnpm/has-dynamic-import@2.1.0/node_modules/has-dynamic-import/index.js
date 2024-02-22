'use strict';

var callBound = require('call-bind/callBound');
var callBind = require('call-bind');
var GetIntrinsic = require('get-intrinsic');
var $then = callBound('Promise.prototype.then', true);
var $Promise = GetIntrinsic('%Promise%', true);
var $PromiseResolve = GetIntrinsic('%Promise.resolve%', true);
var $resolve = $Promise && $PromiseResolve && $then && callBind($PromiseResolve, $Promise);

/** @type {() => false} */
var thunkFalse = function () {
	return false;
};
/** @type {() => true} */
var thunkTrue = function () {
	return true;
};

/** @type {() => PromiseLike<boolean>} */
module.exports = function hasDynamicImport() {
	if (!$then) {
		/** @type {PromiseLike<boolean>} */
		return {
			__proto__: null,
			// @ts-expect-error ts(2322) TODO: fixme
			then: function (resolve) { // eslint-disable-line consistent-return
				if (typeof resolve === 'function') {
					process.nextTick(function () {
						resolve(false);
					});
				} else {
					return hasDynamicImport();
				}
			}
		};
	}

	try {
		var importWrapper = require('./import'); // eslint-disable-line global-require

		return $then(importWrapper(), thunkTrue, thunkFalse);
	} catch (e) {
		return $resolve(false);
	}
};
