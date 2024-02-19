import {ObjectWalker, Uf, Um, getCleanJson} from "5etools-utils";
import sanitizeHtml from 'sanitize-html';
import he from 'he';
import fs from "fs";

class BrewCleanerHtml {
	static _LOG_TAG = `HTML`;

	static _OPTS_SANITIZE = {
		allowedTags: [
			// region Custom things which look like tags
			"<$name$>",
			// endregion
		],
		allowedAttributes: {},
	};

	static async _pUpdateDir (dir) {
		Uf.listJsonFiles(dir)
			.forEach(file => {
				const fileData = Uf.readJsonSync(file);

				const _meta = fileData._meta;
				delete fileData._meta;

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

							if (clean !== str) Um.info(this._LOG_TAG, `Sanitized:\n${str}\n${clean}`);

							return clean;
						}
					},
					isModify: true,
				});

				const out = {$schema: fileOut.$schema, _meta};
				Object.assign(out, fileOut);

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
}

BrewCleanerHtml.pRun();

export {BrewCleanerHtml};
