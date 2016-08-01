'use strict'
const test = require('tape')
const fileBoxHeight = require('../app/siv/file-box-height')

test('fileBoxHeight', assert => {
  assert.equal(fileBoxHeight(1, 600), 580)
  assert.equal(fileBoxHeight(2, 600), 285)
  assert.equal(fileBoxHeight(3, 600), 187)
  assert.end()
})
