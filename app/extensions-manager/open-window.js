const electron = require('electron')

module.exports = () => {
  const windowOptions = {
    autoHideMenuBar: true,
    title: 'SIV Extensions Manager',
    width: 900,
    height: 600
  }
  let window = new electron.BrowserWindow(windowOptions)
  window.loadURL(`file://${__dirname}/index.html`)
  // GC the window object when the user closes it:
  window.on('closed', () => { window = null })
}
