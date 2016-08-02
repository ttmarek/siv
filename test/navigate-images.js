'use strict'
const test = require('tape')
const navigateImages = require('../app/siv/navigate-images')

test('navigateImages', assert => {
  const paths = ['/path/to/img1.jpg',
                 '/path/to/img2.jpg',
                 '/path/to/img3.jpg',
                 '/path/to/img4.jpg']

  assert.equal(navigateImages('next', '/path/to/img2.jpg', paths),
               '/path/to/img3.jpg')

  assert.equal(navigateImages('prev', '/path/to/img2.jpg', paths),
               '/path/to/img1.jpg')

  assert.equal(navigateImages('next', '/path/to/img4.jpg', paths),
               '/path/to/img1.jpg')

  assert.equal(navigateImages('prev', '/path/to/img1.jpg', paths),
               '/path/to/img4.jpg')

  assert.equal(navigateImages('next', '/path/to/random/img.jpg', paths),
               '/path/to/img1.jpg')

  assert.equal(navigateImages('prev', '/path/to/random/img.jpg', paths),
               '/path/to/img1.jpg')

  assert.end()
})
