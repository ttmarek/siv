'use strict'
const test = require('tape')
const navigateImages = require('../app/navigateImages')
const Redux = require('redux')

const testReducer = (state, action) => {
  if (action.type === 'UPDATE_STATE') {
    return action.newState
  }
  return {}
}

const testStore = Redux.createStore(testReducer)

test('Simple navigation', assert => {
  testStore.dispatch({
    type: 'UPDATE_STATE',
    newState: {
      currentImg: '/path/to/img2.jpg',
      filePaths: {
        pathsList: ['/path/to/img1.jpg',
                    '/path/to/img2.jpg',
                    '/path/to/img3.jpg',
                    '/path/to/img4.jpg']
      }
    }
  })

  const nextPath = navigateImages('next', testStore)
  const prevPath = navigateImages('prev', testStore)
  assert.equal(nextPath, '/path/to/img3.jpg',
               'navigateImages("next", reduxStore) returns the next path in the path list')
  assert.equal(prevPath, '/path/to/img1.jpg',
               'navigateImages("prev", reduxStore) returns the previous path in the path list')
  assert.end()
})

test('Navigate forward when at the end of the path list', assert => {
  testStore.dispatch({
    type: 'UPDATE_STATE',
    newState: {
      currentImg: '/path/to/img4.jpg',
      filePaths: {
        pathsList: ['/path/to/img1.jpg',
                    '/path/to/img2.jpg',
                    '/path/to/img3.jpg',
                    '/path/to/img4.jpg']
      }
    }
  })

  const nextPath = navigateImages('next', testStore)
  assert.equal(nextPath, '/path/to/img1.jpg',
               "navigateImages('next', reduxStore) returns the first path in the path list")
  assert.end()
})

test('Navigate backward when at the top of the path list', assert => {
  testStore.dispatch({
    type: 'UPDATE_STATE',
    newState: {
      currentImg: '/path/to/img1.jpg',
      filePaths: {
        pathsList: ['/path/to/img1.jpg',
                    '/path/to/img2.jpg',
                    '/path/to/img3.jpg',
                    '/path/to/img4.jpg']
      }
    }
  })

  const prevPath = navigateImages('prev', testStore)
  assert.equal(prevPath, '/path/to/img4.jpg',
               "navigateImages('prev', reduxStore) returns the last path in the path list")
  assert.end()
})

test("Navigate when the current path isn't in the path list", assert => {
  testStore.dispatch({
    type: 'UPDATE_STATE',
    newState: {
      currentImg: '/path/to/img45.jpg',
      filePaths: {
        pathsList: ['/path/to/img1.jpg',
                    '/path/to/img2.jpg',
                    '/path/to/img3.jpg',
                    '/path/to/img4.jpg']
      }
    }
  })

  const nextPath = navigateImages('next', testStore)
  const prevPath = navigateImages('prev', testStore)
  assert.equal(nextPath, '/path/to/img1.jpg',
               "navigateImages('next', reduxStore) returns the first path in the path list")
  assert.equal(prevPath, '/path/to/img1.jpg',
               "navigateImages('prev', reduxStore) returns the first path in the path list")
  assert.end()
})

test('Navigate when the path list is empty', assert => {
  testStore.dispatch({
    type: 'UPDATE_STATE',
    newState: {
      currentImg: '/path/to/img1.jpg',
      filePaths: {
        pathsList: []
      }
    }
  })

  const nextPath = navigateImages('next', testStore)
  const prevPath = navigateImages('prev', testStore)
  assert.true(typeof nextPath === 'string' && nextPath.length === 0,
              "navigateImages('next', reduxStore) returns an empty string")
  assert.true(typeof prevPath === 'string' && prevPath.length === 0,
              "navigateImages('prev', reduxStore) returns an empty string")
  assert.end()
})
