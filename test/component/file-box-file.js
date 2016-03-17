'use strict'
const test = require('tape')
const React = require('react')
const DOMServer = require('react-dom/server')
const FileBoxFile = require('../../app/component/file-box-file')

const render = (reactElement) => {
  return DOMServer.renderToStaticMarkup(reactElement)
}

test('component/file-box-file', assert => {
  let file
  // Inactive image
  file = render(
    React.createElement(
      FileBoxFile,
      {
        path: '/path/to/img1.jpg',
        currentImg: '/path/to/img2.jpg'
      }
    )
  )
  assert.equal(file,
               '<li><a href="" class="" data-file-path="/path/to/img1.jpg">img1</a></li>')
  // Active image
  file = render(
    React.createElement(
      FileBoxFile,
      {
        path: '/path/to/img10.jpg',
        currentImg: '/path/to/img10.jpg'
      }
    )
  )
  assert.equal(file,
               '<li><a href="" class="active" data-file-path="/path/to/img10.jpg">img10</a></li>')
  assert.end()
})
