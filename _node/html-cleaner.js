import {getCleanJson, ObjectWalker, Uf, Um} from "5etools-utils";
import he from "he";
import sanitizeHtml from "sanitize-html";
import fs from "fs";
import os from "os";
import path from "path";
import url from "url";
import {Worker} from "worker_threads";
import {Deferred, WorkerList} from "5etools-utils/lib/WorkerList.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export class BrewCleanerHtml {
	static _LOG_TAG = `HTML`;

	static _OPTS_SANITIZE = {
		allowedTags: [
			// region Custom things which look like tags
			"<$name$>",
			// endregion
		],
		allowedAttributes: {},
	};

	static _getCleanFileMeta ({file}) {
		const fileData = Uf.readJsonSync(file);

		const messages = [];

		const {_meta, _test} = fileData;
		delete fileData._meta;
		delete fileData._test;

		const fileOut = ObjectWalker.walk({
			obj: fileData,
			filePath: file,
			primitiveHandlers: {
				string: (str, {filePath}) => {
					const clean = he.unescape(
						sanitizeHtml(
							str,
							this._OPTS_SANITIZE,
						),
					);

					if (clean !== str) {
						const msg = `Sanitized:\n${str}\n${clean}`;
						messages.push(msg);
						Um.info(this._LOG_TAG, msg);
					}

					return clean;
				}
			},
			isModify: true,
		});

		const out = {$schema: fileOut.$schema, _meta, _test};
		Object.assign(out, fileOut);

		return {
			messages,
			out,
		};
	}

	static async _pUpdateDir (dir) {
		Uf.listJsonFiles(dir)
			.forEach(file => {
				const {messages, out} = this._getCleanFileMeta({file})
				if (!messages?.length) return;

				messages.forEach(msg => Um.info(this._LOG_TAG, msg));

				fs.writeFileSync(file, getCleanJson(out));
			});
	}

	static async pRun () {
		await Uf.pRunOnDirs(
			async (dir) => {
				Um.info(this._LOG_TAG, `Sanitizing HTML in dir "${dir}"...`);
				await this._pUpdateDir(dir);
			},
			{
				isSerial: true,
			},
		);
		Um.info(this._LOG_TAG, "Done!");
	}

	static getFileMessages ({file}) {
		return this._getCleanFileMeta({file});
	}

	static async pGetErrorsOnDirsWorkers ({isFailFast = false} = {}) {
		Um.info(this._LOG_TAG, `Testing for HTML...`);

		const cntWorkers = Math.max(1, os.cpus().length - 1);

		const messages = [];

		const fileQueue = [];
		Uf.runOnDirs((dir) => fileQueue.push(...Uf.listJsonFiles(dir)));

		const workerList = new WorkerList();

		let cntFailures = 0;
		const workers = [...new Array(cntWorkers)]
			.map(() => {
				// Relative `Worker` paths do not function in packages, so give an exact path
				const worker = new Worker(path.join(__dirname, "html-cleaner-test-worker"));

				worker.on("message", (msg) => {
					switch (msg.type) {
						case "ready":
						case "done": {
							if (msg.payload.isError) {
								messages.push(...msg.payload.messages);

								if (isFailFast) workers.forEach(worker => worker.postMessage({type: "cancel"}));
							}

							if (worker.dIsActive) worker.dIsActive.resolve();
							workerList.add(worker);

							break;
						}
					}
				});

				worker.on("error", e => {
					console.error(e);
					cntFailures++;
				});

				worker.postMessage({
					type: "init",
					payload: {},
				});

				return worker;
			});

		while (fileQueue.length) {
			if (isFailFast && messages.length) break;

			const file = fileQueue.shift();
			const worker = await workerList.get();

			worker.dIsActive = new Deferred();
			worker.postMessage({
				type: "work",
				payload: {
					file,
				},
			});
		}

		await Promise.all(workers.map(it => it.dIsActive?.promise));
		await Promise.all(workers.map(it => it.terminate()));

		return {messages, isUnknownError: !!cntFailures};
	}
}
