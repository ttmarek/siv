'use strict'
const electron = require('electron')

const menuBar = electron.Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: (item, focusedWindow) => {
          electron.dialog.showSaveDialog(
            {
              filters: [{name: 'Images', extensions: ['png']}]
            },
            (filePath) => {
              // filePath will be undefined if the user cancels out of the save dialog:
              if (filePath) {
                focusedWindow.webContents.send('save-image', filePath)
              }
            }
          )
        }
      }
    ]
  }
])

module.exports = menuBar
