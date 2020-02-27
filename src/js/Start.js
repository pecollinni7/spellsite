const Server = require('../js/server/Server');
const Site   = require('../js/site/Site');

let site;
let server;

window.addEventListener("DOMContentLoaded", function (e)
{
	this.site   = new Site();
	this.server = new Server(this.site);
});








