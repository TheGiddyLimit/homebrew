// Adapted from 5etools `clean-jsons.js`
// ===
"use strict";

const fs = require("fs");

const RUN_TIMESTAMP = Math.floor(Date.now() / 1000);
const REPLACEMENTS = {
	"—": "\\u2014",
	"–": "\\u2013",
	"−": "\\u2212",
	"’": "'",
	"“": '\\"',
	"”": '\\"',
	"…": "..."
};
const NO_META = {
	"collection/index.json": 1
};

const TIMESTAMP_PATH = "_generated/index-timestamps.json";

const timestampIndex = {};

function isDirectory (path) {
	return fs.lstatSync(path).isDirectory();
}

function readJSON (path) {
	try {
		return JSON.parse(fs.readFileSync(path, "utf8"));
	} catch (e) {
		e.message += ` (Path: ${path})`;
		throw e;
	}
}

function listFiles (dir) {
	const dirContent = fs.readdirSync(dir, "utf8")
		.filter(file => file.endsWith(".json"))
		.map(file => `${dir}/${file}`);
	return dirContent.reduce((acc, file) => {
		if (isDirectory(file)) {
			acc.push(...listFiles(file));
		} else {
			acc.push(file);
		}
		return acc;
	}, [])
}

const replacementRegex = new RegExp(Object.keys(REPLACEMENTS).join("|"), 'g');

function cleanFolder (folder) {
	const files = listFiles(folder);
	files
		.map(file => ({
			name: file,
			contents: readJSON(file)
		}))
		.map(file => {
			const hasMeta = !NO_META[file.name];
			if (!file.contents._meta && hasMeta) {
				throw new Error(`File "${file.name}" did not have metadata!`);
			}
			if (hasMeta && file.contents._meta.dateAdded == null) {
				console.warn(`\tFile "${file.name}" did not have "dateAdded", adding one...`);
				file.contents._meta.dateAdded = RUN_TIMESTAMP;
			}
			if (hasMeta) {
				timestampIndex[file.name] = file.contents._meta.dateAdded;
			}
			file.contents = JSON.stringify(file.contents, null, "\t") + "\n";
			return file;
		})
		.map(file => {
			console.log(`\t- "${file.name}"...`);
			file.contents = file.contents.replace(replacementRegex, (match) => {
				return REPLACEMENTS[match];
			});
			return file;
		})
		.forEach(file => {
			fs.writeFileSync(file.name, file.contents);
		});
}

fs.readdirSync(".", "utf8")
	.filter(dir => isDirectory(dir) && !dir.startsWith(".") && !dir.startsWith("_") && dir !== "node_modules")
	.forEach(it => {
		console.log(`Cleaning dir "${it}"...`);
		cleanFolder(it);
	});
console.log("Cleaning complete.");

console.log(`Saving timestamp index to ${TIMESTAMP_PATH}`);
fs.writeFileSync(`./${TIMESTAMP_PATH}`, JSON.stringify(timestampIndex), "utf-8");
