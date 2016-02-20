'use strict'
const fs = require('fs')

module.exports = saveImage

function saveImage (filePath, canvasElements, viewerDimensions, onSave) {
  const combinedCanvas = combineLayers(canvasElements, viewerDimensions)
  const imageData = combinedCanvas.toDataURL().replace('data:image/png;base64,', '')
  fs.writeFile(filePath, imageData, 'base64', onSave)
}

function combineLayers (canvasElements, dimensions) {
  const combinedCanvas = document.createElement('canvas')
  combinedCanvas.height = dimensions.height
  combinedCanvas.width = dimensions.width
  const ctx = combinedCanvas.getContext('2d')
  canvasElements.forEach(element => {
    ctx.drawImage(element, 0, 0)
  })
  return combinedCanvas
}
