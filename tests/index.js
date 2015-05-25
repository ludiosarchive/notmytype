"use strong";
"use strict";

const assert = require('assert');
const T = require('..');

describe('T()', function() {
	it('works with 0 args', function() {
		T();
	});

	it('throws with odd # of args', function() {
		assert.throws(function() {
			T(1);
		}, /an even number/);

		assert.throws(function() {
			T(1, T.number, 3);
		}, /an even number/);
	});
});
