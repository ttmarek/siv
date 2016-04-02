const loadImage = require('./loadImage')

module.exports = setImage

/**
 * Sets the image with 'src' as the current image
 * @param {string} src the image path
 * @param {func} sivDispatch redux dispatch function
 */
function setImage (src, sivDispatch) {
  loadImage(src)
    .then(imgSrc => {
      sivDispatch({
        type: 'SET_CURRENT_IMG',
        imgPath: imgSrc
      })
    })
    .catch(err => {
      console.log('Error loading image', err)
    })
}
