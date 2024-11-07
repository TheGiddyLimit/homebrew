import fs from "fs";
import {DataTester, BraceCheck, EscapeCharacterCheck} from "5etools-utils";
import * as Uf from "5etools-utils/lib/UtilFs.js";
import {ImageUrlCheck} from "./test-file-contents/ImageUrlCheck.js";
import {CopySourceCheck} from "./test-file-contents/CopySourceCheck.js";

const TIME_TAG = "\tRun duration";
console.time(TIME_TAG);

async function main () {
	const ClazzDataTesters = [
		BraceCheck,
		EscapeCharacterCheck,
		ImageUrlCheck,
		CopySourceCheck,
	];
	DataTester.register({ClazzDataTesters});

	await Uf.pRunOnDirs(
		async (dir) => {
			console.log(`Running on directory "${dir}"...`);
			await DataTester.pRun(
				dir,
				ClazzDataTesters,
			);
		},
		{
			isSerial: true,
		},
	);

	const outMessage = DataTester.getLogReport(ClazzDataTesters);

	if (outMessage) fs.writeFileSync("./_test/test-data.error.log", outMessage, "utf-8");

	console.timeEnd(TIME_TAG);

	if (outMessage) process.exit(1);
}

export default main();
