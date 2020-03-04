const settings = require('electron').remote.require('electron-settings');
const {dialog} = require('electron').remote;
const fs       = require('fs');

// let path_storage = settings.has('path.storage');

function hasSettings()
{
	return false;
	// return settings.has('path.storage');
}

function getSettings()
{
	return settings.get('path.storage').replace(/\\/g, "/");
}

function setSettings(value)
{
	settings.set('path', {
		storage: value
	})
}

function createDefaults()
{
	const storagePath = getSettings();

	if (!fs.existsSync(storagePath + '/json/'))
		fs.mkdirSync(storagePath + '/json/');

	if (!fs.existsSync(storagePath + '/media/'))
		fs.mkdirSync(storagePath + '/media/');

	if (!fs.existsSync(storagePath + '/json/patch.json'))
		fs.writeFileSync(storagePath + '/json/patch.json', JSON.stringify({}));

	if (!fs.existsSync(storagePath + '/json/data.json'))
		fs.writeFileSync(storagePath + '/json/data.json', JSON.stringify({
		"version" : 0,
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
	
	createDefaults
};
