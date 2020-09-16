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

const CONTENT_KEY_BLACKLIST = new Set(["$schema", "_meta"]);

function cleanFolder (folder) {
	const ALL_ERRORS = [];

	const files = uf.listFiles(folder);
	files
		.map(file => ({
			name: file,
			contents: uf.readJSON(file)
		}))
		.map(file => {
			if (!ub.FILES_NO_META[file.name]) {
				// region clean
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
					file.contents._meta.dateAdded = Math.round(file.contents._meta.dateAdded / 1000);
				}

				if (file.contents._meta.dateLastModified == null) {
					um.warn(`TIMESTAMPS`, `\tFile "${file.name}" did not have "dateLastModified"! Adding one...`);
					file.contents._meta.dateLastModified = RUN_TIMESTAMP;
				} else if (file.contents._meta.dateLastModified > MAX_TIMESTAMP) {
					um.warn(`TIMESTAMPS`, `\tFile "${file.name}" had a "dateLastModified" in milliseconds! Converting to seconds...`);
					file.contents._meta.dateLastModified = Math.round(file.contents._meta.dateLastModified / 1000);
				}

				(file.contents._meta.sources || []).forEach(source => {
					if (source.version != null) return;
					um.warn(`VERSION`, `\tFile "${file.name}" source "${source.json}" did not have "version"! Adding one...`);
					source.version = "unknown";
				});
				// endregion

				// region test
				const validSources = new Set(file.contents._meta.sources.map(src => src.json));
				validSources.add("UAClassFeatureVariants"); // Allow CFV UA sources

				Object.keys(file.contents)
					.filter(k => !CONTENT_KEY_BLACKLIST.has(k))
					.forEach(k => {
						const data = file.contents[k];

						data.forEach(it => {
							const source = it.source || (it.inherits ? it.inherits.source : null);
							if (!source) return ALL_ERRORS.push(`${file.name} :: ${k} :: "${it.name || it.id}" had no source!`);
							if (!validSources.has(source)) return ALL_ERRORS.push(`${file.name} :: ${k} :: "${it.name || it.id}" source "${source}" was not in _meta`);
						});
					});
				// endregion
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

	if (ALL_ERRORS.length) {
		ALL_ERRORS.forEach(e => console.error(e));
		throw new Error(`Errors were found. See above.`);
	}
}

uf.runOnDirs((dir) => {
	um.info(`CLEANER`, `Cleaning dir "${dir}"...`);
	cleanFolder(dir);
});

um.info(`CLEANER`, "Cleaning complete.");
