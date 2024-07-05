import {DataTesterBase} from "5etools-utils/lib/TestData.js";
import {ObjectWalker} from "5etools-utils/lib/ObjectWalker.js";

export class ImageUrlCheck extends DataTesterBase {
	static _URL_PREFIX_HOMEBREW_IMG = `https://raw.githubusercontent.com/TheGiddyLimit/homebrew-img/main/`;
	static _RE_HOMEBREW_IMG_PATH = /^(?<type>img|pdf)\/(?<source>[^/]+)\//;

	static registerParsedFileCheckers (parsedJsonChecker) {
		parsedJsonChecker.registerFileHandler(this);
	}

	static handleFile (file, contents) {
		const checker = new this({contents});

		checker._walk({file, contents});
	}

	constructor ({contents}) {
		super();
		this._sources = new Set(
			[
				...(contents._meta?.sources?.map(src => src?.json) || [])
					.filter(Boolean)
					.map(srcJson => srcJson.replace(/:/g, "")),
				...(contents._test?.additionalImageSources || [])
					.map(srcJson => srcJson.replace(/:/g, "")),
			],
		);
	}

	_walk ({file, contents}) {
		ObjectWalker.walk({
			obj: contents,
			filePath: file,
			primitiveHandlers: {
				object: this._checkObject.bind(this),
			},
		});
	}

	_checkObject (obj, {filePath}) {
		if (obj.type !== "image" || obj.href?.type !== "external" || !obj.href?.url) return;

		const {url} = obj.href;
		if (!url.toLowerCase().startsWith(this.constructor._URL_PREFIX_HOMEBREW_IMG.toLowerCase())) return;

		const mPath = this.constructor._RE_HOMEBREW_IMG_PATH.exec(url.slice(this.constructor._URL_PREFIX_HOMEBREW_IMG.length));
		if (!mPath) {
			this.constructor._addMessage(`Unknown "homebrew-img" URL pattern in file "${filePath}": "${url}"\n`);
			return;
		}

		const {source, type} = mPath.groups;
		if (this._sources.has(source)) return;

		this.constructor._addMessage(`Image source part "${source}" in "homebrew-img" ${type} URL did not match sources found in file "_meta" or "_test" in file "${filePath}": "${url}"\n`);
	}
}
