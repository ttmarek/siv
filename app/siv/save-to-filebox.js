'use strict'

module.exports = saveToFileBox

function saveToFileBox (filePath, filePaths) {
  const updatedPathsList = [filePath].concat(filePaths.pathsList)

  const savedFolderIndex = (() => {
    return filePaths.hierarchy.findIndex(element => {
      return (typeof element === 'object' &&
              element.dir &&
              element.dir === 'saved')
    })
  })()

  const updatedHierarchy = (() => {
    if (savedFolderIndex !== -1) {
      const copy = filePaths.hierarchy.slice()
      copy[savedFolderIndex].children.push(filePath)
      return copy
    } else {
      return [{
        dir: 'saved',
        children: [filePath]
      }].concat(filePaths.hierarchy)
    }
  })()

  return {
    hierarchy: updatedHierarchy,
    pathsList: updatedPathsList
  }
}
