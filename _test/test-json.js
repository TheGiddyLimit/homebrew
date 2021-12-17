const fs = require("fs");
const path = require("path");

const uf = require("../_node/util-fs.js");
const um = require("../_node/util-misc.js");

// region Set up validator
const Ajv = require("ajv");

const ajv = new Ajv({
	allowUnionTypes: true,
});

ajv.addKeyword({
	keyword: "version",
	validate: false,
});

const DATE_REGEX = /^\d\d\d\d-\d\d-\d\d$/;
ajv.addFormat(
	"date",
	{
		validate: (str) => DATE_REGEX.test(str),
	},
);
// endregion

// add any implicit data to the JSON
function addImplicits (obj, lastKey) {
	if (typeof obj !== "object") return;
	if (obj == null) return;
	if (obj instanceof Array) obj.forEach(it => addImplicits(it, lastKey));
	else {
		// "obj.mode" will be set if this is in a "_copy" etc. block
		if (lastKey === "spellcasting" && !obj.mode) obj.type = obj.type || "spellcasting";

		Object.entries(obj).forEach(([k, v]) => addImplicits(v, k));
	}
}

const LOG_TAG = "JSON";
const DIR_SCHEMA = "_schema";

async function main () {
	um.info(LOG_TAG, `Validating JSON against schema`);

	uf.listJsonFiles(DIR_SCHEMA)
		.forEach(filePath => {
			filePath = path.normalize(filePath);
			const contents = uf.readJSON(filePath);

			const relativeFilePath = path.relative(DIR_SCHEMA, filePath)
				.replace(/\\/g, "/");

			ajv.addSchema(contents, relativeFilePath);
		});

	const errors = [];

	uf.runOnDirs((dir) => {
		uf.listJsonFiles(dir)
			.forEach(path => {
				const data = uf.readJSON(path);
				addImplicits(data);
				const valid = ajv.validate("homebrew.json", data);

				if (!valid) {
					const error = `${path}\n${JSON.stringify(ajv.errors, null, 2)}`;
					um.error(LOG_TAG, error);
					errors.push(error)
				}
			});
	});

	if (errors.length) {
		const msg = `Schema test failed (${errors.length} failure${errors.length === 1 ? "" : "s"}).`;
		if (!process.env.CI) {
			fs.writeFileSync(`_test/test-json.error.log`, errors.join("\n\n=====\n\n"));
		}
		throw new Error(msg);
	}

	if (!errors.length) um.info(LOG_TAG, `Schema test passed.`);
}

module.exports = main();
