'use strict'
const fs = require('fs')
const sivEvents = require('./siv-events')

module.exports = {
  combineLayers,
  image,
  updateFilePaths
}

function combineLayers(canvasElements, dimensions) {
  const combinedCanvas = document.createElement('canvas')
  combinedCanvas.height = dimensions.height
  combinedCanvas.width = dimensions.width
  const ctx = combinedCanvas.getContext('2d')
  canvasElements.forEach(element => {
    ctx.drawImage(element, 0, 0)
  })
  return combinedCanvas
}

function image (filePath, store) {
  const state = store.getState()
  const canvasElements = state.canvasRefs
  const combinedCanvas = combineLayers(canvasElements, state.viewerDimensions)
  const imageData = combinedCanvas.toDataURL().replace('data:image/png;base64,', '')
  fs.writeFile(filePath, imageData, 'base64', () => {
    store.dispatch(
      sivEvents.setFilePaths(updateFilePaths(filePath, state.filePaths))
    )
  })
}

function updateFilePaths(filePath, filePaths) {
  const updatedPathsList = [filePath].concat(filePaths.pathsList)

  const savedFolderIndex = (() => {
    return filePaths.hierarchy.findIndex(element => {
      return (typeof element === 'object' &&
              element.dir &&
              element.dir === 'saved')
    })
  })()

  const updatedHierarchy = (() => {
    if (savedFolderIndex !== -1) {
      const copy = filePaths.hierarchy.slice()
      copy[savedFolderIndex].children.push(filePath)
      return copy
    } else {
      return [{
        dir: 'saved',
        children: [filePath]
      }].concat(filePaths.hierarchy)
    }
  })()

  return {
    hierarchy: updatedHierarchy,
    pathsList: updatedPathsList
  }
}
