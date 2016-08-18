const electron = require('electron');

function open() {
  let window = new electron.BrowserWindow({
    autoHideMenuBar: true,
    title: 'SIV Calculator',
    width: 550,
    height: 400,
  });
  window.on('closed', () => {
    window = null;
  });
  window.loadURL(`file://${__dirname}/calculator.html`);
}

module.exports = {
  open,
};
