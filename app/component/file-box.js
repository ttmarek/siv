'use strict'
const React = require('react')
const h = require('react-hyperscript')
const FileBoxDir = require('./file-box-dir')
const FileBoxFile = require('./file-box-file')

const FileBox = React.createClass({
  propTypes: {
    Id: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    onClose: React.PropTypes.func.isRequired,
    onImgClick: React.PropTypes.func.isRequired,
    currentImg: React.PropTypes.string.isRequired,
    paths: React.PropTypes.array.isRequired
  },
  render () {
    const filesAndDirs = this.props.paths.map((path, index) => {
      switch (typeof path) {
        case 'string':
          return h(FileBoxFile, {
            key: index,
            Id: this.props.Id,
            path: path,
            currentImg: this.props.currentImg,
            onImgClick: this.props.onImgClick
          })
        case 'object':
          return h(FileBoxDir, {
            key: index,
            Id: this.props.Id,
            dirObj: path,
            currentImg: this.props.currentImg,
            onImgClick: this.props.onImgClick
          })
        default:
          return ''
      }
    })

    return (
      h('div.file-box', { style: { height: this.props.height } }, [
        h('div.file-box-controls', [
          h('img', {
            src: 'icons/ic_close_black_18px.svg',
            onClick: () => this.props.onClose(this.props.Id)
          })
        ]),
        h('div.file-box-content', [
          h('ul', filesAndDirs)
        ])
      ])
    )
  }
})

module.exports = FileBox
