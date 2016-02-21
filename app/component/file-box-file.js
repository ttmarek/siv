'use strict'
const Path = require('path')
const React = require('react')

const FileBoxFile = React.createClass({
  propTypes: {
    onImgClick: React.PropTypes.func.isRequired,
    currentImg: React.PropTypes.string.isRequired,
    path: React.PropTypes.string.isRequired,
    Id: React.PropTypes.number.isRequired
  },
  render () {
    const className = (() => {
      if (this.props.currentImg === this.props.path) {
        return 'active'
      }
      return ''
    })()

    const handleFileClick = (click) => {
      click.preventDefault()
      this.props.onImgClick(this.props.path, this.props.Id)
    }

    return React.DOM.li(
      null,
      React.DOM.a(
        {
          href: '',
          className,
          'data-file-path': this.props.path,
          onClick: handleFileClick
        },
        Path.basename(this.props.path, Path.extname(this.props.path))
      )
    )
  }
})

module.exports = FileBoxFile