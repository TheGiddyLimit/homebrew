const fs = require("fs");

const filename = process.argv[2];
if (!filename) throw new Error(`Usage: "node character-checker path-to-file"`);

function charInRange (c, code) {
	if (code === 9) return; //tab
	if (code === 10) return; // newline
	if (code < 32 || code > 126) {
		console.warn(c, code);
	}
}

const data = fs.readFileSync(filename, "utf-8");
const len = data.length;
for (let i = 0; i < len; ++i) {
	charInRange(data[i], data.charCodeAt(i));
}
