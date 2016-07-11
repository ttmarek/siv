'use strict'
const test = require('tape')
const React = require('react')
const { shallow } = require('enzyme')
const h = require('react-hyperscript');
const FileBoxFile = require('../app/file-box-file')

test('component/file-box-file', assert => {
  assert.plan(2)
  let element
  let expected

  element = h(FileBoxFile, {
    path: '/path/to/img1.jpg',
    currentImg: '/path/to/img2.jpg',
  })
  expected = '<li><a href="" class="" data-file-path="/path/to/img1.jpg">img1</a></li>'
  assert.equal(shallow(element).html(), expected,
               `Renders inactive image links like so: ${expected}`)

  element = h(FileBoxFile, {
    path: '/path/to/img10.jpg',
    currentImg: '/path/to/img10.jpg',
  })
  expected = '<li><a href="" class="active" data-file-path="/path/to/img10.jpg">img10</a></li>'
  assert.equal(shallow(element).html(), expected,
               `Renders active image links like so: ${expected}`)
})
