const setImage = require('./setImage')
module.exports = navigateImages

function navigateImages(direction, sivStore) {
  const sivState = sivStore.getState()
  const currentImg = sivState.currentImg
  const pathsList = sivState.filePaths.pathsList
  if (currentImg && pathsList.length > 0) {
    const currIndex = pathsList.indexOf(currentImg)
    if (currIndex === -1) {
      setImage(pathsList[0], sivStore.dispatch)
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
      setImage(pathsList[nextIndex], sivStore.dispatch)
    }
  }
}
