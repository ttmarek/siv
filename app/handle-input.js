'use strict';

const electron = require('electron');
const minimist = require('minimist');
const expandDirs = require('./expand-dirs');
const path = require('path');

function handleInput (cliArgs) {
  const parsedArgs = minimist(cliArgs.slice(2), {boolean: true});
  if (parsedArgs.help) {
    require('./cli-help')(electron.app.getVersion());
  } else if (parsedArgs.quit) {
    electron.app.sivWindow.destroy();
    electron.app.quit();
  } else if (parsedArgs.calc) {
    require('./calculator/window').open();
  } else {
    if (!parsedArgs.start) {
      const pathsToOpen = parsedArgs.singleFile ? [path.dirname(parsedArgs._[0])] : parsedArgs._;
      const currentImg = parsedArgs.singleFile ? parsedArgs._[0] : undefined;
      const filePaths = expandDirs(pathsToOpen);
      const siv = electron.app.sivWindow.webContents;

      const sendSIVPaths = () => {
        siv.send('file-paths-prepared', {
          filePaths,
          currentImg
        });
      };

      if (siv.isLoading()) {
        siv.on('did-finish-load', sendSIVPaths);
      } else {
        sendSIVPaths();
      }

      electron.app.sivWindow.show();

      if (parsedArgs.devTools) {
        electron.app.sivWindow.openDevTools();
      }
    }
  }
}

module.exports = handleInput;
