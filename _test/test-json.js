import * as fs from "fs";

import {Um, JsonTester} from "5etools-utils";

const LOG_TAG = "JSON";
const _IS_FAIL_SLOW = !!process.env.FAIL_SLOW;

async function main () {
	const {errors, errorsFull} = await new JsonTester({dirSchema: "_schema", tagLog: LOG_TAG})
		.pGetErrorsOnDirsWorkers({isFailFast: !_IS_FAIL_SLOW});

	if (errors.length) {
		if (!process.env.CI) fs.writeFileSync(`_test/test-json.error.log`, errorsFull.join("\n\n=====\n\n"));
		console.error(`Schema test failed (${errors.length} failure${errors.length === 1 ? "" : "s"}).`);
		process.exit(1);
	}

	if (!errors.length) Um.info(LOG_TAG, `Schema test passed.`);
}

main();
