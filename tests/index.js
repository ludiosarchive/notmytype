"use strong";
"use strict";

const assert = require('assert');

const getArgList = require('..').getArgList;

describe('getArgList', function() {
	it('extracts arg list from untyped function', function() {
		assert.deepStrictEqual(['a', 'b'], getArgList('function(a, b) { return 3; }'));
	});

	it('extracts arg list from untyped 1-arg function', function() {
		assert.deepStrictEqual(['a'], getArgList('function(a) { return 3; }'));
	});

	it('extracts arg list from untyped 0-arg function', function() {
		assert.deepStrictEqual([], getArgList('function() { return 3; }'));
	});

	it('extracts arg list from untyped multi-line function', function() {
		assert.deepStrictEqual(['a', 'b', 'c'], getArgList(
			`function(a,
				b,
				c) { return 3; }`));
	});

	it('extracts arg list from another untyped multi-line function', function() {
		assert.deepStrictEqual(['a', 'b', 'c'], getArgList(
			`function(a,
				b,
				c
				) { return 3; }`));
	});

	it('extracts arg list from yet another untyped multi-line function', function() {
		assert.deepStrictEqual(['a', 'b', 'c'], getArgList(
			`function(
				a,
				b,
				c
				) { return 3; }`));
	});
});
