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
			.map(function(source) { return source.trim(); })
			.map(parseTypeComment);
	} else {
		args = [];
	}

	const ret = retMatch ? retMatch[1].trim() : null;
	return {args, ret};
}

function T(fn) {

}

module.exports = {getTypeStrings};
