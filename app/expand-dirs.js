'use strict';

const fs = require('fs');
const Path = require('path');
const naturalSort = require('javascript-natural-sort');

function isValidFile (path) {
  const fileTypes = ['jpg', 'jpeg', 'bmp', 'png'];
  // e.g. If fileTypes = ['jpg', 'png'] Then fileRegExp = /.+\(jpg|png)/
  const fileRegExp = new RegExp(`.+\\.(${fileTypes.join('|')})`, 'i');
  return fs.statSync(path).isFile() && fileRegExp.test(path);
}

function isValidDir (path) {
  return fs.statSync(path).isDirectory();
}

function expandDirs (pathsToOpen) {
  if (pathsToOpen.length === 0) {
    return { hierarchy: [], pathsList: [] };
  }
  const pathsList = [];
  const hierarchy = [];
  const numPaths = pathsToOpen.length;
  for (let i = 0; i < numPaths; i++) {
    const path = pathsToOpen[i];
    if (isValidFile(path)) {
      hierarchy.push(path);
      pathsList.push(path);
    } else if (isValidDir(path)) {
      const children = fs.readdirSync(path).sort(naturalSort).map(name => {
        return Path.join(path, name);
      });
      const filteredPaths = children.filter(isValidFile);
      if (filteredPaths.length > 0) {
        hierarchy.push({dir: path, children: filteredPaths});
        pathsList.push(...filteredPaths);
      }
    }
  }
  return {hierarchy, pathsList};
}

module.exports = expandDirs;
