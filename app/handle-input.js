'use strict'
const electron = require('electron')
const minimist = require('minimist')
const expandDirs = require('./expand-dirs')
const path = require('path')

function handleInput (cliArgs) {
  const parsedArgs = minimist(cliArgs.slice(2), {boolean: true})
  if (parsedArgs.help) {
    require('./cli-help')(electron.app.getVersion())
  } else if (parsedArgs.quit) {
    electron.app.sivWindow.destroy()
    electron.app.quit()
  } else {
    if (parsedArgs.dev) {
      // When SIV quits it deletes all extensions that were
      // downloaded.  This boolean is needed to prevent SIV from
      // deleting extensions that you're working on.
      electron.app.devMode = true
    }
    if (!parsedArgs.start) {
      const pathsToOpen = parsedArgs.singleFile ? [path.dirname(parsedArgs._[0])] : parsedArgs._
      const currentImg = parsedArgs.singleFile ? parsedArgs._[0] : undefined
      expandDirs(pathsToOpen)
        .then(filePaths => {
          const siv = electron.app.sivWindow.webContents
          const sendSIVPaths = () => {
            siv.send('file-paths-prepared', {
              filePaths,
              currentImg
            })
          }
          if (siv.isLoading()) {
            siv.on('did-finish-load', sendSIVPaths)
          } else {
            sendSIVPaths()
          }
          electron.app.sivWindow.show()
          // Open dev tools if required and authorized
          if ((parsedArgs.dev || parsedArgs.devTools)  &&
              parsedArgs.pass && devToolsAuthorized(parsedArgs.pass)) {
            electron.app.sivWindow.openDevTools()
          }
        })
        .catch(err => {
          console.log('Error expanding dirs: ', err)
        })
    }
  }
}

function devToolsAuthorized (pass) {
  return pass === 'marek8'
}

module.exports = handleInput
