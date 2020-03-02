const routes  = require('./routes');
const polling = require('./Poller').polling;


// polling.on('start', () => {
//
// });
// polling.on('stop', (err) => {
//
// });


class Server
{
	_site;
	
	get site() { return this._site; }
	
	get polling() { return polling; }
	
	get routes() { return routes;}
	
	
	constructor(site)
	{
		this._site = site;
	}
	
	
	actionPerformed()
	{
		polling.stop();
		routes.setData(function () {
			routes.downloadNewFiles();
			polling.run();
		});
	};
	
	uploadMedia(files)
	{
		routes.uploadMedia(files);
	};
}


module.exports = Server;





