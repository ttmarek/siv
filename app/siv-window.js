'use strict';

const electron = require('electron');

module.exports = {
  open,
};

function open (showDevTools) {
  return new Promise(resolve => {
    let window = new electron.BrowserWindow({
      title: 'SIV',
      width: 1260,
      height: 800,
    });
    window.on('closed', () => {
      window = null;
    });
    window.loadURL(`file://${__dirname}/siv.html`);
    if (showDevTools) {
      window.webContents.openDevTools();
    }
    window.webContents.on('did-finish-load', () => {
      resolve(window);
    });
  });
}
