'use strict'
const Path = require('path')
const React = require('react')

const FileBoxFile = React.createClass({
  propTypes: {
    onImgClick: React.PropTypes.func.isRequired,
    currentImg: React.PropTypes.string.isRequired,
    path: React.PropTypes.string.isRequired
  },
  render () {
    const className = (() => {
      if (this.props.currentImg === this.props.path) {
        return 'active'
      }
      return ''
    })()

    return React.DOM.li(
      React.DOM.a(
        {
          href: '',
          className,
          'data-file-path': this.props.path,
          onClick (click) {
            click.preventDefault()
            this.props.onImgClick(this.props.path)
          }
        },
        Path.basename(this.props.path, Path.extname(this.props.path))
      )
    )
  }
})

module.exports = FileBoxFile
