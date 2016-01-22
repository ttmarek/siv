const electron = require('electron');
const minimist = require('minimist');
const Table = require('cli-table2');
const auth = require('./auth');
const exts = require('./extensions');
const expandDirs = require('./expand-dirs');
const path = require('path');
const fs = require('fs');

function logHelp() {
  const version = `SIV v${electron.app.getVersion()}\n`;
  const usage = `Usage: "" (options) path1 path2 ...\n`;
  const description = [`SIV accepts paths to folders or image files. To open`,
                       `multiple paths enter them one after another`,
                       `with a space between each path.`].join('\n');
  const options = new Table({
    head: ['Options', 'Description'],
    colWidths: [15, 50],
    chars: {
      'top': '-', 'top-mid': '+', 'top-left': '+', 'top-right': '+',
      'bottom': '-', 'bottom-mid': '+', 'bottom-left': '+', 'bottom-right': '+',
      'left': '|', 'left-mid': '+', 'mid': '-', 'mid-mid': '+',
      'right': '|', 'right-mid': '+', 'middle': '|',
    },
  });
  options.push(['--help', 'Show this message and exit.'],
               ['--singleFile',["Opens all image files under the path's folder.",
                                'Ignores all but the first provided path.'].join('\n')],
               ['--devTools', 'Open dev tools in each window.'],
               ['--dev', 'Run SIV in dev mode.'],
               ['--pass=[pass]', 'Password required for --dev and --devTools.']);
  process.stdout.write(version);
  process.stdout.write(usage);
  process.stdout.write('\n');
  process.stdout.write(description);
  process.stdout.write('\n\n');
  process.stdout.write(options.toString());
  process.stdout.write('\n');
  electron.app.quit();
}

function devToolsAuthorized(pass) {
  return pass === 'marek8';
}

// Anything added to the appState shouldn't get garbage collected
const appState = {
  userId: null,                 // for checkForKey
  trayIcon: null,
  windows: {},
  downloadedExts: [],
};

function logError(err) {
  // The logger should only be 'required' if there's an error.
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
  appState.trayIcon = trayIcon;
}

function checkForKey() {
  auth.getSerialInfo()
    .then(serialNum => {
      electron.BrowserWindow.getAllWindows().forEach(win => {
        const keyFound = serialNum === appState.userId;
        win.webContents.send('access-key-checked', keyFound);
      });
    });
}

function openReportABugWindow() {
  const reportABugWindow = new electron.BrowserWindow({
    title: 'Report A Bug',
    width: 750,
    height: 800,
    autoHideMenuBar: true,
  });
  const winId = reportABugWindow.id;
  appState.windows = Object.assign({}, appState.windows, {[winId]: reportABugWindow});
  reportABugWindow.on('closed', () => {
    appState.windows = Object.assign({}, appState.windows, {[winId]: undefined});
  });
  reportABugWindow.loadURL('https://docs.google.com/forms/d/1cJSMfQInc7lv-iW3vf6SkU581c6KXFuyF6wx8oZ4h_g/viewform?usp=send_form');
}

function openReportAPPWindow() {
  const reportAPPWindow = new electron.BrowserWindow({
    title: 'Report A Pain Point',
    width: 750,
    height: 800,
    autoHideMenuBar: true,
  });
  const winId = reportAPPWindow.id;
  appState.windows = Object.assign({}, appState.windows, {[winId]: reportAPPWindow});
  reportAPPWindow.on('closed', () => {
    appState.windows = Object.assign({}, appState.windows, {[winId]: undefined});
  });
  reportAPPWindow.loadURL('https://docs.google.com/forms/d/1rR5Rxr_t3qoS0HacB3TDzw5tLRXx8vimekUljTb1XS0/viewform?usp=send_form');
}

function openSIVWindow(showDevTools) {
  return new Promise(resolve => {
    const browserWindow = new electron.BrowserWindow({
      title: 'SIV Image Viewer',
    });
    browserWindow.maximize();
    const winId = browserWindow.id;
    appState.windows = Object.assign({}, appState.windows, {[winId]: browserWindow});
    browserWindow.on('closed', () => {
      appState.windows = Object.assign({}, appState.windows, {[winId]: undefined});
    });
    browserWindow.loadURL(`file://${__dirname}/siv.html`);
    if (showDevTools) {
      browserWindow.webContents.openDevTools();
    }
    browserWindow.webContents.on('did-finish-load', () => {
      resolve(browserWindow);
    });
  });
}

