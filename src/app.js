const electron = require('electron');
const minimist = require('minimist');
const auth = require('./auth');
const exts = require('./extensions');
const getPathsUnder = require('./parse-dir');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

winston.add(winston.transports.File, {
  filename: path.join(__dirname, 'logs', 'siv.log'),
});

let devMode = false;
let user = {};
let extPaths = [];
let options = {};

const existingInstance = electron.app.makeSingleInstance((argv, workingDirectory) => {
  options = minimist(argv);
  openSIVWindow()
    .then(browserWindow => {
      if (options.open) {
        getPathsUnder(options.open)
          .then(filePaths => {
            browserWindow.webContents.send('file-paths-message', filePaths);
          })
          .catch(winston.error);
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
          .catch(winston.error);
      }

      if (options.dev) {
        devMode = true;
        user = {
          id: 'developer',
          extensions: [{name: 'ruler', id: 'GyMG'}],
        };
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
            return exts.download(userObj);
          })
          .then(extsDownloaded => {
            browserWindow.webContents.send('ext-files-message', extsDownloaded);
            extPaths = extsDownloaded;
          })
          .catch(winston.error);
      }
    });
  
});

electron.app.on('window-all-closed', () => {
  if (!devMode) {
    extPaths.forEach(extObj => {
      fs.unlinkSync(extObj.path);
    });
  }
  electron.app.quit();
});

function checkForKey() {
  auth.getSerialInfo()
    .then(serialNum => {
      if (serialNum != user.id) {
        winston.log(`Key not found error. serialNum=${serialNum}, user.id=${user.id}`);
        electron.BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send('key-not-found');
        });
      }
    });
}

function openSIVWindow() {
  return new Promise((resolve, reject) => {
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
