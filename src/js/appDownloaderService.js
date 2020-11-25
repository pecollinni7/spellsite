const ipcRenderer = require('electron').ipcRenderer;

console.log('app updater running');

ipcRenderer.on('update-downloaded', function (event, text) {
    console.log('Software update downloaded.');
});
ipcRenderer.on('update-available', function (event, text) {
    console.log('Software update available.')
});
ipcRenderer.on('error', function (event, text) {
    console.log('error', text)
});
ipcRenderer.on('prog-made', function (event, text) {
    console.log('prog-made')
});
ipcRenderer.on('update-not-available', function (event, text) {
    console.log('Software update not available.')
});

