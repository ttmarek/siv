'use strict'
const electron = require('electron')
const handleInput = require('./handle-input')

const shouldQuit = electron.app.makeSingleInstance(argv => {
  handleInput(argv)
  return true
})

if (shouldQuit) {
  electron.app.quit()
} else {
  const path = require('path')
  const fs = require('fs')
  const auth = require('./auth')
  const menuBar = require('./menu-bar')
  const exts = require('./extensions')
  // Its important that references are kept to these objects so they
  // don't get garbage collected:
  electron.app.sivWindow = null
  electron.app.userId = null      // for checkForKey
  electron.app.trayIcon = null
  electron.app.downloadedExts = []

  electron.app.on('ready', () => {
    electron.Menu.setApplicationMenu(menuBar)
    electron.app.sivWindow = new electron.BrowserWindow({
      title: 'SIV',
      width: 1260,
      height: 800,
      show: false
    })

    const sivBW = electron.app.sivWindow // the browser window (BW)
    const sivWP = sivBW.webContents      // the web page (WP)

    sivBW.on('close', event => {
      event.preventDefault()    // don't close the window
      sivWP.send('clear-file-paths')
      sivBW.hide()
    })

    sivBW.loadURL(`file://${__dirname}/siv.html`)

    handleInput(process.argv)

    auth.getUserObject()
      .then(userObj => {
        if (electron.app.devMode) {
          userObj = {
            id: 'developer',
            extensions: [{name: 'caliper', id: 'GyMG'},
                         {name: 'sccir', id: 'G9Wd'}]
          }
        }
        electron.app.userId = userObj.id
        setInterval(checkForKey, 3000)
        makeTrayIcon(userObj.id)
        return userObj
      })
      .then(exts.download)
      .then(downloadedExts => {
        const sendSIVExtensions = () => {
          sivWP.send('extensions-downloaded', downloadedExts)
        }
        if (sivWP.isLoading()) {
          sivWP.on('did-finish-load', sendSIVExtensions)
        } else {
          sendSIVExtensions()
        }
        electron.app.downloadedExts = downloadedExts
      })
      .catch(err => {
        console.log('Error signing in or downloading extensions', err)
      })
  })

  electron.app.on('quit', () => {
    if (!electron.app.devMode) {            // keep in mind that
      // when you are in dev mode you don't want to
      // remove your working files when SIV shuts down
      electron.app.downloadedExts.forEach(extObj => {
        fs.unlinkSync(extObj.path)
      })
    }
  })

  electron.app.on('window-all-closed', (event) => {
    // The following prevents the app from quiting when all its windows
    // are closed:
    event.preventDefault()
  })

  function makeTrayIcon () {
    const contextMenu = electron.Menu.buildFromTemplate([
      {
        type: 'normal',
        label: 'Shutdown SIV',
        click () {
          electron.app.sivWindow.destroy()
          electron.app.quit()
        }
      }
    ])

    const trayIcon = new electron.Tray(path.join(__dirname, 'icons', 'siv-icon-32x32.png'))
    trayIcon.setContextMenu(contextMenu)
    electron.app.trayIcon = trayIcon // ensures it doesn't get garbage collected
  }

  function checkForKey () {
    switch (electron.app.userId) {
      case 'guest':
        return
      case 'developer':
        return
      case 'no-connection':
        return
      default:
        auth.getSerialInfo()
          .then(serialNum => {
            electron.BrowserWindow.getAllWindows().forEach(win => {
              const keyFound = serialNum === electron.app.userId
              win.webContents.send('access-key-checked', keyFound)
            })
          })
    }
  }
}
