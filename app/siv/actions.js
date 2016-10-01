function closeFileBox(fileBoxID) {
  return {
    type: 'CLOSE_FILE_BOX',
    index: fileBoxID,
  };
}

function setCurrentImg(path) {
  return {
    type: 'SET_CURRENT_IMG',
    imgPath: path,
  };
}

function closeExtension(extensionID) {
  return {
    type: 'CLOSE_EXTENSION',
    extId: extensionID,
  };
}

function toggleFilesShown() {
  return {
    type: 'SHOW_HIDE_FILES',
  };
}

module.exports = {
  closeFileBox,
  setCurrentImg,
  closeExtension,
  toggleFilesShown,
};
