const test = require('tape')
const getInstalled = require('../app/extensions-manager/get-installed')
const mock = require('mock-fs')

const str = JSON.stringify

mock({
  '/path/to/extensions/folder': {
    'siv-image': {
      'package.json': str({
        name: 'siv-image',
        version: '1.0.0',
        description: 'A SIV extension for viewing images.',
        scripts: { test: "tape 'test/**/*.js' | tap-spec" }, // should be ignored
      })
    },
    'siv-caliper': {
      'package.json': str({
        name: 'siv-caliper',
        version: '1.1.0',
        description: 'A SIV extension for measuring things.',
        devDependencies: { needle: '~1.6.3' }, // should be ignored
      })
    },
    'siv-sccir': {
      'package.json': str({
        name: 'siv-sccir',
        version: '1.2.0',
        description: 'A SIV extension for measuring SCC interaction.',
        private: true,          // should be ignored
      })
    },
    // Consider this scenario: A developer wants to build a SIV
    // extension. They write some javascript, toss it into a folder,
    // and place it in the extensions folder. But, they've forgotten
    // to put in a package.json file:
    'siv-no-package.json': {
      'index.js': 'console.log("This wont show up")'
    },
    // Consider the same scenario as before except this time the
    // developer remembered to make a package.json file but forgot to
    // include the 'name' and 'version' fields:
    'siv-no-name-version': {
      'package.json': str({
        description: 'A SIV extension that will never see the light of day.',
      })
    },
    'some-random-doc.txt': 'should be ignored',
  }
})

test('getInstalled on mocked filesystem', assert => {
  const msg = 'getInstalled returns an object of all installed extensions'
  const expected = {
    'siv-image': {
      name: 'siv-image',
      version: '1.0.0',
    },
    'siv-caliper': {
      name: 'siv-caliper',
      version: '1.1.0',
    },
    'siv-sccir': {
      name: 'siv-sccir',
      version: '1.2.0',
    },
  }
  getInstalled('/path/to/extensions/folder')
    .then(actual => {
      assert.deepEqual(actual, expected, msg)
      assert.end()
    })
})

mock.restore()
