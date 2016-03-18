'use strict'
const React = require('react')
const FileBox = require('./component/file-box')
const loadImage = require('./loadImage')
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
          return React.createElement(FileBox, {
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
              loadImage(path)
                .then(imgSrc => {
                  this.props.sivDispatch({
                    type: 'SET_CURRENT_IMG',
                    imgPath: imgSrc
                  })
                  this.props.sivDispatch({
                    type: 'SET_CURRENT_FILE_BOX',
                    Id: Id
                  })
                })
                .catch(err => {
                  console.log('Error loading image:', err)
                })
            },
            currentImg: this.props.currentImg,
            paths: fileBox.hierarchy
          })
        })
      }
      return 'No Files To Display'
    }

    const renderControls = () => {
      if (extControls.length > 0) {
        return extControls.map((Controls, index) => {
          const extStore = this.props.extStores[Controls.extId]
          const isActive = index === 0
          return React.createElement(Controls, { key: index,
            sivState: sivState,
            isActive: isActive,
            sivDispatch: this.props.sivDispatch,
            extState: extStore ? extStore.getState() : undefined,
            extDispatch: extStore ? extStore.dispatch : undefined })
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

    const div = React.DOM.div
    const img = React.DOM.img
    return div({ className: 'Sidebar' },
               div({ className: 'Sidebar-toggle-container',
                     onClick: showHideFiles },
                   div({ className: 'Sidebar-toggle-icon' },
                       img({ className: classNames.toggleIcon,
                             src: 'icons/ic_chevron_right_black_24px.svg'})),
                   div({ className: 'Sidebar-toggle-title' },
                       'files')),
               div({ className: classNames.filesContainer },
                   renderFiles()),
               div({ className: classNames.extContainer },
                   renderControls()))
  }
})

module.exports = Sidebar
