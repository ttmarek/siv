const loadImage = require('./loadImage')
const sivEvents = require('./siv-events')
module.exports = setImage

/**
 * Sets the image with 'src' as the current image
 * @param {string} src the image path
 * @param {func} sivDispatch redux dispatch function
 */
function setImage (src, sivDispatch) {
  loadImage(src)
    .then(imgSrc => {
      sivDispatch(
        sivEvents.setCurrentImg(imgSrc)
      )
    })
    .catch(err => {
      console.log('Error loading image', err)
    })
}
