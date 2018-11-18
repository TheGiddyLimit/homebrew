"use strict";

const fs = require("fs");
const uf = require("./util-fs");
const um = require("./util-misc");

function _ascSort (a, b) {
	return b === a ? 0 : b < a ? 1 : -1;
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
	const RUN_TIMESTAMP = Math.floor(Date.now() / 1000);
	const NO_META = {
		"collection/index.json": 1
	};
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
				const hasMeta = !NO_META[file.name];
				if (!file.contents._meta && hasMeta) {
					throw new Error(`File "${file.name}" did not have metadata!`);
				}
				if (hasMeta && file.contents._meta.dateAdded == null) {
					um.warn(`TIMESTAMPS`, `\tFile "${file.name}" did not have "dateAdded"!`);
					file.contents._meta.dateAdded = RUN_TIMESTAMP;
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
		console.log(`[DIRECTORY] Indexing dir "${dir}"...`);
		const dirContent = fs.readdirSync(dir, "utf8")
			.filter(file => file.endsWith(".json"))
			.map(file => `${dir}/${file}`);

		const dirFiles = dirContent.map(it => ({
			download_url: `https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/feat/${encodeURIComponent(it)}`
		}));

		fs.writeFileSync(`_generated/index-dir-${dir}.json`, JSON.stringify(dirFiles), "utf-8");
	});

	um.info(`DIRECTORY`, `Complete.`);
}

buildCollectionIndex();
buildTimestampIndex();
buildDirIndex();
um.info(`INDEX`, `Complete.`);
