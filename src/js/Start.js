const settings = require('../js/backend/Settings');
const Site     = require('../js/backend/Site');
const {dialog} = require('electron').remote;

let site;

/*
 const Site       = require('../js/site/Site');
 // const FilePaths  = require('./site/StorageFilePaths');
 const navigation = require('../js/navigation');
 const Settings   = require('../js/site/Settings');


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

 */

window.addEventListener("DOMContentLoaded", init);

function init()
{
    if (settings.hasSettings())
    {
        loadSite();
    }
    else
    {
        showChoseDirectory();
    }
}

function choseMediaDirectory()
{
    dialog.showOpenDialog({properties: ['openDirectory']}).then(r => {

        if (r.filePaths[0])
        {
            settings.setAll(r.filePaths[0]);
            // $("#loaderContent").hide("slow");
            $("#loaderContent").css('visibility', 'hidden');

            loadSite();
        }

    });
}

function loadSite()
{
    site = new Site();
    site.initialize();
}

function showChoseDirectory()
{
    $("#loaderContent").css('visibility', 'visible');
}










