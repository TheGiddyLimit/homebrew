"use strict";

const fs = require("fs");

function isDirectory (path) {
	return fs.lstatSync(path).isDirectory();
}

function readJSON (path) {
	try {
		return JSON.parse(fs.readFileSync(path, "utf8"));
	} catch (e) {
		e.message += ` (Path: ${path})`;
		throw e;
	}
}

function listFiles (dir) {
	const dirContent = fs.readdirSync(dir, "utf8")
		.filter(file => file.endsWith(".json"))
		.map(file => `${dir}/${file}`);
	return dirContent.reduce((acc, file) => {
		if (isDirectory(file)) {
			acc.push(...listFiles(file));
		} else {
			acc.push(file);
		}
		return acc;
	}, [])
}

function runOnDirs (fn) {
	fs.readdirSync(".", "utf8")
		.filter(dir => isDirectory(dir) && !dir.startsWith(".") && !dir.startsWith("_") && dir !== "node_modules")
		.forEach(dir => fn(dir));
}

function mkDirs (pathToCreate) {
	pathToCreate
		.split(/[\/]/g)
		.reduce((currentPath, folder) => {
			currentPath += `${folder}/`;
			if (!fs.existsSync(currentPath)) {
				fs.mkdirSync(currentPath);
			}
			return currentPath;
		}, "");
}

module.exports = {
	readJSON,
	listFiles,
	runOnDirs,
	mkDirs
};
