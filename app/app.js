'use strict'
const electron = require('electron')
const minimist = require('minimist')
const Table = require('cli-table2')
const path = require('path')
const fs = require('fs')
const auth = require('./auth')
const exts = require('./extensions')
const expandDirs = require('./expand-dirs')
const sivWindow = require('./siv-window')
const menuBar = require('./menu-bar')

function logHelp () {
  const version = `SIV v${electron.app.getVersion()}\n`
  const usage = `Usage: "" (options) path1 path2 ...\n`
  const description = [`SIV accepts paths to folders or image files. To open`,
                       `multiple paths enter them one after another`,
                       `with a space between each path.`].join('\n')
  const options = new Table({
    head: ['Options', 'Description'],
    colWidths: [15, 50],
    chars: {
      'top': '-', 'top-mid': '+', 'top-left': '+', 'top-right': '+',
      'bottom': '-', 'bottom-mid': '+', 'bottom-left': '+', 'bottom-right': '+',
      'left': '|', 'left-mid': '+', 'mid': '-', 'mid-mid': '+',
      'right': '|', 'right-mid': '+', 'middle': '|'
    }
  })
  options.push(['--help', 'Show this message and exit.'],
               ['--singleFile', ["Opens all image files under the path's folder.",
                                 'Ignores all but the first provided path.'].join('\n')],
               ['--login', "Start SIV, log in, don't open any windows."],
               ['--devTools', 'Open dev tools in each window.'],
               ['--dev', 'Run SIV in dev mode.'],
               ['--pass=[pass]', 'Password required for --dev and --devTools.'])
  process.stdout.write(version)
  process.stdout.write(usage)
  process.stdout.write('\n')
  process.stdout.write(description)
  process.stdout.write('\n\n')
  process.stdout.write(options.toString())
  process.stdout.write('\n')
  electron.app.quit()
}

function devToolsAuthorized (pass) {
  return pass === 'marek8'
}

// Anything added to the appState shouldn't get garbage collected
const appState = {
  userId: null,                 // for checkForKey
  trayIcon: null,
  downloadedExts: []
}

function logError (err) {
  // The logger should only be 'required' if there's an error.
  require('./logger').error(err)
}

function makeTrayIcon (userId) {
  const contextMenu = electron.Menu.buildFromTemplate([
    {type: 'normal', label: 'Shutdown SIV', click: () => electron.app.quit()},
    {type: 'separator'},
    {type: 'normal', label: `User: ${userId}`}
  ])

  const trayIcon = new electron.Tray(path.join(__dirname, 'icons', 'icon.png'))
  trayIcon.setToolTip('SIV Image Viewer')
  trayIcon.setContextMenu(contextMenu)
  appState.trayIcon = trayIcon
}

function checkForKey () {
  auth.getSerialInfo()
    .then(serialNum => {
      electron.BrowserWindow.getAllWindows().forEach(win => {
        const keyFound = serialNum === appState.userId
        win.webContents.send('access-key-checked', keyFound)
      })
    })
}

const existingInstance = electron.app.makeSingleInstance((argv) => {
  const sivCLI = minimist(argv.slice(2), {boolean: true})
  if (sivCLI.help) logHelp()
  const pathsToOpen = sivCLI.singleFile ? [path.dirname(sivCLI._[0])] : sivCLI._
  const currentImg = sivCLI.singleFile ? sivCLI._[0] : undefined
  // CREATE AND OPEN THE NTH SIV WINDOW
  sivWindow.open((sivCLI.dev || sivCLI.devTools) &&
                 devToolsAuthorized(sivCLI.pass))
    .then(browserWindow => {
      expandDirs(pathsToOpen)
        .then(filePaths => {
          browserWindow.webContents.send('file-paths-prepared', {
            filePaths,
            currentImg
          })
        })
        .catch(logError)
      browserWindow.webContents.send('extensions-downloaded', appState.downloadedExts)
    })
})

if (existingInstance) {
  electron.app.quit()
}

const sivCLI = minimist(process.argv.slice(2), {boolean: true})
if (sivCLI.help) logHelp()
const pathsToOpen = sivCLI.singleFile ? [path.dirname(sivCLI._[0])] : sivCLI._
const currentImg = sivCLI.singleFile ? sivCLI._[0] : undefined

electron.app.on('ready', () => {
  if (sivCLI.login) {
    auth.getUserObject()
      .then(userObj => {
        if (userObj.id !== 'guest' && userObj.id !== 'no-connection') {
          appState.userId = userObj.id
          setInterval(checkForKey, 3000)
        }
        makeTrayIcon(userObj.id)
        return exts.download(userObj)
      })
      .then(downloadedExts => {
        appState.downloadedExts = downloadedExts
      })
      .catch(logError)
  } else {
    electron.Menu.setApplicationMenu(menuBar)
    // CREATE AND OPEN THE FIRST SIV WINDOW
    sivWindow.open((sivCLI.dev || sivCLI.devTools) &&
                   devToolsAuthorized(sivCLI.pass))
      .then(browserWindow => {
        expandDirs(pathsToOpen)
          .then(filePaths => {
            browserWindow.webContents.send('file-paths-prepared', {
              filePaths,
              currentImg
            })
          })
          .catch(logError)

        if (sivCLI.dev) {
          const user = {
            id: 'developer',
            extensions: [{name: 'caliper', id: 'GyMG'},
                         {name: 'sccir', id: 'G9Wd'}]
          }
          makeTrayIcon(user.id)
          exts.download(user)
            .then(downloadedExts => {
              browserWindow.webContents.send('extensions-downloaded', downloadedExts)
              appState.downloadedExts = downloadedExts
            })
        } else {
          auth.getUserObject()
            .then(userObj => {
              if (userObj.id !== 'guest' && userObj.id !== 'no-connection') {
                appState.userId = userObj.id
                setInterval(checkForKey, 3000)
              }
              makeTrayIcon(userObj.id)
              return exts.download(userObj)
            })
            .then(downloadedExts => {
              browserWindow.webContents.send('extensions-downloaded', downloadedExts)
              appState.downloadedExts = downloadedExts
            })
            .catch(logError)
        }
      })
  }
})

electron.app.on('quit', () => {
  if (!sivCLI.dev) {            // keep in mind that
    // when you are in dev mode you don't want to
    // remove your working files when SIV shuts down
    appState.downloadedExts.forEach(extObj => {
      fs.unlinkSync(extObj.path)
    })
  }
})

electron.app.on('window-all-closed', (event) => {
  // The following prevents the app from quiting when all its windows
  // are closed:
  event.preventDefault()
})
