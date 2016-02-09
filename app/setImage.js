const loadImage = require('./loadImage')
const sivEvents = require('./siv-events')
module.exports = setImage

function setImage (src, sivDispatch) {
  loadImage(src)
    .then(imgSrc => {
      sivDispatch(
        sivEvents.setCurrentImg(imgSrc)
      )
    })
    .catch(err => {
      console.log('error loading image')
    })
}
