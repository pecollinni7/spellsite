const {app, ipcMain, BrowserWindow, globalShortcut} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');
const settings = require('electron-settings');
const log = require('electron-log');

let loaderWindow;
let window;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

app.on('ready', () => {
    
    // const ret = globalShortcut.register('CommandOrControl+Q', () => {
    //     app.quit();
    // });
    //
    // if (!ret) {
    //     console.log('registration failed');
    // }



    // createLoaderWindow();
    createWindow();

    log.info('checking for updates');
    autoUpdater.checkForUpdatesAndNotify();
    
});
// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') app.quit()
// });
// app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
// });
app.on('will-quit', () => {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+Q');
    
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
});



function createLoaderWindow()
{
    loaderWindow = new BrowserWindow({
        width: 300,
        height: 400,
        show: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
        backgroundColor: '#FFFFFF',
        // frame: false
    });

    loaderWindow.loadFile('./src/html/loader.html').then(r => {});
    // loaderWindow.webContents.openDevTools();
    loaderWindow.on('closed', function () {
        loaderWindow = null;
        createWindow();
    });
}



function createWindow() {
    window = new BrowserWindow({
        width: 1600,
        height: 1200,
        show: true,
        webPreferences: {
            preload: path.join(__dirname, './src/js/preload.js'),
            nodeIntegration: true,
            webSecurity: false,
            enableRemoteModule: true
        },
        backgroundColor: '#ffffff',
        frame: false
    });

    function sendStatusToWindow(text) {
        log.info(text);
        window.webContents.send('message', text);
    }

    window.loadFile('./src/html/index.html').then(r => {});
    window.webContents.openDevTools();
    window.on('closed', function () {
        window = null;
    });
    window.show();
    // window.webContents.openDevTools();

    // Let autoUpdater check for updates, it will start downloading it automatically
    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('Checking for update...');
    })
    autoUpdater.on('update-available', (info) => {
        sendStatusToWindow('Update available.');
    })
    autoUpdater.on('update-not-available', (info) => {
        sendStatusToWindow('Update not available.');
    })
    autoUpdater.on('error', (err) => {
        sendStatusToWindow('Error in auto-updater. ' + err);
    })
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        sendStatusToWindow(log_message);
    })
    autoUpdater.on('update-downloaded', (info) => {
        sendStatusToWindow('Update downloaded');
    });


    //
    // ipcMain.on('quitAndInstall', (event, arg) => {
    //     autoUpdater.quitAndInstall();
    // });

}
