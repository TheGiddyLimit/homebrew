"use strict";

const fs = require("fs");
const uf = require("./util-fs");
const um = require("./util-misc");
const ub = require("./util-brew");

function _ascSort (a, b) {
	return b === a ? 0 : b < a ? 1 : -1;
}

function checkFileContents () {
	const DIR_TO_PRIMARY_PROP = {
		"creature": [
			"monster"
		],
		"book": [
			"book",
			"bookData"
		],
		"adventure": [
			"adventure",
			"adventureData"
		],
		"magicvariant": [
			"variant"
		]
	};

	um.info(`PROP_CHECK`, `Checking file contents...`);
	const results = [];
	uf.runOnDirs((dir) => {
		if (dir === "collection") return;

		um.info(`PROP_CHECK`, `Checking dir "${dir}"...`);
		const dirFiles = fs.readdirSync(dir, "utf8")
			.filter(file => file.endsWith(".json"));

		dirFiles.forEach(file => {
			const json = JSON.parse(fs.readFileSync(`${dir}/${file}`, "utf-8"));
			const props = DIR_TO_PRIMARY_PROP[dir] || [dir];
			props.forEach(prop => {
				if (!json[prop]) results.push(`${dir}/${file} was missing a "${prop}" property!`);
			});
		})
	});

	if (results.length) {
		results.forEach(r => um.error(`PROP_CHECK`, r));
		throw new Error(`${results.length} file${results.length === 1 ? " was missing a primary prop!" : "s were missing primary props!"} See above for more info.`)
	}

	um.info(`PROP_CHECK`, `Complete.`);
}

function buildCollectionIndex () {
	um.info(`COLLECTIONS`, `Indexing...`);
	const DIR_COLLECTION = "collection";
	const FILE_INDEX = "index.json";

	const outIndex = {};
	fs.readdirSync(DIR_COLLECTION, "utf8")
		.filter(file => file !== FILE_INDEX)
		.forEach(file => {
			const data = JSON.parse(fs.readFileSync(`${DIR_COLLECTION}/${file}`, "utf8"));
			outIndex[file] = Object.keys(data).filter(it => !it.startsWith("_")).sort(_ascSort);
		});

	fs.writeFileSync(`${DIR_COLLECTION}/${FILE_INDEX}`, JSON.stringify(outIndex, null, "\t") + "\n");
	um.info(`COLLECTIONS`, `Complete.`);
}

function buildTimestampIndex () {
	um.info(`TIMESTAMPS`, `Indexing...`);
	const TIMESTAMP_PATH = "_generated/index-timestamps.json";

	const timestampIndex = {};

	function indexDir (folder) {
		const files = uf.listFiles(folder);
		files
			.map(file => ({
				name: file,
				contents: uf.readJSON(file)
			}))
			.forEach(file => {
				const hasMeta = !ub.FILES_NO_META[file.name];
				if (!file.contents._meta && hasMeta) {
					throw new Error(`File "${file.name}" did not have metadata!`);
				}
				if (hasMeta) {
					timestampIndex[file.name] = file.contents._meta.dateAdded;
				}
			});
	}

	uf.runOnDirs((dir) => {
		um.info(`TIMESTAMPS`, `Indexing dir "${dir}"...`);
		indexDir(dir);
	});

	um.info(`TIMESTAMPS`, `Saving timestamp index to ${TIMESTAMP_PATH}`);
	fs.writeFileSync(`./${TIMESTAMP_PATH}`, JSON.stringify(timestampIndex), "utf-8");
}

function buildDirIndex () {
	um.info(`DIRECTORY`, `Indexing...`);

	uf.runOnDirs((dir) => {
		um.info(`DIRECTORY`, `Indexing dir "${dir}"...`);
		const dirContent = fs.readdirSync(dir, "utf8")
			.filter(file => file.endsWith(".json"));

		const dirFiles = dirContent.map(it => ({
			download_url: `https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/${dir}/${encodeURIComponent(it)}`,
			path: `${dir}/${it}`,
			name: it
		}));

		fs.writeFileSync(`_generated/index-dir-${dir}.json`, JSON.stringify(dirFiles), "utf-8");
	});

	um.info(`DIRECTORY`, `Complete.`);
}

checkFileContents();
buildCollectionIndex();
buildTimestampIndex();
buildDirIndex();
um.info(`INDEX`, `Complete.`);