const existingInstance = electron.app.makeSingleInstance((argv) => {
  const sivCLI = minimist(argv.slice(2), {boolean: true});
  if (sivCLI.help) logHelp();
  const {pathsToOpen, currentImg} = (() => {
    if (sivCLI.singleFile) {
      return {
        pathsToOpen: [path.dirname(sivCLI._[0])],
        currentImg: sivCLI._[0],
      };
    }
    return {pathsToOpen: sivCLI._};
  })();
  // CREATE AND OPEN THE NTH SIV WINDOW
  openSIVWindow((sivCLI.dev || sivCLI.devTools) &&
                devToolsAuthorized(sivCLI.pass))
    .then(browserWindow => {
      expandDirs(pathsToOpen)
        .then(filePaths => {
          browserWindow.webContents.send('file-paths-prepared', {
            filePaths,
            currentImg,
          });
        })
        .catch(logError);
      browserWindow.webContents.send('extensions-downloaded', appState.downloadedExts);
    });
});

if (existingInstance) {
  electron.app.quit();
}

const sivCLI = minimist(process.argv.slice(2), {boolean: true});
if (sivCLI.help) logHelp();
const {pathsToOpen, currentImg} = (() => {
  if (sivCLI.singleFile) {
    return {
      pathsToOpen: [path.dirname(sivCLI._[0])],
      currentImg: sivCLI._[0],
    };
  }
  return {pathsToOpen: sivCLI._};
})();

electron.app.on('ready', () => {
  const sendFilePath = (focusedWindow, filePath) => {
    // filePath will be undefined if the user cancels out of the save dialog:
    if (filePath) {
      focusedWindow.webContents.send('save-image', filePath);
    }
  };
  const saveDialogOpts = {
    filters: [
      {name: 'Images', extensions: ['png']},
    ],
  };
  // CREATE AND APPLY THE MENU BAR FOR ALL WINDOWS
  const menuBar = electron.Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: (item, focusedWindow) => {
            electron.dialog.showSaveDialog(saveDialogOpts,
                                           sendFilePath.bind(null, focusedWindow));
          },
        }
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Report a Bug',
          click: openReportABugWindow,
        },
        {
          label: 'Report a Pain Point',
          click: openReportAPPWindow,
        }
      ]
    }
  ]);
  electron.Menu.setApplicationMenu(menuBar);
  // ENABLE SIV WINDOWS TO SAVE IMAGES TO THE FILE SYSTEM
  electron.ipcMain.on('write-image-to-filesystem', (event, {filePath, imageData}) => {
    // filePath will be undefined if the user cancels out of the save dialog:
    if (filePath) {
      fs.writeFile(filePath, imageData, 'base64');
    }
  });
  // CREATE AND OPEN THE FIRST SIV WINDOW
  openSIVWindow((sivCLI.dev || sivCLI.devTools) &&
                devToolsAuthorized(sivCLI.pass))
    .then(browserWindow => {
      expandDirs(pathsToOpen)
        .then(filePaths => {
          browserWindow.webContents.send('file-paths-prepared', {
            filePaths,
            currentImg,
          });
        })
        .catch(logError);

      if (sivCLI.dev) {
        const user = {
          id: 'developer',
          extensions: [{name: 'caliper', id: 'GyMG'},
                       {name: 'sccir', id: 'G9Wd'}],
        };
        makeTrayIcon(user.id);
        exts.download(user)
          .then(downloadedExts => {
            browserWindow.webContents.send('extensions-downloaded', downloadedExts);
            appState.downloadedExts = downloadedExts;
          });
      } else {
        auth.getUserObject()
          .then(userObj => {
            if (userObj.id !== 'guest') {
              appState.userId = userObj.id;
              setInterval(checkForKey, 3000);
            }
            makeTrayIcon(userObj.id);
            return exts.download(userObj);
          })
          .then(downloadedExts => {
            browserWindow.webContents.send('extensions-downloaded', downloadedExts);
            appState.downloadedExts = downloadedExts;
          })
          .catch(logError);
      }
    });
});

electron.app.on('quit', () => {
  if (!sivCLI.dev) {            // keep in mind that
    // when you are in dev mode you don't want to
    // remove your working files when SIV shuts down
    appState.downloadedExts.forEach(extObj => {
      fs.unlinkSync(extObj.path);
    });
  }
});

electron.app.on('window-all-closed', (event) => {
  // The following prevents the app from quiting when all its windows
  // are closed:
  event.preventDefault();
});
