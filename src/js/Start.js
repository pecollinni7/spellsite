const Site       = require('../js/site/Site');
// const FilePaths  = require('./site/StorageFilePaths');
const navigation = require('../js/navigation');
const Settings   = require('../js/site/Settings');

let site;

window.addEventListener("DOMContentLoaded", function (e) {
	
	site = new Site();
	
	if (Settings.hasSettings())
	{
		site.initialize();
	}
	else
	{
		site.showChoseDirectory();
	}
	
});












