'use strict'
const test = require('tape')
const React = require('react')
const ReactTestUtils = require('react-addons-test-utils')
const FileBoxDir = require('../../app/component/file-box-dir')

const renderer = ReactTestUtils.createRenderer()

test('component/file-box-dir', assert => {
  renderer.render(
    React.createElement(
      FileBoxDir,
      {
        dirObj: {
          dir: 'path/to/some-dir',
          children: ['path/to/some-dir/img1.jpg',
                     'path/to/some-dir/img2.jpg']
        },
        currentImg: '/path/to/some-dir/img1.jpg',
        onImgClick (path) {
          return path
        }
      }
    )
  )

  const result = renderer.getRenderOutput()

  assert.equal(result.type, 'li',
               'Returns a list element (<li>)')

  assert.equal(result.props.className, 'dir',
               'Gives the list element a "dir" class (<li class="dir">)')

  const icon = result.props.children[0]
  assert.true(icon.type === 'img' &&
              icon.props.src === 'icons/ic_arrow_drop_down_black_18px.svg' &&
              icon.props.className === '' &&
              typeof icon.props.onClick === 'function',
              'Adds an icon before the directory name.')

  const dirLink = result.props.children[1]
  assert.true(dirLink.type === 'a' &&
              dirLink.props.className === 'dir-link' &&
              typeof icon.props.onClick === 'function' &&
              dirLink.props.children === 'some-dir',
              'Displays the directory name as a link with class "dir-link".')

  assert.end()
})
