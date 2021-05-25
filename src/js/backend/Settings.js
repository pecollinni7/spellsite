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
        && settings.has('path.dlItems')
        && settings.has('path.media')
        && settings.has('path.temp')
        && fs.existsSync(module.exports.path_storage)
        && fs.existsSync(module.exports.path_mediaFolder)
        && fs.existsSync(module.exports.path_tempFolder)
        && fs.existsSync(module.exports.path_dataFile)
        && fs.existsSync(module.exports.path_patchFile)
        && fs.existsSync(module.exports.path_dlItemsFile)
        && settings.has('app.pageSize')
        && settings.has('app.tagsOrder')
        && settings.has('app.saveSelectionOnPageSwitch')
        && settings.has('app.enableLogger')
        && settings.has('app.transitionDuration')
        && settings.has('app.releaseNotesSeen')
}

function setAll(baseStorageFolderPath)
{
    setDefaultPaths(baseStorageFolderPath);
    createDefaultFolders();
    createDefaultFiles();

    listAllSettings();
}

function setDefaultPaths(baseFolderPath)
{
    settings.set('path', {
        storage: slash(baseFolderPath),
        data   : slash(path.join(baseFolderPath, 'json/data.json')),
        patch  : slash(path.join(baseFolderPath, 'json/patch.json')),
        dlItems: slash(path.join(baseFolderPath, 'json/dlItems.json')),
        media  : slash(path.join(baseFolderPath, 'media')),
        temp   : slash(path.join(baseFolderPath, 'temp'))
    });

    settings.set('app', {
        pageSize                 : 25,
        tagsOrder                : [],
        saveSelectionOnPageSwitch: true,
        enableLogger             : false,
        transitionDuration       : 150,
        releaseNotesSeen         : false,
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

    //TODO error escape the paths
    if (fs.existsSync(module.exports.path_patchFile) === false)
        fs.writeFileSync(module.exports.path_patchFile, JSON.stringify({}));

    if (fs.existsSync(module.exports.path_dlItemsFile) === false)
        fs.writeFileSync(module.exports.path_dlItemsFile, JSON.stringify({
            "filesCurrentlyDownloading": []
        }));

    if (fs.existsSync(module.exports.path_dataFile) === false)
        fs.writeFileSync(module.exports.path_dataFile, JSON.stringify({
            "version" : 0,
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
    let s   = '';
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

function getTempMediaPathForFileName(fileName)
{
    return slash(path.join(module.exports.path_tempFolder, fileName));
}

function fileExists(fileName)
{
    return fs.existsSync(this.getMediaPathForFileName(fileName));
}

function numOfMediaFiles()
{
    return fs.readdirSync(module.exports.path_mediaFolder).length;
}

function clearTempMediaFolder()
{
    if (fs.readdirSync(module.exports.path_tempFolder).length > 0)
        removeDir(module.exports.path_tempFolder);
}

const removeDir = function (dirPath) {
    if (fs.existsSync(dirPath))
    {
        const files = fs.readdirSync(dirPath)

        if (files.length > 0)
        {
            files.forEach(fileName => {
                const p = path.join(dirPath, fileName);

                if (fs.statSync(p).isDirectory())
                {
                    removeDir(p);
                }
                else
                {
                    fs.unlinkSync(p);
                }
            });
        }
        else
        {
            console.log("No files found in the directory.")
        }
    }
    else
    {
        console.log("Directory path not found.")
    }
}

function clearSettings()
{
    //TODO: this throws an error
    settings.set('path', undefined);
    settings.set('app', undefined);
    console.log('Settings cleared');
}

const IP_LOCAL              = "http://127.0.0.1";
const IP_PUBLIC             = "http://144.91.87.68";
const IP_PUBLIC_2           = "http://207.180.249.216";
const SRV_IP                = IP_PUBLIC_2;
const SRV_PORT              = "12345";
const SRV_GET_FILE          = "";
const SRV_SET_DATA_FILE     = SRV_IP + ":" + SRV_PORT + "/setDataFile";
// const SRV_SEND_LINKS        = SRV_IP + ":" + SRV_PORT + "/sendLinks";
const SRV_CHECK_FOR_UPDATES = SRV_IP + ":" + SRV_PORT + "/checkForUpdates";
const SRV_DOWNLOAD_MEDIA    = SRV_IP + ":" + SRV_PORT + "/downloadFile/";
const SRV_DOWNLOAD_LINK     = SRV_IP + ":" + SRV_PORT + "/downloadLink/";
const SRV_UPLOAD_FILE       = SRV_IP + ":" + SRV_PORT + "/uploadFile";
const SRV_UPLOAD_MULTIPLE   = SRV_IP + ":" + SRV_PORT + "/uploadMultipleFiles";

const ICON_DOT_GREEN = '../images/dot_green.png';
const ICON_DOT_RED   = '../images/dot_red.png';

module.exports = {
    hasSettings,
    setAll,
    getMediaPathForFileName,
    getTempMediaPathForFileName,
    fileExists,
    clearSettings,
    listAllSettings,
    numOfMediaFiles,
    clearTempMediaFolder,

    get path_storage() {return settings.get('path.storage')},
    get path_dataFile() {return settings.get('path.data')}, //TODO: catch error - return default file
    get path_patchFile() {return settings.get('path.patch')},
    get path_dlItemsFile() {return settings.get('path.dlItems')},
    get path_mediaFolder() {return settings.get('path.media')},
    get path_tempFolder() {return settings.get('path.temp')},
    get app_pageSize() {return settings.get('app.pageSize')},
    get app_tagsOrder() {return settings.get('app.tagsOrder')},
    get app_saveSelectionOnPageSwitch() {return settings.get('app.saveSelectionOnPageSwitch')},
    get app_enableLogger() {return settings.get('app.enableLogger')},
    get app_transitionDuration() {return settings.get('app.transitionDuration')},

    IP_LOCAL,
    IP_PUBLIC,
    SRV_IP,
    SRV_PORT,
    SRV_GET_FILE,
    SRV_SET_DATA_FILE,
    // SRV_SEND_LINKS,
    SRV_CHECK_FOR_UPDATES,
    SRV_DOWNLOAD_MEDIA,
    SRV_DOWNLOAD_LINK,
    SRV_UPLOAD_FILE,
    SRV_UPLOAD_MULTIPLE,

    ICON_DOT_GREEN,
    ICON_DOT_RED,

}


