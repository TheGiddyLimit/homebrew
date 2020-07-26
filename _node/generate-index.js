"use strict";

const fs = require("fs");
const uf = require("./util-fs");
const um = require("./util-misc");
const ub = require("./util-brew");

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
		],
		"makebrew": [
			"makebrewCreatureTrait"
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

function buildDeepIndex () {
	um.info(`INDEX`, `Indexing...`);
	const TIMESTAMP_PATH = "_generated/index-timestamps.json";
	const PROP_PATH = "_generated/index-props.json";

	const timestampIndex = {};
	const propIndex = {};

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

				if (hasMeta && !file.contents._meta.unlisted) {
					// Index timestamps
					timestampIndex[file.name] = {a: file.contents._meta.dateAdded, m: file.contents._meta.dateLastModified};

					// Index props
					Object.keys(file.contents)
						.filter(it => !it.startsWith("_"))
						.forEach(k => {
							(propIndex[k] = propIndex[k] || {})[file.name] = folder;
						});
				}
			});
	}

	uf.runOnDirs((dir) => {
		um.info(`INDEX`, `Indexing dir "${dir}"...`);
		indexDir(dir);
	});

	um.info(`INDEX`, `Saving timestamp index to ${TIMESTAMP_PATH}`);
	fs.writeFileSync(`./${TIMESTAMP_PATH}`, JSON.stringify(timestampIndex), "utf-8");

	um.info(`INDEX`, `Saving prop index to ${PROP_PATH}`);
	fs.writeFileSync(`./${PROP_PATH}`, JSON.stringify(propIndex), "utf-8");
}

checkFileContents();
buildDeepIndex();
um.info(`INDEX`, `Complete.`);
