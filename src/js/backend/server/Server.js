const Routes              = require('./Routes');
const NotificationManager = require("../NotificationManager");
const polling             = require('./Polling').polling;
const {ipcRenderer}       = require('electron');

class Server
{
    get polling() { return polling; }

    constructor()
    {
        $(document).on('notifyServer',  this.actionPerformed);
        $(document).on('uploadMedia',   (e, files) => {this.uploadMedia(files)});
        $(document).on('downloadLink',  (e, links) => {this.downloadLink(links)});

        ipcRenderer.on('uploadMedia', (e, files) => {
            NotificationManager.addNotification("Pasted " + files.length + (files.length > 1 ? ' files.' : ' file.'), '', true);
            this.uploadMedia(files);
        });
    }

    runPolling()
    {

    }

    //TODO: rename to notifyServer
    actionPerformed()
    {
        polling.stop();
        Routes.setData(function () {
            Routes.downloadNewFiles();
            polling.run();
        });
    };

    uploadMedia(files)
    {
        Routes.uploadMedia(files);
    };

    downloadLink(linksObj)
    {
        // console.log("linksObj: " + linksObj);
        Routes.downloadLink(linksObj);
    }
}

module.exports = Server;





