/**
 * Copied from https://github.com/gcanti/flowcheck/blob/d442fd50ae46df620e1391d57b574eda73384626/src/assert.js
 * Types were commented out for syntax compatibility with ES6
 * Code formatting was tweaked
 * `validate` was exported
 */

// TODO: "use strong"; after V8 has ES6 default parameters
"use strict";

/*
type ValidationContext = Array<string | number>;
type ValidationFunction = (x: any, ctx?: ?ValidationContext, failOnFirstError?: boolean) => ?Array<Failure>;
type Predicate = (x: any) => boolean;
*/

const inspect = require('util').inspect;

function getFunctionName (f/*: any*/)/*: string*/ {
	return f.displayName || f.name || `<function${f.length}>`;
}

class Failure {
	constructor(actual/*: any*/, expected/*: Type*/, ctx/*: ?ValidationContext*/) {
		this.actual = actual;
		this.expected = expected;
		this.ctx = ctx;
	}

	toString()/*: string*/ {
		let ctx = this.ctx ? this.ctx.join(' / ') : '';
		ctx = ctx ? `context: ${ctx}` : '(no context)';
		return `Expected an instance of ${this.expected.name}; got ${inspect(this.actual)}, ${ctx}`;
	}
}

class Type {
	constructor(name/*: string*/, validate/*: ValidationFunction*/) {
		this.name = name;
		this.validate = validate;
	}

	is(x/*: any*/)/*: boolean*/ {
		return this.validate(x, null, true) === null;
	}

}

function define(name/*: string*/, is/*: Predicate*/)/*: Type*/ {
	let type;
	type = new Type(name, function(x, ctx) {
		return is(x) ? null : [new Failure(x, type, ctx)];
	});
	return type;
}

const Any = define('any', function() { return true; });

const Mixed = define('mixed', function() { return true; });

const Void = define('void', function(x) { return x === undefined; });

const Str = define('string', function(x) { return typeof x === 'string'; });

const Num = define('number', function(x) { return typeof x === 'number'; });

const Bool = define('boolean', function(x) { return x === true || x === false; });

const Arr = define('array', function(x) { return x instanceof Array; });

const Obj = define('object', function(x) { return x !== null && x !== undefined && typeof x === 'object' && !Arr.is(x); });

const Func = define('function', function(x) { return typeof x === 'function'; });

const Sym = define('function', function(x) { return typeof x === 'symbol'; });

function validate(x/*: any*/, type/*: any*/, ctx/*?: ?ValidationContext*/, failOnFirstError/*?: boolean*/) {
	if(type.validate) {
		return type.validate(x, ctx, failOnFirstError);
	}
	return x instanceof type ? null : [new Failure(x, type, ctx)];
}

function list(type/*: Type*/, name/*?: string*/)/*: Type*/ {
	name = name || `Array<${type.name}>`;
	return new Type(name, function(x, ctx, failOnFirstError) {
		ctx = ctx || [];
		ctx.push(name);
		// if x is not an array, fail fast
		if(!Arr.is(x)) {
			return [new Failure(x, Arr, ctx)];
		}
		let errors/*: ?Array<Failure>*/ = null;
		let suberrors/*: ?Array<Failure>*/;
		for(let i=0, len = x.length; i < len; i++) {
			suberrors = validate(x[i], type, ctx.concat(i));
			if(suberrors) {
				if(failOnFirstError) {
					return suberrors;
				}
				errors = errors || [];
				errors.push.apply(errors, suberrors);
			}
		}
		return errors;
	});
}

function optional(type/*: Type*/, name/*?: string*/)/*: Type*/ {
	name = name || `${type.name}?`;
	return new Type(name, function(x, ctx, failOnFirstError) {
		if(x === undefined) {
			return null;
		}
		ctx = ctx || [];
		ctx.push(name);
		return validate(x, type, ctx, failOnFirstError);
	});
}

function maybe(type/*: Type*/, name/*?: string*/)/*: Type*/ {
	name = name || `?${type.name}`;
	return new Type(name, function(x, ctx, failOnFirstError) {
		if(x === null) {
			return null;
		}
		ctx = ctx || [];
		ctx.push(name);
		return validate(x, type, ctx, failOnFirstError);
	});
}

function getName(type/*: Type*/)/*: string*/ {
	return type.name;
}

function tuple(types/*: Array<Type>*/, name/*?: string*/)/*: Type*/ {
	name = name || `[${types.map(getName).join(', ')}]`;
	const dimension = types.length;
	let type;
	type = new Type(name, function (x, ctx, failOnFirstError) {
		ctx = ctx || [];
		// if x is not an array, fail fast
		if(!Arr.is(x)) { return [new Failure(x, Arr, ctx.concat(name))]; }
		// if x has a wrong length, fail failOnFirstError
		if(x.length !== dimension) {
			return [new Failure(x, type, ctx)];
		}
		let errors/*: ?Array<Failure>*/ = null;
		let suberrors/*: ?Array<Failure>*/;
		for(let i=0; i < dimension; i++) {
			suberrors = validate(x[i], types[i], ctx.concat(name, i));
			if(suberrors) {
				if(failOnFirstError) {
					return suberrors;
				}
				errors = errors || [];
				errors.push.apply(errors, suberrors);
			}
		}
		return errors;
	});
	return type;
}

