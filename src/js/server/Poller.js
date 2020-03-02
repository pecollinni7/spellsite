const AsyncPolling = require('../../lib/async-polling');
const Routes       = require('./Routes');
const interval     = 5000;


let polling = AsyncPolling(function (end) {
	Routes.getData();
	Routes.downloadNewFiles();
	end();
}, interval);


module.exports = {
	polling
};
