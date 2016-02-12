module.exports = navigateImages

/**
 * @param {string} direction either "next" or "prev"
 * @param {object} store redux store with list of paths and the current path
 * @returns {string} the next or previous image path
 */
function navigateImages (direction, store) {
  const state = store.getState()
  const currentImg = state.currentImg
  const pathsList = state.filePaths.pathsList
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
