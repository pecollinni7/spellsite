const {app, ipcMain, BrowserWindow} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');

let window;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
});


function createWindow() {
    window = new BrowserWindow({
        width: 1400,
        height: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            webSecurity: true
        },
        backgroundColor: '#FFFFFF'
    });

    window.loadFile('index.html').then(r => {});
    window.webContents.openDevTools();
    window.on('closed', function () {
        window = null;
    });

    // autoUpdater.requestHeaders = { "PRIVATE-TOKEN": "f456d389c1202f5d403c78774ffcaf4947c1e879" };
    // autoUpdater.autoDownload = true;

    // Let autoUpdater check for updates, it will start downloading it automatically
    autoUpdater.checkForUpdates().then(r => {
    });

    // Catch the update-available event
    autoUpdater.addListener('update-available', (info) => {
        window.webContents.send('update-available');
    });

    // Catch the update-not-available event
    autoUpdater.addListener('update-not-available', (info) => {
        window.webContents.send('update-not-available');
    });

    // Catch the download-progress events
    autoUpdater.addListener('download-progress', (info) => {
        window.webContents.send('prog-made');
    });

    // Catch the update-downloaded event
    autoUpdater.addListener('update-downloaded', (info) => {
        window.webContents.send('update-downloaded');
    });

    // Catch the error events
    autoUpdater.addListener('error', (error) => {
        window.webContents.send('error', error.toString());
    });

    ipcMain.on('quitAndInstall', (event, arg) => {
        autoUpdater.quitAndInstall();
    });
}
