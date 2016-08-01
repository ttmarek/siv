const webpack = require('webpack')

module.exports = {
  entry: './app/siv/siv.js',
  output: {
    path: `./app/siv/`,
    filename: 'siv.bundle.js',
  },
  target: 'electron',
  node: {
    __dirname: false,
  },
}
