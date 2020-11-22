const fs       = require('fs');
const path     = require('path');
const slash    = require('slash');
const settings = require('electron').remote.require('electron-settings');
const {dialog} = require('electron').remote;

const defaultFolders = ['json', 'media', 'temp'];


function hasSettings()
{
    return settings.has('path.storage')
        && settings.has('path.data')
        && settings.has('path.patch')
        && settings.has('path.media')
        && settings.has('path.temp')

        && settings.has('app.pageSize');
}

function setAll(baseStorageFolderPath)
{
    setDefaultPaths(baseStorageFolderPath);
    createDefaultFolders();
    createDefaultFiles();

    listAllSettings();

    console.log(slash(path.join(process.cwd(), 'src/json/defaultData.json')));
}

function setDefaultPaths(baseFolderPath)
{
    settings.set('path', {
        storage: slash(baseFolderPath),
        data   : slash(path.join(baseFolderPath, 'json/data.json')),
        patch  : slash(path.join(baseFolderPath, 'json/patch.json')),
        media  : slash(path.join(baseFolderPath, 'media')),
        temp   : slash(path.join(baseFolderPath, 'temp'))
    });

    settings.set('app', {
        pageSize: 25,
        tagsOrder: [],
        saveSelectionOnPageSwitch: true,
        enableLogger: false,
        pageTransitionDuration: 150
    })
}

function createDefaultFolders()
{
    defaultFolders.forEach(p => {

        const folderPath = slash(path.join(module.exports.path_storage, p));
        createDirectory(folderPath);

    });
}

function createDefaultFiles()
{
    // if (fs.existsSync(module.exports.path_dataFile) === false)
    //     fs.copyFileSync('src/json/defaultData.json', module.exports.path_dataFile);

    // if (fs.existsSync(module.exports.path_patchFile) === false)
    //     fs.copyFileSync(slash(path.join(process.cwd(), 'src/json/defaultPatch.json')), module.exports.path_patchFile);

    if (fs.existsSync(module.exports.path_patchFile) === false)
        fs.writeFileSync(module.exports.path_patchFile, JSON.stringify({}));

    if (fs.existsSync(module.exports.path_dataFile) === false)
        fs.writeFileSync(module.exports.path_dataFile, JSON.stringify({
            "version": 0,
            "tagTypes":
                [
                    "Ice",
                    "Water",
                    "Fire"
                ]
        }));
}

function createDirectory(dirPath)
{
    if (fs.existsSync(dirPath) === false)
        fs.mkdirSync(dirPath);
}

function listAllSettings()
{
    let s = '';
    let res = 'Listing all settings ---------------------------\n';

    s = settings.get('path');
    for (const sKey in s)
        res += ('settings path: ' + sKey + ' - ' + s[sKey] + "\n");

    s = settings.get('app');
    for (const sKey in s)
        res += ('settings app: ' + sKey + ' - ' + s[sKey] + "\n");

    res += '------------------------------------------------'
    console.log(res);

}

function getMediaPathForFileName(fileName)
{
    return slash(path.join(module.exports.path_mediaFolder, fileName));
}

function fileExists(fileName)
{
    return fs.existsSync(this.getMediaPathForFileName(fileName));
}

function numOfMediaFiles()
{
    return fs.readdirSync(module.exports.path_mediaFolder).length;
}

function clearSettings()
{
    settings.set('path', undefined);
    settings.set('app', undefined);
}

const IP_LOCAL              = "http://127.0.0.1";
const IP_PUBLIC             = "http://144.91.87.68";
const SRV_IP                = IP_PUBLIC;
const SRV_PORT              = "12345";
const SRV_GET_FILE          = "";
const SRV_SET_DATA_FILE     = SRV_IP + ":" + SRV_PORT + "/setDataFile";
const SRV_CHECK_FOR_UPDATES = SRV_IP + ":" + SRV_PORT + "/checkForUpdates";
const SRV_DOWNLOAD_MEDIA    = SRV_IP + ":" + SRV_PORT + "/downloadFile/";
const SRV_UPLOAD_FILE       = SRV_IP + ":" + SRV_PORT + "/uploadFile";
const SRV_UPLOAD_MULTIPLE   = SRV_IP + ":" + SRV_PORT + "/uploadMultipleFiles";

const ICON_DOT_GREEN    = '../images/dot_green.png';
const ICON_DOT_RED      = '../images/dot_red.png';



module.exports = {
    hasSettings,
    setAll,
    getMediaPathForFileName,
    fileExists,
    clearSettings,
    listAllSettings,
    numOfMediaFiles,

    get path_storage() {return settings.get('path.storage')},
    get path_dataFile() {return settings.get('path.data')}, //TODO: catch error - return default file
    get path_patchFile() {return settings.get('path.patch')},
    get path_mediaFolder() {return settings.get('path.media')},
    get path_tempFolder() {return settings.get('path.temp')},
    get app_pageSize() {return settings.get('app.pageSize')},
    get app_tagsOrder() {return settings.get('app.tagsOrder')},
    get app_saveSelectionOnPageSwitch() {return settings.get('app.saveSelectionOnPageSwitch')},

    IP_LOCAL,
    IP_PUBLIC,
    SRV_IP,
    SRV_PORT,
    SRV_GET_FILE,
    SRV_SET_DATA_FILE,
    SRV_CHECK_FOR_UPDATES,
    SRV_DOWNLOAD_MEDIA,

    ICON_DOT_GREEN,
    ICON_DOT_RED,


}


