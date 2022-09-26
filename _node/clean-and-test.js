// Adapted from 5etools `clean-jsons.js`
// ===

import * as fs from "fs";
import {Um, Uf} from "5etools-utils";
import * as Ub from "./util-brew.js";
import {VANILLA_SOURCES} from "./util-sources.js";

const _IS_FAIL_SLOW = !!process.env.FAIL_SLOW;
const _VANILLA_SOURCES = new Set(VANILLA_SOURCES);

const RUN_TIMESTAMP = Math.floor(Date.now() / 1000);
const MAX_TIMESTAMP = 9999999999;

const CONTENT_KEY_BLACKLIST = new Set(["$schema", "_meta", "siteVersion"]);

const RE_INVALID_WINDOWS_CHARS = /[<>:"/\\|?*]/g;

function cleanFolder (folder) {
	const ALL_ERRORS = [];

	const files = Uf.listJsonFiles(folder);
	for (const file of files) {
		let contents = Uf.readJSON(file);

		if (RE_INVALID_WINDOWS_CHARS.test(file.split("/").slice(1).join("/"))) {
			ALL_ERRORS.push(`${file} contained invalid characters!`);
			if (!_IS_FAIL_SLOW) break;
		}

		if (!file.endsWith(".json")) {
			ALL_ERRORS.push(`${file} had invalid extension! Should be ".json" (case-sensitive).`);
			if (!_IS_FAIL_SLOW) break;
		}

		if (!Ub.FILES_NO_META[file]) {
			// region clean
			// Ensure _meta is at the top of the file
			const tmp = {$schema: contents.$schema, _meta: contents._meta};
			delete contents.$schema;
			delete contents._meta;
			Object.assign(tmp, contents);
			contents = tmp;

			if (contents._meta.dateAdded == null) {
				Um.warn(`TIMESTAMPS`, `\tFile "${file}" did not have "dateAdded"! Adding one...`);
				contents._meta.dateAdded = RUN_TIMESTAMP;
			} else if (contents._meta.dateAdded > MAX_TIMESTAMP) {
				Um.warn(`TIMESTAMPS`, `\tFile "${file}" had a "dateAdded" in milliseconds! Converting to seconds...`);
				contents._meta.dateAdded = Math.round(contents._meta.dateAdded / 1000);
			}

			if (contents._meta.dateLastModified == null) {
				Um.warn(`TIMESTAMPS`, `\tFile "${file}" did not have "dateLastModified"! Adding one...`);
				contents._meta.dateLastModified = RUN_TIMESTAMP;
			} else if (contents._meta.dateLastModified > MAX_TIMESTAMP) {
				Um.warn(`TIMESTAMPS`, `\tFile "${file}" had a "dateLastModified" in milliseconds! Converting to seconds...`);
				contents._meta.dateLastModified = Math.round(contents._meta.dateLastModified / 1000);
			}

			(contents._meta.sources || []).forEach(source => {
				if (source.version != null) return;
				Um.warn(`VERSION`, `\tFile "${file}" source "${source.json}" did not have "version"! Adding one...`);
				source.version = "unknown";
			});
			// endregion

			// region test
			const validSources = new Set(contents._meta.sources.map(src => src.json));
			validSources.add("UAClassFeatureVariants"); // Allow CFV UA sources

			Object.keys(contents)
				.filter(k => !CONTENT_KEY_BLACKLIST.has(k))
				.forEach(k => {
					const data = contents[k];

					if (!(data instanceof Array) || !data.forEach) throw new Error(`File "${k}" data was not an array!`);

					if (!data.length) throw new Error(`File "${k}" array is empty!`);

					data.forEach(it => {
						const source = it.source || (it.inherits ? it.inherits.source : null);
						if (!source) return ALL_ERRORS.push(`${file} :: ${k} :: "${it.name || it.id}" had no source!`);
						if (!validSources.has(source) && !_VANILLA_SOURCES.has(source)) return ALL_ERRORS.push(`${file} :: ${k} :: "${it.name || it.id}" source "${source}" was not in _meta`);
					});
				});
			// endregion

			if (!_IS_FAIL_SLOW && ALL_ERRORS.length) break;
		}

		Um.info(`CLEANER`, `\t- "${file}"...`);
		contents = Ub.getCleanJson(contents);

		fs.writeFileSync(file, contents);
	}

	if (ALL_ERRORS.length) {
		ALL_ERRORS.forEach(e => console.error(e));
		throw new Error(`Errors were found. See above.`);
	}

	return files.length;
}

let totalFiles = 0;
Uf.runOnDirs((dir) => {
	Um.info(`CLEANER`, `Cleaning dir "${dir}"...`);
	totalFiles += cleanFolder(dir);
});

Um.info(`CLEANER`, `Cleaning complete. Cleaned ${totalFiles} file${totalFiles === 1 ? "" : "s"}.`);
