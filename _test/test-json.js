import * as fs from "fs";

import {Um, JsonTester} from "5etools-utils";

const LOG_TAG = "JSON";

function main () {
	const {errors, errorsFull} = new JsonTester({dirSchema: "_schema", tagLog: LOG_TAG}).getErrorsOnDirs();

	if (errors.length) {
		if (!process.env.CI) fs.writeFileSync(`_test/test-json.error.log`, errorsFull.join("\n\n=====\n\n"));
		console.error(`Schema test failed (${errors.length} failure${errors.length === 1 ? "" : "s"}).`);
		process.exit(1);
	}

	if (!errors.length) Um.info(LOG_TAG, `Schema test passed.`);
}

main();
