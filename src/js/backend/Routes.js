const fs                = require('fs');
const needle            = require('needle');
const FileType          = require('file-type');
const DataService       = require('./DataService');
const Settings          = require('./Settings');
const DataServiceEvents = require('./DataServiceEvents');

let fileDiff;
let downloaded      = [];
let filesToDownload = 0;
let filesDownloaded = 0;

const getData = () => needle.request('get',
    Settings.SRV_CHECK_FOR_UPDATES,
    {clientVersion: DataService.version},
    {multipart: true, json: true},
    (error, response, body) => {

        if (error)
        {

            console.error('Offline ' + Settings.SRV_CHECK_FOR_UPDATES); //no connection
            $('#serverIcon').attr("src", Settings.ICON_DOT_RED);
            $('#serverIcon').attr("data-original-title", "Server offline");

            return;
        }

        // console.log('response statusCode = ' + response.statusCode);

        if (response.statusCode === 200)
        {
            console.log('new data arrived');
            $('#serverIcon').attr("src", Settings.ICON_DOT_GREEN);

            fs.writeFile(
                Settings.path_dataFile,
                JSON.stringify(body, null, 4),
                'utf8', function (err) {

                if (err)
                {
                    console.log('error while writing poller response');
                    throw err;
                }

                DataService.reloadData();

                $(document).trigger(DataServiceEvents.NEW_DATA_FILE);

            });
        }

        if (response.statusCode === 205)
        {
            // console.log('you are up to date');
            $('#serverIcon').attr("src", Settings.ICON_DOT_GREEN);
        }

        if (response.statusCode === 404)
        {
            console.log('Server DataFile not found');
            $('#serverIcon').attr("src", Settings.ICON_DOT_GREEN);
        }
    });

function getLocalFileList()
{
    return fs.readdirSync(Settings.path_mediaFolder, {withFileTypes: true}).filter(item => !item.isDirectory()).map(item => item.name);
}

function getServerFileList()
{
    return DataService.getAllFileNamesNoExistCheck();
}

function getFilesDifference()
{
    const fileListInDir  = getLocalFileList();
    const fileListInJson = getServerFileList();

    // console.log('fileListInDir: ' + fileListInDir);
    // console.log('fileListInJson: ' + fileListInJson);

    return fileListInJson.filter(x => !fileListInDir.includes(x) && x !== 'version' && x !== 'tagTypes');
}

function downloadNewFiles()
{
    fileDiff = getFilesDifference();
    filesToDownload += fileDiff.length;
    // console.log('fileDiff: ' + fileDiff);

    fileDiff.forEach(fileName => {

        downloadFile(fileName);
        DataService.addToCurrentlyDownloading(fileName);

    });

    // $(document).trigger("newFilesArrived");

}

const setData = (cb) => needle.request('post', Settings.SRV_SET_DATA_FILE,
    {jsonData: JSON.stringify(DataService.patchFile)},
    {multipart: true, json: true},
    (error, response, body) => {

        if (error)
        {
            console.log(error);
            return;
        }

        console.log('response statusCode = ' + response.statusCode);
        // console.log('patchFile: ' + JSON.stringify(files.getPatchFile()));

        if (response.statusCode === 200)
        {

            fs.writeFile(Settings.path_dataFile, JSON.stringify(body, null, 2), 'utf8', function (err) {
                if (err)
                {
                    console.log('error while writing poller response');
                    throw err;
                }

                DataService.clearPatch();
                // files.setDataFile(files.readFileAsync(files.getSettings('path.data));
                cb();
            });
        }
    });

const uploadFile = (data) => {

    needle.request('post', Settings.SRV_UPLOAD_FILE, {file: data}, {multipart: true}, (error, response, body) => {
        if (error) console.log(error);
        console.log(body);
    })
};

const uploadMedia = function (files) {

    for (let i = 0; i < files.length; i++)
    {
        constructUploadData(files[i]).then((data) => {

            uploadFile(data);

        }).catch((err) => {
            console.log(err);
        })
    }
};

async function constructUploadData(file)
{
    return {
        buffer: await fs.readFileSync(file.path), filename: await file.name, content_type: (await FileType.fromFile(file.path)).mime
    };
}

const downloadFile = (fileName) => {

    let stream = needle.get(Settings.SRV_DOWNLOAD_MEDIA + fileName);
    let ws     = fs.createWriteStream(Settings.getMediaPathForFileName(fileName));

    stream.on('readable', function () {
        let chunk;
        while (chunk = this.read())
        {
            ws.write(chunk);
        }
    });

    stream.on('done', function (err) {
        if (err)
        {
            console.log(err);
            //TODO delete ws file
        }
        // console.log(this.request.res.headers['content-disposition']); //fileName from server
        console.log('file downloaded: ' + fileName);
        DataService.removeFromCurrentlyDownloading(fileName);
        filesDownloaded += 1;
        updateDownloadProgressBar();
        // $(document).trigger("newFilesArrived");
    });
};

let timerclock;

function updateDownloadProgressBar()
{
    clearTimeout(timerclock);

    let res      = "Downloading " + filesDownloaded + "/" + filesToDownload;
    let progress = normalizeValue(filesDownloaded, filesToDownload, 0);

    $('#progressBar').addClass('show');

    // $('#downloadProgressBar').attr('aria-valuenow', progress);
    $('#downloadProgressBar').attr('style', 'width:' + Number(progress) + '%');
    $('#progressBarText').text(res);

    if (progress === 100)
    {
        timerclock = setTimeout(function () {
            $('#progressBar').removeClass('show');
            filesToDownload = 0;
            filesDownloaded = 0;
            $(document).trigger("newFilesArrived");

        }, 3000);
    }
}

function normalizeValue(val, max, min)
{
    return (val - min) / (max - min) * 100;
}

module.exports = {
    setData, getData, uploadMedia, downloadFile, downloadNewFiles
};

