const settings = require('electron').remote.require('electron-settings');
const fs       = require('fs');
const path     = require('path');
const slash    = require('slash');


const ICON_DOT_GREEN    = '../images/dot_green.png';
const ICON_DOT_RED      = '../images/dot_red.png';

// const SERVER            = "http://127.0.0.1";
// const SERVER            = "http://144.91.87.68";
const SERVER           = "http://194.163.151.224";
const PORT              = "12345";
// const PORT              = "22";
const GET_FILE          = "";
const SET_DATA_FILE     = SERVER + ":" + PORT + "/setDataFile";
const CHECK_FOR_UPDATES = SERVER + ":" + PORT + "/checkForUpdates";
const DOWNLOAD_MEDIA    = SERVER + ":" + PORT + "/downloadFile/";
const UPLOAD_FILE       = SERVER + ":" + PORT + "/uploadFile";
const UPLOAD_MULTIPLE   = SERVER + ":" + PORT + "/uploadMultipleFiles";





function hasSettings()
{
	if (settings.has('path.storage'))
		createDefaults();

	return settings.has('path.storage');
}

function getSettings(value)
{
	return settings.get(value);
}

function setSettings(value)
{
	// const storagePath = value.replace(/\\/g, "/");

	settings.set('path', {
		storage: slash(value),
		data   : slash(path.join(value, 'json/data.json')),
		patch  : slash(path.join(value, 'json/patch.json')),
		media  : slash(path.join(value, 'media')),
		temp   : slash(path.join(value, 'temp'))
	});

}



function createDefaults()
{
	settings.set('pageSize', 40);

	const storagePath = settings.get('path.storage');

	if (!fs.existsSync(storagePath + '/json/'))
		fs.mkdirSync(storagePath + '/json/');

	if (!fs.existsSync(storagePath + '/media/'))
		fs.mkdirSync(storagePath + '/media/');

	if (!fs.existsSync(storagePath + '/temp/'))
		fs.mkdirSync(storagePath + '/temp/');

	if (!fs.existsSync(storagePath + '/json/patch.json'))
		fs.writeFileSync(storagePath + '/json/patch.json', JSON.stringify({}));

	if (!fs.existsSync(storagePath + '/json/data.json'))
		fs.writeFileSync(storagePath + '/json/data.json', JSON.stringify({
			"version": 0,
			"tagTypes":
				[
					"Ice",
					"Water",
					"Fire"
				]
		}));
}

module.exports = {
	hasSettings,
	getSettings,
	setSettings,

	createDefaults,

	ICON_DOT_GREEN,
	ICON_DOT_RED,

	CHECK_FOR_UPDATES,
	SET_DATA_FILE,
	GET_FILE,
	DOWNLOAD_MEDIA,
	UPLOAD_FILE,
	UPLOAD_MULTIPLE,
};
