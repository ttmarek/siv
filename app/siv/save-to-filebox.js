'use strict';

function saveToFileBox(filePath, filePaths) {
  const updatedPathsList = [filePath].concat(filePaths.pathsList);

  const savedFolderIndex = filePaths.hierarchy.findIndex(element =>
    (typeof element === 'object' &&
     element.dir &&
     element.dir === 'saved'));

  const updatedHierarchy = (() => {
    if (savedFolderIndex !== -1) {
      const copy = filePaths.hierarchy.slice();
      copy[savedFolderIndex].children.push(filePath);
      return copy;
    }
    return [{
      dir: 'saved',
      children: [filePath],
    }].concat(filePaths.hierarchy);
  })();

  return {
    hierarchy: updatedHierarchy,
    pathsList: updatedPathsList,
  };
}

module.exports = saveToFileBox;
