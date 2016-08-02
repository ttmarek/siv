const test = require('tape')
const sivReducer = require('../../app/siv/reducer')

test('CLOSE_FILE_BOX', assert => {
  const test1 = 'The closed filebox is removed and ' +
          'the top-most image in the sidebar is set ' +
          'as the current image.'

  const input1 = {
    state: {
      currentImg: 'img2.2',
      currentFileBox: 1,
      fileBoxes: [
        { pathsList: ['img1.1', 'img1.2', 'img1.3'] },
        { pathsList: ['img2.1', 'img2.2', 'img2.3'] },
        { pathsList: ['img3.1', 'img3.2', 'img3.3'] }
      ]
    },
    action: {
      type: 'CLOSE_FILE_BOX',
      index: 2
    }
  }

  const result1 = sivReducer(input1.state, input1.action)

  const expectedState1 = {
    currentImg: 'img1.1',
    currentFileBox: 0,
    fileBoxes: [
      { pathsList: ['img1.1', 'img1.2', 'img1.3'] },
      { pathsList: ['img2.1', 'img2.2', 'img2.3'] }
    ]
  }

  assert.deepEqual(result1, expectedState1, test1)

  const test2 = 'When the last filebox is closed the current image stays put.'

  const input2 = {
    state: {
      currentImg: 'img1.3',
      currentFileBox: 0,
      fileBoxes: [
        { pathsList: ['img1.1', 'img1.2', 'img1.3'] }
      ]
    },
    action: {
      type: 'CLOSE_FILE_BOX',
      index: 0
    }
  }

  const result2 = sivReducer(input2.state, input2.action)

  const expectedState2 = {
    currentImg: 'img1.3',
    currentFileBox: 0,
    fileBoxes: []
  }

  assert.deepEqual(result2, expectedState2, test2)

  assert.end()
})
