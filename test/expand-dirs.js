const test = require('tape')
const expandDirs = require('../app/expand-dirs.js')
const mock = require('mock-fs')

test('expandDirs given an empty list', (assert) => {
  expandDirs([])
    .then(paths => {
      assert.deepEqual(paths, {
        hierarchy: [],
        pathsList: []
      }, 'returns {hierarchy:[], pathsList:[]}')
      assert.end()
    })
})

test('expandDirs given a mix of directory and file paths', (assert) => {
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
  expandDirs(['path/to/dir1',
              'path/to/dir3',
              'path/to/dir2/image-a.jpg',
              'path/to/dir2/image-b.jpg',
              'path/to/dir2/image-c.jpg',
              'path/to/dir2/some-document.pdf'])
    .then(paths => {
      assert.deepEqual(paths.hierarchy, [
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
      ], 'generates the hierarchy correctly')
      assert.deepEqual(paths.pathsList, [
        'path/to/dir1/some-image.BMP',
        'path/to/dir1/some-image.JPEG',
        'path/to/dir1/some-image.JPG',
        'path/to/dir1/some-image.bmp',
        'path/to/dir1/some-image.jpeg',
        'path/to/dir1/some-image.jpg',
        'path/to/dir2/image-a.jpg',
        'path/to/dir2/image-b.jpg',
        'path/to/dir2/image-c.jpg'
      ], 'generates the paths list correctly')
      assert.end()
      mock.restore();
    })
})
