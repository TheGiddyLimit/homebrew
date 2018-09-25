// Adapted from 5etools `clean-jsons.js`
// ===
"use strict";

const fs = require("fs");

const RUN_TIMESTAMP = (new Date).getTime();
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
			if (!file.contents._meta && !NO_META[file.name]) {
				throw new Error(`File "${file.name}" did not have metadata!`);
			}
			if (!NO_META[file.name] && !file.contents._meta.dateAdded) {
				console.warn(`\tFile "${file.name}" did not have "dateAdded", adding one...`);
				file.contents._meta.dateAdded = RUN_TIMESTAMP;
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
