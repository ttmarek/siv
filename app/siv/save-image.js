'use strict'
const fs = require('fs')

const combineLayers = (canvasElements, dimensions) => {
  const combinedCanvas = document.createElement('canvas')
  combinedCanvas.height = dimensions.height
  combinedCanvas.width = dimensions.width
  const ctx = combinedCanvas.getContext('2d')
  canvasElements.forEach(element => {
    ctx.drawImage(element, 0, 0)
  })
  return combinedCanvas
}

const saveImage = (filePath, canvasElements, viewerDimensions) => {
  return new Promise((resolve, reject) => {
    const combinedCanvas = combineLayers(canvasElements, viewerDimensions)
    const imageData = combinedCanvas.toDataURL().replace('data:image/png;base64,', '')
    fs.writeFile(filePath, imageData, 'base64', err => {
      if (err) {
        reject(err)
      }
      resolve(filePath)
    })
  })
}

module.exports = saveImage
