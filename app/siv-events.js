'use strict'
const sivActions = require('./siv-actions')
module.exports = {
  extensionCloseRequest (extId) {
    return {
      type: sivActions.CLOSE_EXTENSION,
      extId
    }
  },
  activateLayerRequested (extId) {
    return {
      type: sivActions.ACTIVATE_LAYER,
      extId
    }
  },
  newExtOpened (ext) {
    return {
      type: sivActions.REGISTER_NEW_EXTENSION,
      id: ext.id,
      controls: ext.controls,
      layer: ext.layer,
      store: ext.store
    }
  },
  sidebarToggleClicked () {
    return {
      type: sivActions.SHOW_HIDE_FILES
    }
  },
  extsDownloaded (downloadedExts) {
    return {
      type: sivActions.SET_DOWNLOADED_EXTS,
      downloadedExts
    }
  },
  layerAdded (extId, canvasRef) {
    return {
      type: sivActions.ADD_CANVAS_REF,
      canvasRef,
      extId
    }
  },
  setViewerDimensions (boundingClientRect) {
    return {
      type: sivActions.SET_VIEWER_DIMENSIONS,
      dimensions: boundingClientRect
    }
  },
  setFilePaths (filePaths) {
    return {
      type: sivActions.SET_FILE_PATHS,
      filePaths: filePaths
    }
  },
  setCurrentImg (imgPath) {
    return {
      type: sivActions.SET_CURRENT_IMG,
      imgPath: imgPath
    }
  }
}
