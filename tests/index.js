"use strong";
"use strict";

const assert = require('assert');

const superfn = require('..');
const getTypeStrings = superfn.getTypeStrings;
const T = superfn.T;

describe('getTypeStrings', function() {
	it('extracts arg list from untyped function', function() {
		assert.deepStrictEqual(
			{args: [['a', null], ['b', null]], ret: null},
			getTypeStrings('function(a, b) { return 3; }'));
	});

	it('extracts arg list from untyped named function', function() {
		assert.deepStrictEqual(
			{args: [['a', null], ['b', null]], ret: null},
			getTypeStrings('function name(a, b) { return 3; }'));
	});

	it('extracts arg list from untyped 1-arg function', function() {
		assert.deepStrictEqual({args: [['a', null]], ret: null}, getTypeStrings('function(a) { return 3; }'));
	});

	it('extracts arg list from untyped 0-arg function', function() {
		assert.deepStrictEqual({args: [], ret: null}, getTypeStrings('function() { return 3; }'));
	});

	it('extracts arg list from untyped multi-line function', function() {
		assert.deepStrictEqual(
			{args: [['a', null], ['b', null], ['c', null]], ret: null},
			getTypeStrings(
				`function(a,
					b,
					c) { return 3; }`));
	});

	it('extracts arg list from another untyped multi-line function', function() {
		assert.deepStrictEqual(
			{args: [['a', null], ['b', null], ['c', null]], ret: null},
			getTypeStrings(
				`function(a,
					b,
					c
					) { return 3; }`));
	});

	it('extracts arg list from yet another untyped multi-line function', function() {
		assert.deepStrictEqual(
			{args: [['a', null], ['b', null], ['c', null]], ret: null},
			getTypeStrings(
				`function(
					a,
					b,
					c
					) { return 3; }`));
	});

	it('extracts arg list from a typed function', function() {
		assert.deepStrictEqual(
			{args: [['a', 'number'], ['b', 'boolean']], ret: 'string'},
			getTypeStrings('function(a/*:number*/, b/*:boolean*/)/*:string*/ { return 3; }'));
	});

	it('extracts arg list from a typed named function', function() {
		assert.deepStrictEqual(
			{args: [['a', 'number'], ['b', 'boolean']], ret: 'string'},
			getTypeStrings('function name(a/*:number*/, b/*:boolean*/)/*:string*/ { return 3; }'));
	});

	it('extracts arg list from a typed named function with strange whitespace', function() {
		assert.deepStrictEqual(
			{args: [['a', 'number'], ['b', 'boolean']], ret: 'string'},
			getTypeStrings('function name(a /* : number */, b /*\t:\tboolean\t*/)\t\n/*\t\n:\t\nstring\t\n*/\n{ return 3; }'));
	});
});

describe('T', function() {
	it('wraps fn to throw TypeError when invalid argument type is given', function() {
		const fn = T(function(a/*:string*/, b) { return b; });
		fn("a", 3);
		assert.throws(function() { fn(5, 3); }, /must be a string/);
	});
});
