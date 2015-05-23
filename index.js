"use strong";
"use strict";

function getArgList(fn) {
	const source = fn.toString();
	const argString = source.replace(/function ?\(([^\)]*)\).*/, "$1");
	if(!argString) {
		return [];
	}
	const args = argString.split(",").map(function(source) { return source.trim(); });
	return args;
}

function T(fn) {

}

module.exports = {getArgList};
