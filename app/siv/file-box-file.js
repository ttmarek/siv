'use strict'

const Path = require('path')
const React = require('react')
const h = require('react-hyperscript')

const FileBoxFile = {
  componentDidUpdate () {
    const {
      path,
      currentImg,
    } = this.props

    if (currentImg === path) {
      this.refs.imgLink.scrollIntoViewIfNeeded()
    }
  },

  render () {
    const {
      Id,
      path,
      currentImg,
      onImgClick,
    } = this.props

    const className = currentImg === path ? 'active' : ''

    const handleFileClick = event => {
      event.preventDefault()
      onImgClick(path, Id)
    }

    return (
      h('li', [
        h('a', {
          ref: 'imgLink',
          href: '',
          className,
          'data-file-path': path,
          onClick: handleFileClick
        }, Path.basename(path, Path.extname(path)))
      ])
    )
  }
}

FileBoxFile.propTypes = {
  onImgClick: React.PropTypes.func.isRequired,
  currentImg: React.PropTypes.string.isRequired,
  path: React.PropTypes.string.isRequired,
  Id: React.PropTypes.number.isRequired
}

module.exports = React.createClass(FileBoxFile)
