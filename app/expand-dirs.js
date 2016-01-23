'use strict';
const fs = require('fs');
const Path = require('path');

function isValidFile(path) {
  const fileTypes = ['jpg', 'jpeg', 'bmp', 'png'];
  // e.g. If fileTypes = ['jpg', 'png'] Then fileRegExp = /.+\(jpg|png)/
  const fileRegExp = new RegExp(`.+\\.(${fileTypes.join('|')})`, 'i');
  return fs.statSync(path).isFile() && fileRegExp.test(path);
}

function isValidDir(path) {
  return fs.statSync(path).isDirectory();
}

function expandDirs(pathsToOpen) {
  return new Promise((resolve, reject) => {
    if (pathsToOpen.length === 0) resolve({hierarchy:[], pathsList:[]});
    const pathsList = [];
    const hierarchy = [];       // could use a better name
    pathsToOpen.forEach(path => {
      if (isValidFile(path)) {
        hierarchy.push(path);
        pathsList.push(path);
      } else if (isValidDir(path)){
        const children = fs.readdirSync(path).map(name => {
          return Path.join(path, name);
        });
        const filteredPaths = children.filter(isValidFile);
        if (filteredPaths.length > 0) {
          hierarchy.push({dir: path, children: filteredPaths});
          pathsList.push(...filteredPaths);
        }
      }
    });
    resolve({hierarchy, pathsList});
  });
}

module.exports = expandDirs;
