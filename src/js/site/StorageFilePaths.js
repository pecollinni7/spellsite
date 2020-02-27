//this file needs to read from some json settings file

const Path = require('path');

const path_dataFile  = Path.resolve(process.cwd() + "/storage/json/data.json").replace(/\\/g, "/");
const path_patchFile = Path.resolve(process.cwd() + "/storage/json/patch.json").replace(/\\/g, "/");
const path_media     = Path.resolve(process.cwd() + "/storage/media").replace(/\\/g, "/");
const path_temp      = Path.resolve(process.cwd() + "/storage/temp").replace(/\\/g, "/");

module.exports = {
	path_dataFile,
	path_patchFile,
	path_media,
	path_temp
};
