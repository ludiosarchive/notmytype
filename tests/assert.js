/**
 * Copied from https://github.com/gcanti/flowcheck/blob/d442fd50ae46df620e1391d57b574eda73384626/test/assert.js
 * Converted to mocha-style tests
 */

"use strong";
"use strict";

/* eslint-disable no-shadow */

const assert = require('assert');
const f = require('../assert');

describe('Failure.stringify', function() {
	it('should stringify numbers', function() {
		assert.strictEqual(
			f.Failure.stringify(1),
			'1'
		);
	});

	it('should stringify strings', function() {
		assert.strictEqual(
			f.Failure.stringify('a'),
			'"a"'
		);
	});

	it('should stringify booleans', function() {
		assert.strictEqual(
			f.Failure.stringify(true),
			'true'
		);
	});

	it('should stringify objects', function() {
		assert.strictEqual(
			f.Failure.stringify({a: 1}),
			'{\n  "a": 1\n}'
		);
	});

	it('should stringify arrays', function() {
		assert.strictEqual(
			f.Failure.stringify([1, 2, 3]),
			'[\n  1,\n  2,\n  3\n]'
		);
	});

	it('should stringify functions', function() {
		assert.strictEqual(
			f.Failure.stringify(Date),
			'"[Date, Function]"'
		);
	});

	it('should stringify regexps', function() {
		assert.strictEqual(
			f.Failure.stringify(/^a/),
			'"[/^a/, RegExp]"'
		);
	});
});

describe('symbol', function() {
	it('is() should return false if x is not a symbol', function() {
		assert.strictEqual(
			f.symbol.is('Symbol(a)'),
			false
		);
	});

	it('is() should return true if x is a symbol', function() {
		assert.strictEqual(
			f.symbol.is(Symbol('a')),
			true
		);
	});
});

describe('number', function() {
	it('is() should return false if x is not a number', function() {
		assert.strictEqual(
			f.number.is('a'),
			false
		);
	});

	it('validate() should fail if x is not a number', function() {
		assert.strictEqual(
			f.number.validate('a') + '',
			'Expected an instance of number; got "a", (no context)'
		);
	});

	it('validate() should succeed if x is a number', function() {
		assert.strictEqual(
			f.number.validate(1),
			null
		);
	});

	it('validate() should succeed if x is a NaN', function() {
		assert.strictEqual(
			f.number.validate(NaN),
			null
		);
	});

	it('validate() should succeed if x is Infinity', function() {
		assert.strictEqual(
			f.number.validate(Infinity),
			null
		);
	});
});

describe('list()', function() {
	it('should set a default name', function() {
		assert.strictEqual(
			f.list(f.number).name,
			'Array<number>'
		);
	});

	it('should set a specified name', function() {
		assert.strictEqual(
			f.list(f.number, 'MyList').name,
			'MyList'
		);
	});

	it('should fail if x is not an array', function() {
		assert.strictEqual(
			f.list(f.number).validate(1) + '',
			'Expected an instance of array; got 1, context: Array<number>'
		);
	});

	it('should fail if an element of x is not an instance of T', function() {
		assert.strictEqual(
			f.list(f.number).validate([1, 's']) + '',
			'Expected an instance of number; got "s", context: Array<number> / 1'
		);
	});

	it('should succeed if x is a list of T', function() {
		assert.strictEqual(
			f.list(f.number).validate([1, 2]),
			null
		);
	});
});

describe('optional()', function() {
	it('should fail if x is not an instance of T', function() {
		assert.strictEqual(
			f.optional(f.number).validate('s') + '',
			'Expected an instance of number; got "s", context: number?'
		);
	});

	it('should succeed if x is undefined', function() {
		assert.strictEqual(
			f.optional(f.number).validate(undefined),
			null
		);
	});
});

describe('maybe()', function() {
	it('should set a default name', function() {
		assert.strictEqual(
			f.maybe(f.number).name,
			'?number'
		);
	});

	it('should set a specified name', function() {
		assert.strictEqual(
			f.maybe(f.number, 'MyMaybe').name,
			'MyMaybe'
		);
	});

	it('should fail if x is not an instance of T', function() {
		assert.strictEqual(
			f.maybe(f.number).validate('s') + '',
			'Expected an instance of number; got "s", context: ?number'
		);
	});

	it('should succeed if x is null', function() {
		assert.strictEqual(
			f.maybe(f.number).validate(null),
			null
		);
	});

	it('should fail if x is undefined', function() {
		assert.strictEqual(
			f.maybe(f.number).validate(undefined) + '',
			'Expected an instance of number; got undefined, context: ?number'
		);
	});

	it('should succeed if x is an instance of T', function() {
		assert.strictEqual(
			f.maybe(f.number).validate(1),
			null
		);
	});
});

describe('tuple()', function() {
	it('should set a default name', function() {
		assert.strictEqual(
			f.tuple([f.string, f.number]).name,
			'[string, number]'
		);
	});

	it('should set a specified name', function() {
		assert.strictEqual(
			f.tuple([f.string, f.number], 'MyTuple').name,
			'MyTuple'
		);
	});

	it('should fail if x is not an array', function() {
		assert.strictEqual(
			f.tuple([f.string, f.number]).validate(1) + '',
			'Expected an instance of array; got 1, context: [string, number]'
		);
	});

	it('should fail if x is an array with wrong length', function() {
		assert.strictEqual(
			f.tuple([f.string, f.number]).validate(['s']) + '',
			'Expected an instance of [string, number]; got [\n  "s"\n], (no context)'
		);
	});

	it('should fail if the i-th coordinate of x is not an instance of T[i]', function() {
		assert.strictEqual(
			f.tuple([f.string, f.number]).validate([1, 2]) + '',
			'Expected an instance of string; got 1, context: [string, number] / 0'
		);
	});

	it('should succeed if x is an instance of T', function() {
		assert.strictEqual(
			f.tuple([f.string, f.number]).validate(['s', 1]),
			null
		);
	});
});

