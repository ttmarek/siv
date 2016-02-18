'use strict'
const Path = require('path')
const React = require('react')
const FileBoxFile = require('./file-box-file')

const FileBoxDir = React.createClass({
  propTypes: {
    onImgClick: React.PropTypes.func.isRequired,
    currentImg: React.PropTypes.string.isRequired,
    dirObj: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      hidden: false
    }
  },
  render () {
    const toggleVisibility = (click) => {
      click.preventDefault()
      this.setState({hidden: !this.state.hidden})
    }

    const dirName = this.props.dirObj.dir.split(Path.sep).pop()

    const children = this.props.dirObj.children.map((path, index) => {
      return React.createElement(
        FileBoxFile,
        {
          key: index,
          path,
          currentImg: this.props.currentImg,
          onImgClick: this.props.onImgClick
        }
      )
    })

    return React.DOM.li(
      {
        className: 'dir'
      },
      React.DOM.img(
        {
          src: 'icons/ic_arrow_drop_down_black_18px.svg',
          className: this.state.hidden ? 'dir-hidden' : '',
          onClick: toggleVisibility
        }
      ),
      React.DOM.a(
        {
          href: '',
          className: 'dir-link',
          onClick: toggleVisibility
        },
        dirName
      ),
      React.DOM.ul(
        {
          className: this.state.hidden ? 'dir-hidden' : ''
        },
        children
      )
    )
  }
})

module.exports = FileBoxDir
