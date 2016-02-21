'use strict'
const electron = require('electron')
const path = require('path')
const fs = require('fs')
const auth = require('./auth')
const menuBar = require('./menu-bar')
const exts = require('./extensions')
const singleInstance = require('./single-instance')
const handleInput = require('./handle-input')

singleInstance.init()

electron.app.sivWindow = null
electron.app.userId = null      // for checkForKey
electron.app.trayIcon = null
electron.app.downloadedExts = []

electron.app.on('ready', () => {
  // PREPARE SIV WINDOW
  electron.Menu.setApplicationMenu(menuBar)
  electron.app.sivWindow = new electron.BrowserWindow({
    title: 'SIV',
    width: 1260,
    height: 800,
    show: false
  })
  electron.app.sivWindow.on('close', event => {
    event.preventDefault()
    electron.app.sivWindow.webContents.send('clear-file-paths')
    electron.app.sivWindow.hide()
  })
  electron.app.sivWindow.loadURL(`file://${__dirname}/siv.html`)
  // SEND FILE PATHS AND OPEN SIV IF APPLICABLE
  handleInput(process.argv)
  // SIGN IN AND DOWNLOAD EXTENSIONS
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
      const siv = electron.app.sivWindow.webContents
      const sendSIVExtensions = () => {
        siv.send('extensions-downloaded', downloadedExts)
      }
      if (siv.isLoading()) {
        siv.on('did-finish-load', sendSIVExtensions)
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


function makeTrayIcon (userId) {
  const contextMenu = electron.Menu.buildFromTemplate([
    {
      type: 'normal',
      label: 'Shutdown SIV',
      click () {
        electron.app.sivWindow.destroy()
        electron.app.quit()
      }
    },
    {type: 'separator'},
    {type: 'normal', label: `User: ${userId}`}
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
