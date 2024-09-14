import {isMainThread, parentPort} from "worker_threads";
import {BrewCleanerHtml} from "./html-cleaner.js";

if (isMainThread) throw new Error(`Worker must not be started in main thread!`);

let isCancelled = false;

parentPort
	.on("message", async msg => {
		switch (msg.type) {
			case "init": {
				parentPort.postMessage({
					type: "ready",
					payload: {},
				});

				break;
			}

			case "cancel": {
				isCancelled = true;
				break;
			}

			case "work": {
				if (isCancelled) {
					parentPort.postMessage({
						type: "done",
						payload: {},
					});
					return;
				}

				const {messages = []} = BrewCleanerHtml.getFileMessages({file: msg.payload.file});

				parentPort.postMessage({
					type: "done",
					payload: {
						isError: !!messages.length,
						messages,
					},
				});

				break;
			}
		}
	});
