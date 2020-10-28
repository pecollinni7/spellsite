//this file needs to read from some json settings file
const settings  = require('electron').remote.require('electron-settings');


const Path = require('path');

let _storage;
let path_dataFile;
let path_patchFile;
let path_media;
let path_temp;

function getStorage()
{
	if (_storage === undefined)
		_storage = require('electron-settings').get('path.storage');

	console.log('Storage path in settings is: ' + _storage);
	return _storage;
}

function setStorage(value)
{
	console.log('setting new storage: ' + value);
	_storage = value;

	generatePaths();
}



function generatePaths()
{
	// path_dataFile  = Path.resolve(getStorage() + "/json/data.json").replace(/\\/g, "/");
	// path_patchFile = Path.resolve(getStorage() + "/json/patch.json").replace(/\\/g, "/");
	// path_media     = Path.resolve(getStorage() + "/media").replace(/\\/g, "/");
	// path_temp      = Path.resolve(getStorage() + "/temp").replace(/\\/g, "/");
	//

	path_dataFile  = settings.get('path.data');
	path_patchFile = settings.get('path.patch');
	path_media     = settings.get('path.media');
	path_temp      = settings.get('path.temp');

	console.log(
		path_dataFile,
		path_patchFile,
		path_media,
		path_temp
	);
}

// const path_dataFile  = Path.resolve(process.cwd() + "/storage/json/data.json").replace(/\\/g, "/");
// const path_patchFile = Path.resolve(process.cwd() + "/storage/json/patch.json").replace(/\\/g, "/");
// const path_media     = Path.resolve(process.cwd() + "/storage/media").replace(/\\/g, "/");
// const path_temp      = Path.resolve(process.cwd() + "/storage/temp").replace(/\\/g, "/");




// const SERVER = "http://127.0.0.1";
const SERVER = "http://144.91.87.68";
const PORT = "12345";


const ICON_DOT_GREEN    = '../images/dot_green.png';
const ICON_DOT_RED      = '../images/dot_red.png';
const GET_FILE          = "";
const SET_DATA_FILE     = SERVER + ":" + PORT + "/setDataFile";
const CHECK_FOR_UPDATES = SERVER + ":" + PORT + "/checkForUpdates";
const DOWNLOAD_MEDIA    = SERVER + ":" + PORT + "/downloadFile/";
const UPLOAD_FILE       = SERVER + ":" + PORT + "/uploadFile";
const UPLOAD_MULTIPLE   = SERVER + ":" + PORT + "/uploadMultipleFiles";

module.exports = {
	ICON_DOT_GREEN,
	ICON_DOT_RED,

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
