'use strict'
const React = require('react')
const h = require('react-hyperscript')
const FileBox = require('./file-box')
const fileBoxHeight = require('./file-box-height')

const Sidebar = React.createClass({
  propTypes: {
    sivDispatch: React.PropTypes.func.isRequired,
    extControls: React.PropTypes.array.isRequired,
    viewerDimensions: React.PropTypes.object.isRequired,
    fileBoxes: React.PropTypes.array.isRequired,
    currentImg: React.PropTypes.string.isRequired,
    extStores: React.PropTypes.object.isRequired,
    filesShown: React.PropTypes.bool.isRequired
  },

  render () {
    const sivState = this.props.sivState
    const extControls = this.props.extControls
    const renderFiles = () => {
      const sidebarHeight = this.props.viewerDimensions.height - 30
      if (this.props.fileBoxes.length > 0) {
        return this.props.fileBoxes.map((fileBox, index) => {
          return (
            h(FileBox, {
              key: index,
              Id: index,
              height: fileBoxHeight(this.props.fileBoxes.length, sidebarHeight),
              onClose: (id) => {
                this.props.sivDispatch({
                  type: 'CLOSE_FILE_BOX',
                  index: id
                })
              },
              onImgClick: (path, Id) => {
                this.props.sivDispatch({
                  type: 'SET_CURRENT_IMG',
                  imgPath: path
                })
                this.props.sivDispatch({
                  type: 'SET_CURRENT_FILE_BOX',
                  Id: Id
                })
              },
              currentImg: this.props.currentImg,
              paths: fileBox.hierarchy
            })
          )
        })
      }
      return 'No Files To Display'
    }

    const renderControls = () => {
      if (extControls.length > 0) {
        return extControls.map((Controls, index) => {
          const extStore = this.props.extStores[Controls.extId]
          const isActive = index === 0
          const titleColor = (() => {
            if (index === 0) {
              return { color: 'rgb(51, 122, 183)' }
            }
            return {}
          })()
          const close = () => {
            this.props.sivDispatch({
              type: 'CLOSE_EXTENSION',
              extId: Controls.extId
            })
          }
          return (
            h('div.ext-container', [
              h('div.ext-title', [
                h('span', { style: titleColor }, Controls.extName),
                h('img', { src: 'icons/ic_close_white_18px.svg', onClick: close })
              ]),
              h(Controls, {
                key: index,
                sivState: sivState,
                isActive: isActive,
                sivDispatch: this.props.sivDispatch,
                extState: extStore ? extStore.getState() : undefined,
                extDispatch: extStore ? extStore.dispatch : undefined
              })
            ])
          )
        })
      } else {
        return 'No Extensions To Display'
      }
    }

    const classNames = (() => {
      if (this.props.filesShown) {
        return {
          toggleIcon: 'rotate',
          filesContainer: 'files-container visible',
          extContainer: 'extensions-container'
        }
      } else {
        return {
          toggleIcon: '',
          filesContainer: 'files-container',
          extContainer: 'extensions-container visible'
        }
      }
    })()

    const showHideFiles = () => {
      this.props.sivDispatch({
        type: 'SHOW_HIDE_FILES'
      })
    }

    return (
      h('div.Sidebar', [
        h('div.Sidebar-toggle-container', { onClick: showHideFiles }, [
          h('div.Sidebar-toggle-icon', [
            h('img', {
              className: classNames.toggleIcon,
              src: 'icons/ic_chevron_right_black_24px.svg'
            })
          ]),
          h('div.Sidebar-toggle-title', 'files')
        ]),
        h('div', { className: classNames.filesContainer }, renderFiles()),
        h('div', { className: classNames.extContainer }, renderControls())
      ])
    )
  }
})

module.exports = Sidebar
