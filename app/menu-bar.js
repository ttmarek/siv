'use strict'
const electron = require('electron')
const expandDirs = require('./expand-dirs')

const menuBar = electron.Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click (item, focusedWindow) {
          electron.dialog.showSaveDialog(
            {
              filters: [{name: 'Images', extensions: ['png']}]
            },
            filePath => {
              // filePath will be undefined if the user cancels out of the save dialog:
              if (filePath) {
                focusedWindow.webContents.send('save-image', filePath)
              }
            }
          )
        }
      },
      {
        label: 'Open',
        submenu: [
          {
            label: 'Image(s)',
            click (item, focusedWindow) {
              electron.dialog.showOpenDialog(
                {
                  title: 'Open an Image',
                  filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }],
                  properties: ['openFile', 'multiSelections']
                },
                imgsToOpen => {
                  if (imgsToOpen) { // imgsToOpen is undefined on Cancel
                    focusedWindow.webContents.send('file-paths-prepared', {
                      filePaths: expandDirs(imgsToOpen)
                    })
                  }
                }
              )
            }
          },
          {
            label: 'Folder(s)',
            click (item, focusedWindow) {
              electron.dialog.showOpenDialog(
                {
                  title: 'Open a Folder',
                  properties: ['openDirectory', 'multiSelections']
                },
                dirsToOpen => {
                  if (dirsToOpen) { // dirsToOpen is undefined on Cancel
                    focusedWindow.webContents.send('file-paths-prepared', {
                      filePaths: expandDirs(dirsToOpen)
                    })
                  }
                }
              )
            }
          }
        ]
      }
    ]
  }
])

module.exports = menuBar
