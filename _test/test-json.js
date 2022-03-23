const fs = require("fs");
const path = require("path");

const jsonSourceMap = require("json-source-map");

const uf = require("../_node/util-fs.js");
const um = require("../_node/util-misc.js");

const _IS_SORT_RESULTS = !process.env.VET_TEST_JSON_RESULTS_UNSORTED;
const _IS_TRIM_RESULTS = !process.env.VET_TEST_JSON_RESULTS_UNTRIMMED;

const LOG_TAG = "JSON";
const DIR_SCHEMA = "_schema";

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
function _addImplicits (obj, lastKey) {
	if (typeof obj !== "object") return;
	if (obj == null) return;
	if (obj instanceof Array) obj.forEach(it => _addImplicits(it, lastKey));
	else {
		// "obj.mode" will be set if this is in a "_copy" etc. block
		if (lastKey === "spellcasting" && !obj.mode) obj.type = obj.type || "spellcasting";

		Object.entries(obj).forEach(([k, v]) => _addImplicits(v, k));
	}
}

function _getFileErrors ({filePath}) { return `${filePath}\n${JSON.stringify(ajv.errors, null, 2)}`; }

function _handleError ({filePath, errors, errorsFull, data}) {
	if (!process.env.CI) errorsFull.push(_getFileErrors({filePath}));

	// Sort the deepest errors to the bottom, as these are the ones we're most likely to be the ones we care about
	//   manually checking.
	if (_IS_SORT_RESULTS) {
		ajv.errors.sort((a, b) => (a.instancePath.length ?? -1) - (b.instancePath.length ?? -1));
	}

	// If there are an excessive number of errors, it's probably a junk entry; show only the first error and let the
	//   user figure it out.
	if (_IS_TRIM_RESULTS && ajv.errors.length > 5) {
		console.error(`(${ajv.errors.length} errors found, showing (hopefully) most-relevant one)`);
		ajv.errors = ajv.errors.slice(-1);
	}

	// Add line numbers
	const sourceMap = jsonSourceMap.stringify(data, null, "\t");
	ajv.errors.forEach(it => {
		const errorPointer = sourceMap.pointers[it.instancePath];
		it.lineNumberStart = errorPointer.value.line;
		it.lineNumberEnd = errorPointer.valueEnd.line;
	});

	const error = _getFileErrors({filePath});
	um.error(LOG_TAG, error);
	errors.push(error)
}

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
	const errorsFull = [];

	uf.runOnDirs((dir) => {
		uf.listJsonFiles(dir)
			.forEach(filePath => {
				const data = uf.readJSON(filePath);
				_addImplicits(data);
				const valid = ajv.validate("homebrew.json", data);

				if (!valid) _handleError({filePath, errors, errorsFull, data});
			});
	});

	if (errors.length) {
		if (!process.env.CI) fs.writeFileSync(`_test/test-json.error.log`, errorsFull.join("\n\n=====\n\n"));
		console.error(`Schema test failed (${errors.length} failure${errors.length === 1 ? "" : "s"}).`);
		process.exit(1);
	}

	if (!errors.length) um.info(LOG_TAG, `Schema test passed.`);
}

module.exports = main();
