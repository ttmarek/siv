const Fs = require('fs');
const Path = require('path');

/**
 * - If the provided path is to a file, then the function returns a
 * list of all images within that file's root directory.
 * - If the provided path is to a directory, then the function returns a
 * list of all images within the directory and all its subdirectories.
 * - The function returns a promise whose first and only argument is the
 * list of paths.
 */
function parsedir(inputPath, maxFiles = 300) {
  const fileTypes = ['jpg', 'jpeg', 'bmp', 'png'];
  // e.g. If fileTypes = ['jpg', 'png'] Then fileRegExp = /.+\(jpg|png)/
  const fileRegExp = new RegExp(`.+\\.(${fileTypes.join('|')})`, 'i');

  return new Promise((resolve, reject) => {
    const inputPathStats = Fs.statSync(inputPath);

    if (inputPathStats.isFile()) {
      const dirName = Path.dirname(inputPath);
      let paths = Fs.readdirSync(dirName);
      
      paths = paths.map(path => {
        return Path.join(dirName, path);
      });
      
      paths = paths.filter(path => {
        return Fs.statSync(path).isFile() && fileRegExp.test(path);
      });
      
      paths.splice(maxFiles, paths.length - maxFiles);
      
      paths.sort();
      
      resolve({hierarchy: paths, list: paths});
    } else if (inputPathStats.isDirectory()) {
      let filesCount = 0;
      const filesList = [];
      
      const makePaths = function makePaths(root) {
        let filesDirs = Fs.readdirSync(root);
        const filesDirsLen = filesDirs.length;
        const paths = [];

        const files = filesDirs.filter(fileOrDir => {
          return Fs.statSync(Path.join(root, fileOrDir)).isFile();
        });

        const dirs = filesDirs.filter(fileOrDir => {
          return Fs.statSync(Path.join(root, fileOrDir)).isDirectory();
        });

        files.sort();
        dirs.sort();

        filesDirs = [...files, ...dirs];

        for (let i = 0; i < filesDirsLen; i++) {
          const fullPath = Path.join(root, filesDirs[i]);

          if (Fs.statSync(fullPath).isDirectory()) {
            paths.push({path: fullPath,
                        contents: makePaths(fullPath)});
          } else {
            if (fileRegExp.test(fullPath) && filesCount < maxFiles) {
              filesCount++;
              paths.push(fullPath);
              filesList.push(fullPath);
            }
          }
        }

        return paths;
      };
      resolve({hierarchy: makePaths(inputPath), list: filesList});
    } else {
      reject('inputPathStats fails isDirectory() and isFile()');
    }
  });
}

module.exports = parsedir;
