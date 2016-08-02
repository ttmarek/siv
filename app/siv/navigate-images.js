module.exports = navigateImages

/**
 * @param {string} direction either "next" or "prev"
 * @param {string} currentImg path of the current image
 * @param {array} pathsList list of paths to navigate
 * @returns {string} the next or previous image path
 */
function navigateImages (direction, currentImg, pathsList) {
  if (pathsList.length > 0) {
    const currIndex = pathsList.indexOf(currentImg)
    if (currIndex === -1) {
      return pathsList[0]
    } else {
      const maxIndex = pathsList.length - 1
      const nextIndex = (() => {
        switch (direction) {
          case 'next':
            return currIndex === maxIndex ? 0 : currIndex + 1
          case 'prev':
            return currIndex === 0 ? maxIndex : currIndex - 1
          default:
            return 0
        }
      })()
      return pathsList[nextIndex]
    }
  }
  return ''
}
