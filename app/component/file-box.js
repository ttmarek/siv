'use strict'
const React = require('react')
const h = require('react-hyperscript')
const FileBoxDir = require('./file-box-dir')
const FileBoxFile = require('./file-box-file')

const FileBox = (props) => {
  const filesAndDirs = props.paths.map((path, index) => {
    switch (typeof path) {
      case 'string':
        return h(FileBoxFile, {
          key: index,
          Id: props.Id,
          path: path,
          currentImg: props.currentImg,
          onImgClick: props.onImgClick
        })
      case 'object':
        return h(FileBoxDir, {
          key: index,
          Id: props.Id,
          dirObj: path,
          currentImg: props.currentImg,
          onImgClick: props.onImgClick
        })
      default:
        return ''
    }
  })

  return (
    h('div.file-box', { style: { height: props.height } }, [
      h('div.file-box-controls', [
        h('img', {
          src: 'icons/ic_close_black_18px.svg',
          onClick: () => props.onClose(props.Id)
        })
      ]),
      h('div.file-box-content', [
        h('ul', filesAndDirs)
      ])
    ])
  )
}

module.exports = FileBox
