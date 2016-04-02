'use strict'
const test = require('tape')
const React = require('react')
const DOMServer = require('react-dom/server')
const Btn = require('../../app/component/button')

const render = (reactElement) => {
  return DOMServer.renderToStaticMarkup(reactElement)
}

test('component/button', assert => {
  let btn
  // Regular button rendering
  btn = render(React.createElement(Btn, {btnType: 'regular', btnName: 'reg btn'}))
  assert.equal(btn, '<button class="btn btn-default">reg btn</button>')
  // Blue button rendering
  btn = render(React.createElement(Btn, {btnType: 'blue', btnName: 'blue btn'}))
  assert.equal(btn, '<button class="btn btn-blue">blue btn</button>')
  // Active blue button rendering
  btn = render(React.createElement(Btn, {btnType: 'blue', btnName: 'blue btn', active: true}))
  assert.equal(btn, '<button class="btn btn-blue btn-active">blue btn</button>')

  assert.end()
})