function dict(domain/*: Type*/, codomain/*: Type*/, name/*?: string*/)/*: Type*/ {
	name = name || `{[key: ${domain.name}]: ${codomain.name}}`;
	return new Type(name, function(x, ctx, failOnFirstError) {
		ctx = ctx || [];
		// if x is not an object, fail fast
		if(!Obj.is(x)) {
			return [new Failure(x, Obj, ctx.concat(name))];
		}
		let errors/*: ?Array<Failure>*/ = null;
		let suberrors/*: ?Array<Failure>*/;
		for(const k of Object.keys(x)) {
			if(x.hasOwnProperty(k)) {
				// check domain
				suberrors = validate(k, domain, ctx.concat(name, k));
				if(suberrors) {
					if(failOnFirstError) {
						return suberrors;
					}
					errors = errors || [];
					errors.push.apply(errors, suberrors);
				}
				// check codomain
				suberrors = validate(x[k], codomain, ctx.concat(name, k));
				if(suberrors) {
					if(failOnFirstError) {
						return suberrors;
					}
					errors = errors || [];
					errors.push.apply(errors, suberrors);
				}
			}
		}
		return errors;
	});
}

function shape(props/*: {[key: string]: Type;}*/, name/*?: string*/)/*: Type*/ {
	name = name || `{${Object.keys(props).map(function (k) { return k + ': ' + props[k].name + ';';}).join(' ')}}`;
	return new Type(name, function(x, ctx, failOnFirstError) {
		ctx = ctx || [];
		// if x is not an object, fail fast
		if(!Obj.is(x)) {
			return [new Failure(x, Obj, ctx.concat(name))];
		}
		let errors/*: ?Array<Failure>*/ = null;
		let suberrors/*: ?Array<Failure>*/;
		for(const k of Object.keys(props)) {
			if(props.hasOwnProperty(k)) {
				suberrors = validate(x[k], props[k], ctx.concat(name, k));
				if(suberrors) {
					if(failOnFirstError) {
						return suberrors;
					}
					errors = errors || [];
					errors.push.apply(errors, suberrors);
				}
			}
		}
		return errors;
	});
}

function union(types/*: Array<Type>*/, name/*?: string*/)/*: Type*/ {
	name = name || types.map(getName).join(' | ');
	let type;
	type = new Type(name, function(x, ctx) {
		ctx = (ctx || []).concat(name);
		if(types.some(function(type) {
			return validate(x, type, ctx, true) === null;
		})) {
			return null;
		}
		return [new Failure(x, type, ctx)];
	});
	return type;
}

function slice/*<T>*/(arr/*: Array<T>*/, start/*?: number*/, end/*?: number*/)/*: Array<T>*/ {
	return Array.prototype.slice.call(arr, start, end);
}

function args(types/*: Array<Type>*/, varargs/*?: Type*/)/*: Type*/ {
	const name = `(${types.map(getName).join(', ')}, ...${(varargs || Any).name})`;
	const length = types.length;
	const typesTuple = tuple(types);
	if(varargs) {
		varargs = list(varargs);
	}
	return new Type(name, function(x, ctx, failOnFirstError) {
		ctx = ctx || [];
		let args = x;
		// test if args is an array-like structure
		if(args.hasOwnProperty('length')) {
			args = slice(args, 0, length);
			// handle optional arguments filling the array with undefined values
			if(args.length < length) {
				args.length = length;
			}
		}
		let errors/*: ?Array<Failure>*/ = null;
		let suberrors/*: ?Array<Failure>*/;
		suberrors = typesTuple.validate(args, ctx.concat('arguments'), failOnFirstError);
		if(suberrors) {
			if(failOnFirstError) {
				return suberrors;
			}
			errors = errors || [];
			errors.push.apply(errors, suberrors);
		}
		if(varargs) {
			suberrors = varargs.validate(slice(x, length), ctx.concat('varargs'), failOnFirstError);
			if(suberrors) {
				if(failOnFirstError) {
					return suberrors;
				}
				errors = errors || [];
				errors.push.apply(errors, suberrors);
			}
		}
		return errors;
	});
}

function check/*<T>*/(x/*: T*/, type/*: Type*/)/*: T*/ {
	const errors = validate(x, type);
	if(errors) {
		const message = [].concat(errors).join('\n');
		throw new TypeError(message);
	}
	return x;
}

module.exports = {
	Failure,
	Type,
	define,
	any: Any,
	mixed: Mixed,
	'void': Void,
	number: Num,
	string: Str,
	'boolean': Bool,
	object: Obj,
	'function': Func,
	symbol: Sym,
	list,
	optional,
	maybe,
	tuple,
	dict,
	shape,
	union,
	arguments: args,
	validate,
	check
};
