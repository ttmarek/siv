const electron = require('electron');
const minimist = require('minimist');
const auth = require('./auth');
const exts = require('./extensions');
const getPathsUnder = require('./parse-dir');
const path = require('path');

let user = {};
let extPaths = [];
let options = {};
let devMode = false;
// I added this array to put in objects that I didn't want V8 to
// garbage collect:
const dontGC = [];

function logError(err) {
  // The logger should only be 'required' if there is an error.
  require('./logger').error(err);
}

function makeTrayIcon(userId) {
  const contextMenu = electron.Menu.buildFromTemplate([
    {type: 'normal', label: 'Shutdown SIV', click: () => electron.app.quit()},
    {type: 'separator'},
    {type: 'normal', label: `User: ${userId}`},
  ]);

  const trayIcon = new electron.Tray(path.join(__dirname, 'icons', 'icon.png'));
  trayIcon.setToolTip('SIV Image Viewer');
  trayIcon.setContextMenu(contextMenu);
  dontGC.push(trayIcon);
}

function checkForKey() {
  auth.getSerialInfo()
    .then(serialNum => {
      if (serialNum !== user.id) {
        logError(`Key not found error. serialNum=${serialNum}, user.id=${user.id}`);
        electron.BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send('key-not-found');
        });
      }
    });
}

function openSIVWindow() {
  return new Promise(resolve => {
    const browserWindow = new electron.BrowserWindow({
      width: 1100,
      height: 700,
      title: 'SIV Image Viewer',
      'auto-hide-menu-bar': true,
    });

    browserWindow.loadURL(`file://${__dirname}/siv.html`);
    browserWindow.webContents.on('did-finish-load', () => {
      resolve(browserWindow);
    });
  });
}

const existingInstance = electron.app.makeSingleInstance(argv => {
  options = minimist(argv);
  openSIVWindow()
    .then(browserWindow => {
      if (options.open) {
        getPathsUnder(options.open)
          .then(filePaths => {
            browserWindow.webContents.send('file-paths-message', filePaths);
          })
          .catch(logError);
      }
      browserWindow.webContents.send('user-obj-message', user);
      browserWindow.webContents.send('ext-files-message', extPaths);
    });
});

if (existingInstance) {
  electron.app.quit();
}

electron.app.on('ready', () => {
  options = minimist(process.argv);
  openSIVWindow()
    .then(browserWindow => {
      if (options.open) {
        getPathsUnder(options.open)
          .then(filePaths => {
            browserWindow.webContents.send('file-paths-message', filePaths);
          })
          .catch(logError);
      }

      if (options.dev) {
        devMode = true;
        user = {
          id: 'developer',
          extensions: [{name: 'caliper', id: 'GyMG'}],
        };
        makeTrayIcon(user.id);
        browserWindow.webContents.send('user-obj-message', user);
        exts.download(user)
          .then(extsDownloaded => {
            browserWindow.webContents.send('ext-files-message', extsDownloaded);
            extPaths = extsDownloaded;
          });
      } else {
        auth.getUserObject()
          .then(userObj => {
            browserWindow.webContents.send('user-obj-message', userObj);
            user = userObj;
            setInterval(checkForKey, 3000);
            makeTrayIcon(userObj.id);
            return exts.download(userObj);
          })
          .then(extsDownloaded => {
            browserWindow.webContents.send('ext-files-message', extsDownloaded);
            extPaths = extsDownloaded;
          })
          .catch(logError);
      }
    });
});

electron.app.on('quit', () => {
  // Keep in mind that when you're in devMode you don't want SIV to
  // remove your working files when it shuts down.
  if (!devMode) {
    const fs = require('fs');
    extPaths.forEach(extObj => {
      fs.unlinkSync(extObj.path);
    });
  }
});

electron.app.on('window-all-closed', (event) => {
  // The following prevents the app from quiting when all its windows
  // are closed:
  event.preventDefault();
});
