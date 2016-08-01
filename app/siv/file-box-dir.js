'use strict'
const Path = require('path')
const React = require('react')
const h = require('react-hyperscript')
const FileBoxFile = require('./file-box-file')

const FileBoxDir = React.createClass({
  propTypes: {
    onImgClick: React.PropTypes.func.isRequired,
    currentImg: React.PropTypes.string.isRequired,
    dirObj: React.PropTypes.object.isRequired,
    Id: React.PropTypes.number.isRequired
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
      return h(FileBoxFile, {
        key: index,
        Id: this.props.Id,
        path,
        currentImg: this.props.currentImg,
        onImgClick: this.props.onImgClick
      })
    })

    return (
      h('li', [
        h('img', {
          src: '../icons/ic_arrow_drop_down_black_18px.svg',
          className: this.state.hidden ? 'file-box-dir-hidden' : 'file-box-dir-shown',
          onClick: toggleVisibility
        }),
        h('a.dir-link', { href: '', onClick: toggleVisibility }, dirName),
        h('ul', {
          className: this.state.hidden ? 'file-box-dir-listing hidden' : 'file-box-dir-listing'
        }, children)
      ])
    )
  }
})

module.exports = FileBoxDir
