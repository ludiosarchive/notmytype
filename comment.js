"use strong";
"use strict";

const raw = String.raw;
const typeRe = new RegExp(raw`/\*\s*:(.+)\*/`);

function parseTypeComment(s) {
	const match = s.match(typeRe);
	let varname;
	let type;
	if(match) {
		varname = s.split('/')[0].trim();
		type = match[1].trim();
	} else {
		varname = s.trim();
		type = null;
	}
	return [varname, type];
}

const argRe = new RegExp(
	raw`function ?` +
	raw`( [^\(]*)?` + /* function name, if any */
	raw`\(([^\)]*)\).*` /* match argument list inside function(...) */
);

const retRe = new RegExp(
	raw`function ?` +
	raw`.*?\)\s*` + /* skip over function(...) */
	raw`/\*\s*:([^\*]+)\*/` /* match return type inside comment */
);

function getTypeStrings(fn) {
	const source = fn.toString();
	const argString = source.replace(argRe, "$2");
	const retMatch = source.match(retRe);

	let args;
	if(argString) {
		args = argString
			.split(",")
			.map(function(fragment) { return fragment.trim(); })
			.map(parseTypeComment);
	} else {
		args = [];
	}

	const ret = retMatch ? retMatch[1].trim() : null;
	return {args, ret};
}

const ordinals = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"];

function T(fn) {
	const typeStrings = getTypeStrings(fn);
	return function(...args) {
		let count = 0;
		for(let arg of typeStrings.args) {
			const argName = arg[0];
			const argType = arg[1];
			if(argType === 'string') {
				if(typeof args[count] !== 'string') {
					throw new TypeError(
						`${ordinals[count]} argument "${argName}" must be a ${argType}` +
						` but was ${typeof args[count]}`
					);
				}
			}
			count += 1;
		}
		const out = fn.apply(this, args);
		// TODO: check return type
		return out;
	};
}

module.exports = {getTypeStrings, T};
