const {app, ipcMain, BrowserWindow, globalShortcut, clipboard, Menu, MenuItem} = require('electron');
const {autoUpdater}                                            = require('electron-updater');
const path                                                     = require('path');
const log                                                      = require('electron-log');
const fs                                                       = require('fs');
const windowsClipboard                                         = require('windows-file-clipboard');
const electronLocalshortcut = require('electron-localshortcut');

const Data = require('./src/js/backend/data/Data');

let loaderWindow;
let window;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let platform                             = process.platform;
autoUpdater.logger                       = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.fullChangelog                = true;

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
    autoUpdater.checkForUpdatesAndNotify().then();

    setInterval(() => {
        autoUpdater.checkForUpdatesAndNotify().then();
    }, 30 * 60000);

    // browserLog(fs.readFileSync(path.resolve(__dirname, 'release-notes.md')));
    // browserLog(clipboard.readBuffer("CF_HDROP").toString("ucs2"));
    // browserLog(process.versions['electron']);

    electronLocalshortcut.register(window, 'Ctrl+V', () => {
        const paths = windowsClipboard.readPaths();
        browserLog(paths);
    });


});

app.whenReady().then(() => {

    // globalShortcut.register('Ctrl+V', () => {
    //     browserLog('Electron loves global shortcuts!')
    // })

    ipcMain.on("send-to-clipboard", (event, dataForClipboard) => {
        // browserLog(dataForClipboard);
        windowsClipboard.writePaths(dataForClipboard);
    });
});
/*
 app.on('window-all-closed', function () {
 if (process.platform !== 'darwin') app.quit()
 });
 app.on('activate', function () {
 if (BrowserWindow.getAllWindows().length === 0) createWindow()
 });
 */
app.on('will-quit', () => {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+Q');

    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
});

const menu = new Menu()
menu.append(new MenuItem({
    label: 'Electron',
    submenu: [{
        role: 'help',
        accelerator: process.platform === 'darwin' ? 'Ctrl+V' : 'Ctrl+V',
        click: () => { browserLog('Electron rocks!') }
    }]
}))

Menu.setApplicationMenu(menu)

function browserLog(s)
{
    if (window && window.webContents)
    {
        window.webContents.executeJavaScript(`console.log("${s}")`).then();
    }
}

function createLoaderWindow()
{
    loaderWindow = new BrowserWindow({
        width         : 540,
        height        : 540,
        show          : true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity    : false
        },
        // backgroundColor: '#00000000',
        frame         : false,
        transparent   : true,
    });

    loaderWindow.loadFile('./src/html/loader.html').then(r => {
        createWindow();

    });
    // loaderWindow.webContents.openDevTools();

    loaderWindow.on('closed', function () {
        // loaderWindow = null;
        // createWindow();
        window.show();
    });

}

function createWindow()
{
    window = new BrowserWindow({
        width          : 1600,
        height         : 1200,
        show           : false,
        webPreferences : {
            preload           : path.join(__dirname, './src/js/preload.js'),
            nodeIntegration   : true,
            webSecurity       : false,
            enableRemoteModule: true
        },
        backgroundColor: '#ffffff',
        frame          : false
    });

    function sendStatusToWindow(text)
    {
        log.info(text);
        window.webContents.send('message', text);
    }

    window.loadFile('./src/html/index.html').then(r => {});
    window.webContents.openDevTools();

    window.on('closed', function () {
        window = null;
    });

    window.show();

    // Let autoUpdater check for updates, it will start downloading it automatically
    autoUpdater.on('checking-for-update', () => {
        browserLog('Checking for software update...');
        sendStatusToWindow('Checking for update...');
    })
    autoUpdater.on('update-available', (info) => {
        browserLog('Software update available.');
        sendStatusToWindow('Update available.');

    })
    autoUpdater.on('update-not-available', (info) => {
        browserLog('Software update not available.');
        sendStatusToWindow('Update not available.');
    })
    autoUpdater.on('error', (err) => {
        browserLog('Error in auto-updater.');
        sendStatusToWindow('Error in auto-updater. ' + err);
    })
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message     = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message     = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        browserLog(log_message);
        sendStatusToWindow(log_message);
    });

    autoUpdater.on('update-downloaded', (info) => {
        browserLog('Software update downloaded.');

        // fs.appendFileSync(path.resolve(__dirname, 'release-notes.md'), JSON.stringify(info.releaseNotes),{encoding: 'utf8'});

        sendStatusToWindow('Update downloaded');
    });

    /*
     ipcMain.on('quitAndInstall', (event, arg) => {
     autoUpdater.quitAndInstall();
     });
     */

}
