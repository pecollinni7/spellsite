const fs   = require('fs');
const Path = require('path');

const path_dataFile        = Path.resolve(process.cwd() + "/storage/json/data.json").replace(/\\/g, "/");
const path_patchFile       = Path.resolve(process.cwd() + "/storage/json/patch.json").replace(/\\/g, "/");
// const path_dataFileBackup  = Path.resolve(process.cwd() + "/json/dataBackup.json");
// const path_writeStream     = Path.resolve(process.cwd() + "/json/_writeStream.json");
// const path_readStream      = Path.resolve(process.cwd() + "/json/_readStream.json");
const path_images          = Path.resolve(process.cwd() + "/storage/media").replace(/\\/g, "/");
// const path_downloadedMedia = Path.resolve(process.cwd() + "/downloadedMedia");

let dataFile  = readData(path_dataFile);
let patchFile = readData(path_patchFile);
// let dataFile = require(path_dataFile);
// let patchFile = require(path_patchFile);

// const Reloader = require('reload-json');
// const reload   = new Reloader();
//
//
// const reloadDataFile = function () {
// 	reload.load(path_dataFile, function (err, data) {
// 		console.log(data);
// 		// dataFile = data;
// 	});
// };


function readData(filePath)
{
	var f = fs.readFileSync(filePath)
	return JSON.parse(f);
}

const readFileAsync = (filePath) => {
	fs.readFile(filePath, (error, data) => {
		console.log('Async Read: starting...');
		if (error)
		{
			console.log('Async Read: NOT successful!');
			console.log(error);
		}
		else
		{
			try
			{
				const dataJson = JSON.parse(data);
				console.log('Async Read: successful!');
				console.log(dataJson);
				return dataJson;
			}
			catch (error)
			{
				console.log(error);
			}
		}
	});
};

const storeFile = function (fileName, fileData, cb) {
	fs.writeFile(path_images + '/' + fileName, fileData, (err) => {
		if (err) console.log(err);
		if (cb !== null) cb();
		
		console.log('new file stored: ' + fileName);
	});
};


function clearPatch()
{
	fs.writeFileSync(path_patchFile, JSON.stringify({}), 'utf8');
}

function writeFile(fileData, filePath)
{
	// console.time('writeFile');
	
	fs.writeFileSync(
		filePath,
		// fileData,
		JSON.stringify(fileData, null, 2),
		{encoding: 'utf8'});
	
	// console.timeEnd('writeFile');
	
}

function getVersion()
{
	var version = getDataFile()['version'];
	console.log('our dataFile version: ' + version);
	return version;
}

function setDataFile(file)
{
	writeFile(dataFile, path_dataFile);
	dataFile = file;
}

function getDataFile()
{
	dataFile = readData(path_dataFile);
	return dataFile;
}

function setPatchFile(file)
{
	writeFile(file, path_patchFile);
	// patchFile = getPatchFile();
	patchFile = file;
}

function getPatchFile()
{
	// patchFile = readData(path_patchFile);
	console.log(patchFile);
	return patchFile;
}

module.exports = {
	fs,
	path_dataFile,
	// path_dataFileBackup,
	path_patchFile,
	// path_writeStream,
	// path_readStream,
	path_images,
	
	getVersion,
	clearPatch,
	readData,
	readFileAsync,
	// reloadDataFile,
	
	setPatchFile,
	getPatchFile,
	setDataFile,
	getDataFile,
	
	storeFile
};

// module.exports.setPatchFile = function (file) {
// 	// patchFile = file;
// 	console.log(file);
// 	setPatchFile(file);
// };
//
// module.exports.getPatchFile = function () {
// 	return patchFile;
// 	// return getPatchFile();
// };
//
// module.exports.setDataFile = function (file) {
// 	// dataFile = file;
// 	console.log(file);
// 	setDataFile(file);
// };
//
// module.exports.getDataFile = function () {
// 	return dataFile;
// 	// return getDataFile();
// };

