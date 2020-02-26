const {app, ipcMain, BrowserWindow, globalShortcut} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');

let window;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', () => {
    
    const ret = globalShortcut.register('CommandOrControl+Q', () => {
        app.quit();
    });
    
    if (!ret) {
        console.log('registration failed');
    }
    
    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('CommandOrControl+Q'));
    
    
    createWindow();
    
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
});
app.on('will-quit', () => {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+Q');
    
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
});


function createWindow() {
    window = new BrowserWindow({
        width: 1600,
        height: 1200,
        webPreferences: {
            preload: path.join(__dirname, './src/js/preload.js'),
            nodeIntegration: true,
            webSecurity: false
        },
        backgroundColor: '#FFFFFF',
        frame: false
    });

    window.loadFile('./src/html/index.html').then(r => {});
    window.webContents.openDevTools();
    window.on('closed', function () {
        window = null;
    });

    /*

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

    */
}
