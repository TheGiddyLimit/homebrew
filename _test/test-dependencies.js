import {Uf, Um, UtilSource} from "5etools-utils";

const _TAG = "DEPENDENCY";
const _PROPS_CLASS = new Set([
	"class",
	"classFeature",
	"classFluff",
	"subclass",
	"subclassFeature",
	"subclassFluff",
]);
const _CLASS_IDS_OFFICIAL = new Set([
	"artificer",
	"barbarian",
	"bard",
	"cleric",
	"druid",
	"fighter",
	"monk",
	"mystic",
	"paladin",
	"ranger",
	"rogue",
	"sidekick",
	"sorcerer",
	"warlock",
	"wizard",
]);

const _getEntityDependency = ({prop, ent}) => {
	if (!_PROPS_CLASS.has(prop)) return ent._copy.source;

	if (!UtilSource.isSiteSource(ent._copy.source)) return ent._copy.source;

	const classId = (["class", "classFluff"].includes(prop) ? ent._copy.name : ent._copy.className).toLowerCase().trim();
	if (_CLASS_IDS_OFFICIAL.has(classId)) return classId;

	return ent._copy.source;
}

const jsonMetas = [];
Uf.runOnDirs(dir => {
	Uf.listJsonFiles(dir)
		.forEach(filePath => jsonMetas.push({filePath, json: Uf.readJsonSync(filePath)}));
});

const error = jsonMetas
	.map(({filePath, json}) => {
		const dependencies = json._meta?.dependencies || {};
		const srcsFile = new Set((json._meta?.sources || []).map(source => source.json));

		const depsMissing = {};

		Object.entries(json)
			.forEach(([prop, arr]) => {
				if (!arr || !(arr instanceof Array)) return;

				arr
					.forEach(ent => {
						if (!ent._copy) return;

						if (srcsFile.has(ent._copy.source)) return;

						const dep = _getEntityDependency({prop, ent})

						if ((dependencies[prop] || []).includes(dep)) return;

						(depsMissing[prop] ||= new Set()).add(dep);
					});
			});

		const errorPt = Object.entries(depsMissing)
			.map(([prop, deps]) => [`\t\t"${prop}"`, ...[...deps].sort((a, b) => a.localeCompare(b, {sensitivity: "base"})).map(dep => `\t\t\t"${dep}"`)])
			.flat()
			.join("\n");
		if (!errorPt) return null;

		return `\t"${filePath}" had missing dependencies!\n${errorPt}`;
	})
	.filter(Boolean)
	.flat()
	.join("\n");

if (error) {
	Um.error(_TAG, `Dependency test failed.\n${error}`);
	process.exit(1);
}

Um.info(_TAG, "Dependency test passed.");
