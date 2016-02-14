'use strict'

/**
 * Loads an image into the http cache
 * @param {string} imgSrc image path
 * @returns {string} loaded image path
 */
function loadImage (imgSrc) {
  imgSrc = imgSrc.replace(/#/g, '%23')
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = () => {
      resolve(imgSrc)
    }
    img.onerror = (err) => {
      reject(err)
    }
    img.src = imgSrc
  })
}

module.exports = loadImage