describe('dict()', function() {
	it('should set a default name', function() {
		assert.strictEqual(
			f.dict(f.string, f.number).name,
			'{[key: string]: number}'
		);
	});

	it('should set a specified name', function() {
		assert.strictEqual(
			f.dict(f.string, f.number, 'MyDict').name,
			'MyDict'
		);
	});

	it('should fail if x is not an object', function() {
		assert.strictEqual(
			f.dict(f.string, f.number).validate(1) + '',
			'Expected an instance of object; got 1, context: {[key: string]: number}'
		);
	});


	/* FIXME
	it('should fail if a key of x is not an instance of domain', function() {
		assert.strictEqual(
			f.dict(f.string, f.number).validate({}) + '',
			''
		);
	});
	*/

	it('should fail if a value of x is not an instance of codomain', function() {
		assert.strictEqual(
			f.dict(f.string, f.number).validate({a: 's'}) + '',
			'Expected an instance of number; got "s", context: {[key: string]: number} / a'
		);
	});

	it('should succeed if x is an instance of T', function() {
		assert.strictEqual(
			f.dict(f.string, f.number).validate({a: 1, b: 2}),
			null
		);
	});

});

describe('shape()', function() {
	it('should set a default name', function() {
		assert.strictEqual(
			f.shape({a: f.number, b: f.string}).name,
			'{a: number; b: string;}'
		);
	});

	it('should set a specified name', function() {
		assert.strictEqual(
			f.shape({a: f.number, b: f.string}, 'MyObject').name,
			'MyObject'
		);
	});

	it('should fail if x is not an object', function() {
		assert.strictEqual(
			f.shape({a: f.number, b: f.string}).validate(1) + '',
			'Expected an instance of object; got 1, context: {a: number; b: string;}'
		);
	});

	it('should fail if a key k of x is not an instance of T[k]', function() {
		assert.strictEqual(
			f.shape({a: f.number, b: f.string}).validate({a: 1, b: 2}) + '',
			'Expected an instance of string; got 2, context: {a: number; b: string;} / b'
		);
	});

	it('should fail if a key is not specified', function() {
		assert.strictEqual(
			f.shape({a: f.maybe(f.number)}).validate({}) + '',
			'Expected an instance of number; got undefined, context: {a: ?number;} / a / ?number'
		);
	});

	it('should succeed if x is an instance of T', function() {
		assert.strictEqual(
			f.shape({a: f.number, b: f.string}).validate({a: 1, b: 's'}),
			null
		);
	});

	it('should succeed if x owns an additional property', function() {
		assert.strictEqual(
			f.shape({a: f.number}).validate({a: 1, b: 's'}),
			null
		);
	});

});

describe('union()', function() {
	it('should set a default name', function() {
		assert.strictEqual(
			f.union([f.string, f.number]).name,
			'string | number'
		);
	});

	it('should set a specified name', function() {
		assert.strictEqual(
			f.union([f.string, f.number], 'MyUnion').name,
			'MyUnion'
		);
	});

	it('should fail if x is not an instance of T', function() {
		assert.strictEqual(
			f.union([f.string, f.number]).validate(false) + '',
			'Expected an instance of string | number; got false, context: string | number'
		);
	});

	it('should succeed if x is an instance of T', function() {
		assert.strictEqual(
			f.union([f.string, f.number]).validate(1),
			null
		);
	});

});

describe('arguments()', function() {
	it('should set a proper name when varargs is not specified', function() {
		assert.strictEqual(
			f.arguments([f.number, f.string]).name,
			'(number, string, ...any)'
		);
	});

	it('should set a proper name when varargs is specified', function() {
		assert.strictEqual(
			f.arguments([f.number, f.string], f.boolean).name,
			'(number, string, ...boolean)'
		);
	});

	it('should fail if x is not an instance of the arguments tuple', function() {

		assert.strictEqual(
			f.arguments([f.string, f.number]).validate(1) + '',
			'Expected an instance of array; got 1, context: arguments / [string, number]'
		);

		assert.strictEqual(
			f.arguments([f.string, f.number]).validate([]) + '',
			'Expected an instance of string; got undefined, context: arguments / [string, number] / 0,Expected an instance of number; got undefined, context: arguments / [string, number] / 1'
		);

		assert.strictEqual(
			f.arguments([f.string, f.number]).validate(['a']) + '',
			'Expected an instance of number; got undefined, context: arguments / [string, number] / 1'
		);
	});

	it('should succeed if x is an instance of the arguments tuple', function() {
		assert.strictEqual(
			f.arguments([f.string, f.number]).validate(['s', 1]),
			null
		);

		assert.strictEqual(
			f.arguments([f.string, f.number]).validate(['s', 1, 2]),
			null
		);

		assert.strictEqual(
			f.arguments([f.optional(f.number)]).validate([undefined]),
			null
		);

		assert.strictEqual(
			f.arguments([f.optional(f.number)]).validate([]),
			null
		);
	});

	it('should fail if x is not an instance of the varargs list', function() {
		assert.strictEqual(
			f.arguments([], f.string).validate([1]) + '',
			'Expected an instance of string; got 1, context: varargs / Array<string> / 0'
		);
	});

	it('should succeed if x is an instance of the varargs list', function() {
		assert.strictEqual(
			f.arguments([], f.string).validate(['a', 'b']),
			null
		);
	});
});
