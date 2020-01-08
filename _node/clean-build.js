// Adapted from 5etools `clean-jsons.js`
// ===
"use strict";

const fs = require("fs");
const uf = require("./util-fs");
const um = require("./util-misc");
const ub = require("./util-brew");

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

const RUN_TIMESTAMP = Math.floor(Date.now() / 1000);
const MAX_TIMESTAMP = 9999999999;

function cleanFolder (folder) {
	const files = uf.listFiles(folder);
	files
		.map(file => ({
			name: file,
			contents: uf.readJSON(file)
		}))
		.map(file => {
			if (!ub.FILES_NO_META[file.name]) {
				// Ensure _meta is at the top of the file
				const tmp = {$schema: file.contents.$schema, _meta: file.contents._meta};
				delete file.contents.$schema;
				delete file.contents._meta;
				Object.assign(tmp, file.contents);
				file.contents = tmp;

				if (file.contents._meta.dateAdded == null) {
					um.warn(`TIMESTAMPS`, `\tFile "${file.name}" did not have "dateAdded"! Adding one...`);
					file.contents._meta.dateAdded = RUN_TIMESTAMP;
				} else if (file.contents._meta.dateAdded > MAX_TIMESTAMP) {
					um.warn(`TIMESTAMPS`, `\tFile "${file.name}" had a "dateAdded" in milliseconds! Converting to seconds...`);
					file.contents._meta.dateAdded = file.contents._meta.dateAdded / 1000;
				}
			}
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
