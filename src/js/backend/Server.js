const Routes  = require('./Routes');
const polling = require('./Polling').polling;

class Server
{
    _site;

    get site() { return this._site; }
    get polling() { return polling; }

    constructor(site)
    {
        this._site = site;
    }

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





