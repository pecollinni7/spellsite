const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('update-downloaded', function (event, text) {
    console.log('update-downloaded');
    var container = document.getElementById('rdy-button');
    container.removeAttribute('disabled');
});
ipcRenderer.on('update-available', function (event, text) {
    console.log('update-available')
});
ipcRenderer.on('error', function (event, text) {
    console.log('error', text)
});
ipcRenderer.on('prog-made', function (event, text) {
    console.log('prog-made')
});
ipcRenderer.on('update-not-available', function (event, text) {
    console.log('update-not-available')
});

