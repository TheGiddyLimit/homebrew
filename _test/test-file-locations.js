import * as fs from "fs";
import {Um} from "5etools-utils";

const _ROOT_JSON_FILES = new Set([
	"package.json",
	"package-lock.json",
]);

const _LOG_TAG = `FILES_ROOT`;

function testNoFilesInRoot () {
	Um.info(_LOG_TAG, `Testing for unwanted JSON files in root dir...`);

	const errors = fs.readdirSync(".", "utf8")
		.filter(it => it.toLowerCase().endsWith(".json") && !_ROOT_JSON_FILES.has(it))
		.map(it => `Unwanted JSON file in root directory: ${it}`);

	if (!errors.length) return Um.info(_LOG_TAG, `No unwanted JSON files found.`);

	errors.forEach(it => console.error(it));
	process.exit(1);
}

testNoFilesInRoot();
