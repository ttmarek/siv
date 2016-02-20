'use strict'
const test = require('tape')
const saveToFileBox = require('../app/save-to-filebox')

test('saveToFileBox', assert => {
  // adds new saved folder for the first exported image
  const savedFile1 = 'path/to/exported/img1.png'
  const savedFile2 = 'path/to/exported/img2.png'
  const filePaths = {
    hierarchy: [
      {dir: 'path/to/dir1',
       children: ['path/to/dir1/some-image.BMP',
                  'path/to/dir1/some-image.JPEG']},
      'path/to/dir2/image-a.jpg',
      'path/to/dir2/image-b.jpg'
    ],
    pathsList: [
      'path/to/dir1/some-image.BMP',
      'path/to/dir1/some-image.JPEG',
      'path/to/dir2/image-a.jpg',
      'path/to/dir2/image-b.jpg'
    ]
  }
  const updatedFilePaths1 = {
    hierarchy: [
      {dir: 'saved',
       children: [savedFile1]},
      {dir: 'path/to/dir1',
       children: ['path/to/dir1/some-image.BMP',
                  'path/to/dir1/some-image.JPEG']},
      'path/to/dir2/image-a.jpg',
      'path/to/dir2/image-b.jpg'
    ],
    pathsList: [
      savedFile1,
      'path/to/dir1/some-image.BMP',
      'path/to/dir1/some-image.JPEG',
      'path/to/dir2/image-a.jpg',
      'path/to/dir2/image-b.jpg'
    ]
  }
  const updatedFilePaths2 = {
    hierarchy: [
      {dir: 'saved',
       children: [savedFile1, savedFile2]},
      {dir: 'path/to/dir1',
       children: ['path/to/dir1/some-image.BMP',
                  'path/to/dir1/some-image.JPEG']},
      'path/to/dir2/image-a.jpg',
      'path/to/dir2/image-b.jpg'
    ],
    pathsList: [
      savedFile2,
      savedFile1,
      'path/to/dir1/some-image.BMP',
      'path/to/dir1/some-image.JPEG',
      'path/to/dir2/image-a.jpg',
      'path/to/dir2/image-b.jpg'
    ]
  }

  assert.deepEqual(updatedFilePaths1,
                   saveToFileBox(savedFile1, filePaths),
                   'Adds new saved folder correctly')
  assert.deepEqual(updatedFilePaths2,
                   saveToFileBox(savedFile2, updatedFilePaths1),
                   'Adds second saved image correctly')
  assert.end()
})
