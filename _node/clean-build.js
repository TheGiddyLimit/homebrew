// Adapted from 5etools `clean-jsons.js`
// ===
"use strict";

const fs = require("fs");
const uf = require("./util-fs");
const um = require("./util-misc");

const REPLACEMENTS = {
	"—": "\\u2014",
	"–": "\\u2013",
	"−": "\\u2212",
	"’": "'",
	"“": '\\"',
	"”": '\\"',
	"…": "..."
};

const replacementRegex = new RegExp(Object.keys(REPLACEMENTS).join("|"), 'g');

function cleanFolder (folder) {
	const files = uf.listFiles(folder);
	files
		.map(file => ({
			name: file,
			contents: uf.readJSON(file)
		}))
		.map(file => {
			file.contents = JSON.stringify(file.contents, null, "\t") + "\n";
			return file;
		})
		.map(file => {
			um.info(`CLEANER`, `\t- "${file.name}"...`);
			file.contents = file.contents.replace(replacementRegex, (match) => REPLACEMENTS[match]);
			return file;
		})
		.forEach(file => {
			fs.writeFileSync(file.name, file.contents);
		});
}

uf.runOnDirs((dir) => {
	um.info(`CLEANER`, `Cleaning dir "${dir}"...`);
	cleanFolder(dir);
});

um.info(`CLEANER`, "Cleaning complete.");
