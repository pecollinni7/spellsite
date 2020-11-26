const Routes  = require('./Routes');
const polling = require('./Polling').polling;

class Server
{
    get polling() { return polling; }

    constructor()
    {
        $(document).on('notifyServer', this.actionPerformed);
        $(document).on('uploadMedia', (e, files)=>{this.uploadMedia(files)});
    }

    //rename to notifyServer
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
}

module.exports = Server;





