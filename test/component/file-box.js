'use strict'
const test = require('tape')
const React = require('react')
const ReactTestUtils = require('react-addons-test-utils')
const FileBox = require('../../app/component/file-box')

const renderer = ReactTestUtils.createRenderer()

test('component/file-box', assert => {
  renderer.render(
    React.createElement(
      FileBox,
      {
        Id: 0,
        onClose(Id) {
          return Id
        },
        onImgClick(path) {
          return path
        },
        currentImg: '/path/to/img1.jpg',
        paths: [
          {
            dir: 'path/to/dir1',
            children: ['path/to/dir1/some-image.BMP']
          },
          'path/to/dir2/image-a.jpg',
        ]
      }
    )
  )

  const result = renderer.getRenderOutput()

  assert.true(result.type === 'div' &&
              result.props.className === 'file-box',
              'Returns a div with a "file-box" class, (<div class="file-box">)')
  assert.end()
})
