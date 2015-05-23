"use strong";
"use strict";

function parseTypeComment(s) {
	const match = s.match(/\/*:(.+)\*\//, "$1");
	let type;
	if(match) {
		type = match[1];
		s = s.split('/')[0];
	} else {
		type = null;
	}
	return [s, type];
}

function getTypeStrings(fn) {
	const source = fn.toString();
	const argString = source.replace(/function ?\(([^\)]*)\).*/, "$1");
	let args;
	if(argString) {
		args = argString
			.split(",")
			.map(function(source) { return source.trim(); })
			.map(parseTypeComment);
	} else {
		args = [];
	}
	const ret = null;
	return {args, ret};
}

function T(fn) {

}

module.exports = {getTypeStrings};
