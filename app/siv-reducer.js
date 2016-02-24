'use strict'
const ImageLayer = require('./image')
const sivActions = require('./siv-actions')
const initialState = {
  currentImg: '',
  fileBoxes: [],
  currentFileBox: 0,
  user: null,
  filesShown: true,
  filePaths: {hierarchy: [], pathsList: []},
  viewerDimensions: {width: 0, height: 0, top: 0, left: 0},
  downloadedExts: [],
  openedExts: [],
  extControls: [],
  extStores: {},
  canvasRefs: [],
  layers: [ImageLayer]
}
const sivReducer = (state, action) => {
  const currentState = state || initialState
  const update = (updates) => {
    return Object.assign({}, currentState, updates)
  }
  switch (action.type) {
    case'SAVE_TO_CURRENT_FILE_BOX':
      const saveToFileBox = require('./save-to-filebox')
      const fileBoxesCopy = currentState.fileBoxes.slice()
      const currentFileBox = fileBoxesCopy[currentState.currentFileBox]
      fileBoxesCopy[currentState.currentFileBox] = saveToFileBox(action.filePath, currentFileBox)
      return update({
        filesShown: true,
        fileBoxes: fileBoxesCopy
      })
    case 'SET_CURRENT_FILE_BOX':
      return update({
        currentFileBox: action.Id
      })
    case 'CLEAR_FILE_BOXES':
      return update({
        fileBoxes: [],
        currentFileBox: 0
      })
    case 'CLOSE_FILE_BOX':
      return update({
        fileBoxes: currentState.fileBoxes.filter((val, index) => index !== action.index),
        currentFileBox: 0
      })
    case 'ADD_NEW_FILE_BOX':
      return update({
        fileBoxes: currentState.fileBoxes.concat(action.fileBox),
        currentFileBox: currentState.fileBoxes.length
      })
    case sivActions.CLOSE_EXTENSION:
      const extId = action.extId
      return update({
        extStores: Object.assign({}, currentState.extStores, {
          [extId]: undefined
        }),
        extControls: currentState.extControls.filter(Controls => {
          return Controls.extId !== extId
        }),
        layers: currentState.layers.filter(Layer => {
          return Layer.extId !== extId
        }),
        openedExts: currentState.openedExts.filter(openedExtId => {
          return openedExtId !== extId
        }),
        canvasRefs: currentState.canvasRefs.filter(canvas => {
          const canvasExtId = canvas.getAttribute('data-extid')
          return canvasExtId !== extId
        })
      })
    case sivActions.ACTIVATE_LAYER:
      const layers = currentState.layers.slice() // make a copy
      const index = layers.findIndex(layer => {
        return layer.extId === action.extId
      })
      const layer = layers.splice(index, 1)[0]
      layers.push(layer)
      // -------------------------------------
      const extControls = currentState.extControls.slice() // make a copy
      const index2 = extControls.findIndex(Controls => {
        return Controls.extId === action.extId
      })
      const controller = extControls.splice(index2, 1)[0]
      return update({
        layers,
        extControls: [controller].concat(extControls),
        filesShown: false
      })
    case sivActions.REGISTER_NEW_EXTENSION:
      const updates = {}
      updates.filesShown = false
      updates.openedExts = currentState.openedExts.concat(action.id)
      updates.extControls = [action.controls].concat(currentState.extControls)
      if (action.layer) {
        updates.layers = currentState.layers.concat(action.layer)
      }
      if (action.store) {
        updates.extStores = Object.assign({}, currentState.extStores, {
          [action.id]: action.store
        })
      }
      return update(updates)
    case sivActions.SHOW_HIDE_FILES:
      return update({
        filesShown: !currentState.filesShown
      })
    case sivActions.SET_DOWNLOADED_EXTS:
      return update({
        downloadedExts: action.downloadedExts
      })
    case sivActions.ADD_CANVAS_REF:
      // This is called whenever a layer mounts
      // Keep in mound that layer mounts whenever the layers are re-ordered.
      const filteredArray = currentState.canvasRefs.filter(canvas => {
        const extId = canvas.getAttribute('data-extid')
        return extId !== action.extId
      })
      // If you don't filter the array then a reference to the first
      // mounted canvas is kept. (i.e. if you reorder layers and change
      // things those changes wont be reflected in the saved canvas
      return update({
        canvasRefs: filteredArray.concat(action.canvasRef)
      })
    case sivActions.SET_VIEWER_DIMENSIONS:
      return update({viewerDimensions: action.dimensions})
    case sivActions.NAVIGATE_TO_IMG:
      const currentImg = currentState.currentImg
      const pathsList = currentState.filePaths.pathsList
      if (currentImg && pathsList.length > 0) {
        const currIndex = pathsList.indexOf(currentImg)
        if (currIndex === -1) {
          return update({
            currentImg: pathsList[0]
          })
        }
        const maxIndex = pathsList.length - 1
        let index = 0
        if (action.navigateTo === 'next') {
          currIndex === maxIndex ? index = 0 : index = currIndex + 1
        } else if (action.navigateTo === 'prev') {
          currIndex === 0 ? index = maxIndex : index = currIndex - 1
        }
        return update({
          currentImg: pathsList[index]
        })
      }
      return currentState
    case sivActions.SET_FILE_PATHS:
      return update({
        filePaths: action.filePaths
      })
    case sivActions.SET_CURRENT_IMG:
      return update({
        currentImg: action.imgPath
      })
    default:
      return currentState
  }
}

module.exports = sivReducer
