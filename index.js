"use strong";
"use strict";

const assert = require('./assert');

const ordinals = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"];

function T(...args) {
	for(let i=0; i < args.length; i+=2) {
		const val = args[i];
		const asserter = args[i + 1];
		const errors = assert.validate(val, asserter);
		if(errors) {
			const message = [].concat(errors).join('\n');
			throw new TypeError(`${ordinals[i/2]} variable: ${message}`);
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
T.list = assert.list;
T.optional = assert.optional;
T.maybe = assert.maybe;
T.tuple = assert.tuple;
T.dict = assert.dict;
T.shape = assert.shape;
T.union = assert.union;

module.exports = T;
