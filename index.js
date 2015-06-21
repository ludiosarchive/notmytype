"use strong";
"use strict";

const assert = require('./assert');

const ordinals = [
	"first", "second", "third", "fourth", "fifth", "sixth",
	"seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"
];

function ordinalize(idx, noun) {
	return ordinals[idx] ?
		`${ordinals[idx]} ${noun}` :
		`${noun} #${idx + 1}`;
}

function capitalize(s) {
	return s[0].toUpperCase() + s.slice(1);
}

/**
 * Use like T(var1, T.number, var2, T.optional(T.string));
 */
function T(...args) {
	if(args.length % 2 !== 0) {
		throw new TypeError(
			`T(...) requires an even number of arguments; got ${args.length}`
		);
	}
	for(let i=0; i < args.length; i+=2) {
		const val = args[i];
		const asserter = args[i + 1];
		const errors = assert.validate(val, asserter);
		if(errors) {
			const message = [].concat(errors).join('\n');
			throw new TypeError(`${capitalize(ordinalize(i/2, "object"))}: ${message}`);
		}
	}
}

T.any = assert.any;
T.mixed = assert.mixed;
T.void = assert.void;
T.number = assert.number;
T.string = assert.string;
T.boolean = assert.boolean;
T.object = assert.object;
T.function = assert.function;
T.symbol = assert.symbol;
T.list = assert.list;
T.optional = assert.optional;
T.maybe = assert.maybe;
T.tuple = assert.tuple;
T.dict = assert.dict;
T.shape = assert.shape;
T.union = assert.union;

module.exports = T;
