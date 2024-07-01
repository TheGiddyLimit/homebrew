import {DataTesterBase} from "5etools-utils/lib/TestData.js";
import {ObjectWalker} from "5etools-utils/lib/ObjectWalker.js";
import {UtilSource} from "5etools-utils/lib/UtilSource.js";

export class CopySourceCheck extends DataTesterBase {
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
			(contents._meta?.sources?.map(src => src?.json) || [])
				.filter(Boolean),
		);
		this._dependencies = Object.fromEntries(
			Object.entries(contents._meta?.dependencies || {})
				.map(([prop, arr]) => [prop, new Set(arr)]),
		);
		this._internalCopies = new Set(contents._meta?.internalCopies || []);
	}

	_walk ({file, contents}) {
		if (!file.includes("Kobold Press; Scarlet Citadel.json")) return;

		Object.entries(contents)
			.filter(([prop, arr]) => {
				if (prop.startsWith("_")) return;
				if (!(arr instanceof Array)) return;

				arr
					.forEach(ent => {
						const propStack = [prop];
						const inlineDependencies = new Set();

						ObjectWalker.walk({
							obj: ent,
							filePath: file,
							primitiveHandlers: {
								preObject: this._onPreObject.bind(this, {propStack, inlineDependencies}),
								object: this._checkObject.bind(this, {propStack, inlineDependencies}),
								postObject: this._onPostObject.bind(this, {propStack, inlineDependencies}),
							},
						});
					});
			});
	}

	_onPreObject ({propStack, inlineDependencies}, obj) {
		if (obj.type !== "statblockInline") return;

		propStack.push(obj.dataType);
		(obj.dependencies || []).forEach(dep => inlineDependencies.add(dep));
	}

	_onPostObject ({propStack, inlineDependencies}, obj) {
		if (obj.type !== "statblockInline") return;

		propStack.pop();
		inlineDependencies.clear();
	}

	_checkObject ({propStack, inlineDependencies}, obj, {filePath}) {
		if (!obj._copy?.source) return;

		const prop = propStack.at(-1);
		const sourceCopy = obj._copy.source;

		// Classes/subclasses have an alternate structure
		if (["class", "subclass"].includes(prop) && UtilSource.isSiteSource(sourceCopy)) {
			const classNameLower = obj._copy.className?.toLowerCase();
			if (
				this._dependencies[prop]?.has(classNameLower)
				|| inlineDependencies.has(classNameLower)
			) return;
		}

		// If a "root" entity, i.e. not in a `statblockInline`, allow internal copies
		if (
			propStack.length === 1
			&& this._internalCopies.has(prop)
			&& this._sources.has(sourceCopy)
		) return;

		if (
			this._dependencies[prop]?.has(sourceCopy)
			|| inlineDependencies.has(sourceCopy)
		) return;

		this.constructor._addMessage(`Entity "${propStack.join(" -> ")}" "${obj.name}" "_copy" source "${sourceCopy}" did not match sources found in dependencies in file "${filePath}"\n`);
	}
}
