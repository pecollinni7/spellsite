const settings = require('electron').remote.require('electron-settings');
const {dialog} = require('electron').remote;
const fs       = require('fs');

// let path_storage = settings.has('path.storage');

function hasSettings()
{
	// return false;
	return settings.has('path.storage');
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
	fs.mkdirSync(storagePath + '/json/');
	fs.mkdirSync(storagePath + '/media/');
	
	fs.writeFileSync(storagePath + '/json/patch.json', JSON.stringify({}));
	
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
