const Routes  = require('./Routes');
const polling = require('./Polling').polling;

class Server
{
    get polling() { return polling; }

    constructor() { }


    //rename to notifyServer
    static actionPerformed()
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





