'use strict'
const test = require('tape')
const React = require('react')
const ReactTestUtils = require('react-addons-test-utils')
const FileBoxFile = require('../../app/component/file-box-file')

const renderer = ReactTestUtils.createRenderer()

test('component/file-box-file', assert => {
  renderer.render(
    React.createElement(
      FileBoxFile,
      {
        Id: 0,
        path: '/path/to/img1.jpg',
        currentImg: '/path/to/img2.jpg',
        onImgClick (path) {
          return path
        }
      }
    )
  )

  const testInactive = renderer.getRenderOutput()

  assert.equal(testInactive.type, 'li',
               'Returns a list (<li>) element.')

  renderer.render(
    React.createElement(
      FileBoxFile,
      {
        Id: 0,
        path: '/path/to/img10.jpg',
        currentImg: '/path/to/img10.jpg',
        onImgClick (path) {
          return path
        }
      }
    )
  )
  const testActive = renderer.getRenderOutput()
  assert.true(testInactive.props.children.props.className === '' &&
              testActive.props.children.props.className === 'active',
              'Adds class "active" when the current image matches the file path')

  assert.end()
})
