//this file needs to read from some json settings file

const Path = require('path');

let _storage;

function getStorage()
{
	if (_storage === undefined)
		_storage = require('electron-settings').get('path.storage');
	
	return _storage;
}

function setStorage(value)
{
	console.log('setting new storage: ' + value);
	_storage = value;
}




const path_dataFile  = Path.resolve(getStorage() + "/json/data.json").replace(/\\/g, "/");
const path_patchFile = Path.resolve(getStorage() + "/json/patch.json").replace(/\\/g, "/");
const path_media     = Path.resolve(getStorage() + "/media").replace(/\\/g, "/");
const path_temp      = Path.resolve(getStorage() + "/temp").replace(/\\/g, "/");

// const path_dataFile  = Path.resolve(process.cwd() + "/storage/json/data.json").replace(/\\/g, "/");
// const path_patchFile = Path.resolve(process.cwd() + "/storage/json/patch.json").replace(/\\/g, "/");
// const path_media     = Path.resolve(process.cwd() + "/storage/media").replace(/\\/g, "/");
// const path_temp      = Path.resolve(process.cwd() + "/storage/temp").replace(/\\/g, "/");




const SERVER = "http://127.0.0.1";
// const SERVER = "http://144.91.87.68";
const PORT = "12345";


const GET_FILE          = "";
const SET_DATA_FILE     = SERVER + ":" + PORT + "/setDataFile";
const CHECK_FOR_UPDATES = SERVER + ":" + PORT + "/checkForUpdates";
const DOWNLOAD_MEDIA    = SERVER + ":" + PORT + "/downloadFile/";
const UPLOAD_FILE       = SERVER + ":" + PORT + "/uploadFile";
const UPLOAD_MULTIPLE   = SERVER + ":" + PORT + "/uploadMultipleFiles";

module.exports = {
	CHECK_FOR_UPDATES,
	SET_DATA_FILE,
	GET_FILE,
	DOWNLOAD_MEDIA,
	UPLOAD_FILE,
	UPLOAD_MULTIPLE,
	
	path_dataFile,
	path_patchFile,
	path_media,
	path_temp,
	
	setStorage,
	getStorage
};
