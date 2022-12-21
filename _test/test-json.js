import * as fs from "fs";
import {Command} from "commander";

import {Um, JsonTester} from "5etools-utils";

const LOG_TAG = "JSON";
const _IS_FAIL_SLOW = !!process.env.FAIL_SLOW;

const program = new Command()
	.argument("[file]", "File to test")
;

program.parse(process.argv);


async function main () {
	const jsonTester = new JsonTester({isBrew: true, tagLog: LOG_TAG, fnGetSchemaId: () => "homebrew.json"});

	let results;
	if (program.args[0]) {
		results = jsonTester.getFileErrors({filePath: program.args[0]});
	} else {
		results = await jsonTester.pGetErrorsOnDirsWorkers({isFailFast: !_IS_FAIL_SLOW})
	}

	const {errors, errorsFull} = results;

	if (errors.length) {
		if (!process.env.CI) fs.writeFileSync(`_test/test-json.error.log`, errorsFull.join("\n\n=====\n\n"));
		console.error(`Schema test failed (${errors.length} failure${errors.length === 1 ? "" : "s"}).`);
		process.exit(1);
	}

	if (!errors.length) Um.info(LOG_TAG, `Schema test passed.`);
}

main();
