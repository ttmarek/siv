const fs = require('fs')
'use strict'
module.exports = saveImage

function saveImage (filePath, state) {
  const canvasElements = state.canvasRefs
  const combinedCanvas = document.createElement('canvas')
  combinedCanvas.height = state.viewerDimensions.height
  combinedCanvas.width = state.viewerDimensions.width
  const ctx = combinedCanvas.getContext('2d')
  canvasElements.forEach(element => {
    ctx.drawImage(element, 0, 0)
  })
  const imageData = combinedCanvas.toDataURL().replace('data:image/png;base64,', '')
  fs.writeFile(filePath, imageData, 'base64')
}
