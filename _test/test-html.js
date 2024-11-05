import {BrewCleanerHtml} from "../_node/html-cleaner.js";
import {Um} from "5etools-utils";

const {messages, isUnknownError = false} = await BrewCleanerHtml.pGetErrorsOnDirsWorkers();

if (messages.length) {
	console.error(`HTML test failed (${messages.length} failure${messages.length === 1 ? "" : "s"}).`);
	process.exit(1);
}

if (isUnknownError) {
	console.error(`Unknown error when testing! (See above logs)`);
	process.exit(1);
}

if (!messages.length) Um.info("HTML", `HTML test passed.`);
