'use strict'
const React = require('react')
const FileBox = require('./component/file-box')
const sivEvents = require('./siv-events')
const loadImage = require('./loadImage')

const Sidebar = React.createClass({
  propTypes: {
    sivDispatch: React.PropTypes.func.isRequired,
    sivState: React.PropTypes.object.isRequired
  },

  render () {
    const sivState = this.props.sivState
    const extControls = sivState.extControls

    const renderFiles = () => {
      if (sivState.fileBoxes.length > 0) {
        return sivState.fileBoxes.map((fileBox, index) => {
          return React.createElement(FileBox, {
            key: index,
            Id: index,
            height: 300,
            onClose: (id) => {
              this.props.sivDispatch({
                type: 'CLOSE_FILE_BOX',
                index: id
              })
            },
            onImgClick: (path) => {
              loadImage(path)
                .then(imgSrc => {
                  this.props.sivDispatch({
                    type: 'SET_CURRENT_IMG',
                    imgPath: imgSrc
                  })
                })
                .catch(err => {
                  console.log('Error loading image:', err)
                })
            },
            currentImg: sivState.currentImg,
            paths: fileBox.hierarchy
          })
        })
      }
      return 'No Files To Display'
    }

    const renderControls = () => {
      if (extControls.length > 0) {
        return extControls.map((Controls, index) => {
          const extStore = sivState.extStores[Controls.extId]
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
      if (sivState.filesShown) {
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
      this.props.sivDispatch(
        sivEvents.sidebarToggleClicked()
      )
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
