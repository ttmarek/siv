'use strict'
const electron = require('electron')
const handleInput = require('./handle-input')

function init () {
  const shouldQuit = electron.app.makeSingleInstance(argv => {
    console.log('Single instance callback called ', Date.now())
    handleInput(argv)
    return true
  })
  if (shouldQuit) {
    electron.app.quit()
  }
}


module.exports.init = init
