'use strict';

const electron = require('electron');
const handleInput = require('./handle-input');

const shouldQuit = electron.app.makeSingleInstance(argv => {
  handleInput(argv);
  return true;
});

if (shouldQuit) {
  electron.app.quit();
} else {
  const path = require('path');
  const fs = require('fs');
  const menuBar = require('./menu-bar');
  // Its important that references are kept to these objects so they
  // don't get garbage collected:
  electron.app.sivWindow = null;
  electron.app.trayIcon = null;

  electron.app.on('ready', () => {
    // Create the sivWindow
    electron.Menu.setApplicationMenu(menuBar);
    electron.app.sivWindow = new electron.BrowserWindow({
      title: 'SIV',
      width: 1260,
      height: 800,
      show: false
    });
    const sivBW = electron.app.sivWindow; // the browser window (BW)
    const sivWP = sivBW.webContents;      // the web page (WP)
    // Hide the sivWindow when user the presses 'close' and clear the
    // fileBoxes.
    sivBW.on('close', event => {
      event.preventDefault();    // don't close the window
      sivWP.send('clear-file-paths');
      sivBW.hide();
    });
    sivBW.loadURL(`file://${__dirname}/siv/index.html`);
    // Parse the args for filepaths and options
    handleInput(process.argv);
    // Create a system tray icon
    const contextMenu = electron.Menu.buildFromTemplate([
      {
        type: 'normal',
        label: 'Shutdown SIV',
        click () {
          electron.app.sivWindow.destroy();
          electron.app.quit();
        }
      }
    ]);
    const trayIcon = new electron.Tray(path.join(__dirname, 'icons', 'siv-icon-32x32.png'));
    trayIcon.setContextMenu(contextMenu);
    electron.app.trayIcon = trayIcon; // ensures it doesn't get garbage collected
  });

  electron.app.on('window-all-closed', (event) => {
    // The following prevents the app from quiting when all its windows
    // are closed:
    event.preventDefault();
  });
}
