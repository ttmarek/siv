'use strict'
function loadImage (imgSrc) {
  console.log('imgSrc:', imgSrc)
  imgSrc = imgSrc.replace(/#/g, '%23')
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = () => {
      resolve(imgSrc)
    }
    img.onerror = (err) => {
      reject()
    }
    img.src = imgSrc
  })
}

module.exports = loadImage
