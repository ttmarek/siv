'use strict'
const ImageLayer = require('./image')

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
    case 'SAVE_TO_CURRENT_FILE_BOX':
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
    case 'CLOSE_EXTENSION':
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
    case 'ACTIVATE_LAYER':
      const moveElement = require('move-element')
      // move action.extId's layer to the bottom of the layers array
      const layers = moveElement(currentState.layers,
                                 layer => layer.extId === action.extId,
                                 currentState.layers.length - 1)
      // move action.extId's controls to the top of the extControls arrray
      const extControls = moveElement(currentState.extControls,
                                      controls => controls.extId === action.extId,
                                      0)
      // update the state
      return update({layers, extControls, filesShown: false})
    case 'REGISTER_NEW_EXTENSION':
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
    case 'SHOW_HIDE_FILES':
      return update({
        filesShown: !currentState.filesShown
      })
    case 'SET_DOWNLOADED_EXTS':
      return update({
        downloadedExts: action.downloadedExts
      })
    case 'ADD_CANVAS_REF':
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
    case 'SET_VIEWER_DIMENSIONS':
      return update({viewerDimensions: action.dimensions})
    case 'SET_FILE_PATHS':
      return update({
        filePaths: action.filePaths
      })
    case 'SET_CURRENT_IMG':
      return update({
        currentImg: action.imgPath
      })
    default:
      return currentState
  }
}

module.exports = sivReducer
