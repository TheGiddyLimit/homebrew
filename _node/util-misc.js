function _taggedConsole (fn, tag, ...args) {
	const expandedTag = tag.padStart(12, " ");
	fn(`[${expandedTag}]`, ...args);
}

function warn (tag, ...args) {
	_taggedConsole(console.warn, tag, ...args);
}

function info (tag, ...args) {
	_taggedConsole(console.info, tag, ...args);
}

function error (tag, ...args) {
	_taggedConsole(console.error, tag, ...args);
}

module.exports = {
	warn,
	info,
	error
};
