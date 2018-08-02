"use strict";

const fs = require("fs");

const DIR_COLLECTION = "collection";
const FILE_INDEX = "index.json";

const outIndex = {};
fs.readdirSync(DIR_COLLECTION, "utf8")
	.filter(file => file !== FILE_INDEX)
	.forEach(file => {
		const data = JSON.parse(fs.readFileSync(`${DIR_COLLECTION}/${file}`, "utf8"));
		outIndex[file] = Object.keys(data).filter(it => !it.startsWith("_"));
	});
fs.writeFileSync(`${DIR_COLLECTION}/${FILE_INDEX}`, JSON.stringify(outIndex, null, "\t") + "\n");

console.log("Indexing complete.");
