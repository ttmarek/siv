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
               'Returns an list (<li>) element.')

  assert.equal(testInactive.props.type, 'a',
               'Returns an anchor (<a>) within the list element')

  assert.equal(testInactive.props.props['data-file-path'], '/path/to/img1.jpg',
              'Adds a "data-file-path" attribute to the anchor element.')

  assert.equal(testInactive.props.props.children, 'img1',
               'Displays the file name without a file extension.')

  renderer.render(
    React.createElement(
      FileBoxFile,
      {
        path: '/path/to/img10.jpg',
        currentImg: '/path/to/img10.jpg',
        onImgClick (path) {
          return path
        }
      }
    )
  )
  const testActive = renderer.getRenderOutput()

  assert.true(testInactive.props.props.className === '' &&
              testActive.props.props.className === 'active',
              'Adds class "active" when the current image matches the file path')

  assert.end()
})
