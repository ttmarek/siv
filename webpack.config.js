const webpack = require('webpack')

module.exports = {
  entry: './app/siv.js',
  output: {
    path: `./app`,
    filename: 'siv.bundle.js',
  },
  target: 'electron',
  node: {
    __dirname: false,
  },
}
