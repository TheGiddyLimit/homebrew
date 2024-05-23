import fs from "fs";

const _TIME_TAG = "\tRun duration";
const _ALLOWLIST_DIRS = new Set([
	// TODO dump from `_img` dir at freeze date
]);
const _ENABLE_AT = 1718539200000; // 16 June 2024 12:00:00 UTC

async function main () {
	if (Date.now() < _ENABLE_AT) {
		console.log("(Test not yet enabled)");
		return;
	}

	console.time(_TIME_TAG);

	const extraDirs = fs.readdirSync("_img")
		.filter(dir => !_ALLOWLIST_DIRS.has(dir));

	if (!extraDirs.length) {
		console.timeEnd(_TIME_TAG);
		return;
	}

	console.error(`Extra directories found in "_img":\n${extraDirs.map(d => `\t${d}`).join("\n")}`);
	console.timeEnd(_TIME_TAG);
	process.exit(1);
}

export default main();
