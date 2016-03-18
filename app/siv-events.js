'use strict'

module.exports = {
  extensionCloseRequest (extId) {
    return {
      type: 'CLOSE_EXTENSION',
      extId
    }
  },
  activateLayerRequested (extId) {
    return {
      type: 'ACTIVATE_LAYER',
      extId
    }
  },
  newExtOpened (ext) {
    return {
      type: 'REGISTER_NEW_EXTENSION',
      id: ext.id,
      controls: ext.controls,
      layer: ext.layer,
      store: ext.store
    }
  },
  sidebarToggleClicked () {
    return {
      type: 'SHOW_HIDE_FILES'
    }
  },
  extsDownloaded (downloadedExts) {
    return {
      type: 'SET_DOWNLOADED_EXTS',
      downloadedExts
    }
  },
  layerAdded (extId, canvasRef) {
    return {
      type: 'ADD_CANVAS_REF',
      canvasRef,
      extId
    }
  },
  setViewerDimensions (boundingClientRect) {
    return {
      type: 'SET_VIEWER_DIMENSIONS',
      dimensions: boundingClientRect
    }
  },
  setFilePaths (filePaths) {
    return {
      type: 'SET_FILE_PATHS',
      filePaths: filePaths
    }
  },
  setCurrentImg (imgPath) {
    return {
      type: 'SET_CURRENT_IMG',
      imgPath: imgPath
    }
  }
}
