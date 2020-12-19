const uf = require("../_node/util-fs.js");
const um = require("../_node/util-misc.js");

const Ajv = require("ajv");

const ajv = new Ajv();

const LOG_TAG = "JSON";

async function main () {
	um.info(LOG_TAG, `Validating JSON against schema`);

	const schema = uf.readJSON("schema.json");
	ajv.addSchema(schema, "schema.json");

	let cntErr = 0;

	uf.runOnDirs((dir) => {
		uf.listFiles(dir)
			.forEach(path => {
				const data = uf.readJSON(path);
				const valid = ajv.validate(schema, data);

				if (!valid) {
					um.error(LOG_TAG, `${path}\n${JSON.stringify(ajv.errors, null, 2)}`);
					cntErr++;
				}
			});
	});

	if (cntErr) throw new Error(`Schema test failed (${cntErr} failure${cntErr === 1 ? "" : "s"}).`);

	um.info(LOG_TAG, `Schema test passed.`);
}

module.exports = main();
