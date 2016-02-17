'use strict'
const test = require('tape')
const React = require('react')
const ReactTestUtils = require('react-addons-test-utils')
const Button = require('../../app/component/button')

test('component/button', assert => {
  const renderer = ReactTestUtils.createRenderer()
  const returnHey = () => 'hey'
  const regBtn = React.createElement(Button,
                                     {btnType: 'regular',
                                      btnName: 'reg btn',
                                      onClick: returnHey})

  const blueBtn = React.createElement(Button,
                                      {btnType: 'blue',
                                       btnName: 'blue btn',
                                       onClick: returnHey})
  renderer.render(regBtn)
  const regBtnComponent = renderer.getRenderOutput()
  renderer.render(blueBtn)
  const blueBtnComponent = renderer.getRenderOutput()

  assert.equal(regBtnComponent.props.className, 'btn btn-default',
               'Regular buttons are given the correct className')
  assert.equal(blueBtnComponent.props.className, 'btn btn-blue',
               'Blue buttons have the correct className')
  assert.equal(regBtnComponent.props.onClick(), 'hey',
               'Attaches the click event handler properly')
  assert.equal(blueBtnComponent.props.children, 'blue btn',
               'Assigns the name correctly')
  assert.end()
})
