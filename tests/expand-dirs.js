const expect = require('chai').expect;
const mock = require('mock-fs');
const expandDirs = require('../build/expand-dirs.js');

describe('Function expandDirs', () => {
  it (`Returns all valid images, ignores other files and directories
    and skips over empty directories.`, () => {
      mock({
        'path/to/dir1': {
          'child-dir': {
            'some-image.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          },
          'some-image.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          'some-document.pdf': 'rubbish',
          'some-image.JPG': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          'some-spreadsheet.xls': 'spreadsheet data',
          'some-image.bmp': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          'some-spreadsheet.xlsx': 'spreadsheet data',
          'some-image.BMP': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          'some-word-file.doc': 'a report or something',
          'some-image.jpeg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          'some-word-file.docx': 'a report or something',
          'some-image.JPEG': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        },
        'path/to/dir2': {
          'image-a.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          'image-b.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          'image-c.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
          'some-document.pdf': 'rubbish',
        },
        'path/to/dir3': {/** empty directory */},
      });
      const test = expandDirs(['path/to/dir1',
                               'path/to/dir3',
                               'path/to/dir2/image-a.jpg',
                               'path/to/dir2/image-b.jpg',
                               'path/to/dir2/image-c.jpg',
                               'path/to/dir2/some-document.pdf']);      
      const expectedHierarchy = [
        {dir: 'path/to/dir1',
         children: ['path/to/dir1/some-image.BMP',
                    'path/to/dir1/some-image.JPEG',
                    'path/to/dir1/some-image.JPG',
                    'path/to/dir1/some-image.bmp',
                    'path/to/dir1/some-image.jpeg',
                    'path/to/dir1/some-image.jpg']},
        'path/to/dir2/image-a.jpg',
        'path/to/dir2/image-b.jpg',
        'path/to/dir2/image-c.jpg'
      ];
      const expectedPathsList = [
        'path/to/dir1/some-image.BMP',
        'path/to/dir1/some-image.JPEG',
        'path/to/dir1/some-image.JPG',
        'path/to/dir1/some-image.bmp',
        'path/to/dir1/some-image.jpeg',
        'path/to/dir1/some-image.jpg',
        'path/to/dir2/image-a.jpg',
        'path/to/dir2/image-b.jpg',
        'path/to/dir2/image-c.jpg' 
      ];
      return test.then(paths => {
        expect(paths).to.be.an('object');
        expect(paths).to.have.property('hierarchy');
        expect(paths).to.have.property('pathsList');
        expect(paths.hierarchy).to.be.an('array');
        expect(paths.pathsList).to.be.an('array');
        expect(paths.hierarchy).to.deep.equal(expectedHierarchy);
        expect(paths.pathsList).to.deep.equal(expectedPathsList);
      });
      mock.restore();
    });
  
  it ('Returns an {hierarchy:[], pathsList:[]} when provided no paths to expand.', () => {
    const test = expandDirs([]);
    return test.then(paths => {
      expect(paths).to.be.an('object');
      expect(paths).to.have.property('hierarchy');
      expect(paths).to.have.property('pathsList');
      expect(paths.hierarchy).to.be.an('array');
      expect(paths.pathsList).to.be.an('array');
      expect(paths.hierarchy.length).to.equal(0);
      expect(paths.pathsList.length).to.equal(0);
    });
  });
});
