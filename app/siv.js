'use strict'

const ipcRenderer = require('electron').ipcRenderer
// Setting NODE_ENV to production improves React's
// performance. Comment out the line if you want to see React's
// warning messages.
process.env.NODE_ENV = 'production'
const React = require('react')
const ReactDOM = require('react-dom')
const Redux = require('redux')
const h = require('react-hyperscript')
const Sidebar = require('./sidebar')
const Btn = require('./component/button')
const PathInput = require('./path-input')
const sivReducer = require('./siv-reducer')
const setImage = require('./setImage')
const navigateImages = require('./navigateImages')
const saveImage = require('./save-image')

const SIV = React.createClass({
  propTypes: {
    store: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      pathInputShown: false
    }
  },
  componentWillMount () {
    ipcRenderer.on('save-image', (event, filePath) => {
      // filePath equals undefined on Cancel
      if (filePath) {
        const sivState = this.props.store.getState()
        const sivDispatch = this.props.store.dispatch
        const onSave = () => {
          sivDispatch({
            type: 'SAVE_TO_CURRENT_FILE_BOX',
            filePath: filePath
          })
        }
        saveImage(filePath,
                  sivState.canvasRefs,
                  sivState.viewerDimensions,
                  onSave)
      }
    })

    ipcRenderer.on('clear-file-paths', () => {
      this.props.store.dispatch({
        type: 'CLEAR_FILE_BOXES'
      })
    })

    ipcRenderer.on('file-paths-prepared', (event, prepared) => {
      const sivState = this.props.store.getState()
      if (sivState.fileBoxes.length <= 4) {
        this.props.store.dispatch({
          type: 'ADD_NEW_FILE_BOX',
          fileBox: prepared.filePaths
        })
        const currentImgPath = (() => {
          if (prepared.currentImg) {
            return prepared.currentImg
          }
          return prepared.filePaths.pathsList[0]
        })()
        setImage(currentImgPath, this.props.store.dispatch)
      }
    })

    ipcRenderer.on('extensions-downloaded', (event, downloadedExts) => {
      this.props.store.dispatch({
        type: 'SET_DOWNLOADED_EXTS',
        downloadedExts
      })
    })
  },

  componentDidMount () {
    this.props.store.subscribe(() => { this.forceUpdate() })
    const setDimensions = () => {
      this.props.store.dispatch({
        type: 'SET_VIEWER_DIMENSIONS',
        dimensions: this.refs.viewerNode.getBoundingClientRect()
      })
    }
    setDimensions()
    // Set the viewerSize once the window finishes resizing.
    // I initially wrote:
    // window.addEventListener('resize', this.setViewerDimensions)
    // But there was a noticeable amount of image flickering during a
    // window resize. Now, the image stretches with the window, then
    // fits into place once the window is done resizing.
    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setDimensions()
      }, 50)
    })
    window.addEventListener('keydown', keyPress => {
      const keyIdentifier = {
        Right: this.navigateToImg.bind(null, 'next', keyPress),
        Left: this.navigateToImg.bind(null, 'prev', keyPress)
      }
      const shortcut = keyIdentifier[keyPress.keyIdentifier]
      if (shortcut) shortcut()
    })
  },
  navigateToImg(direction, event) {
    // The direction param gets passed directly to navigateImages
    event.preventDefault()      // This prevents the file box from scolling
    // horizontally when navigating with the arrow keys.
    const sivState = this.props.store.getState()
    const currentImg = sivState.currentImg
    if (sivState.fileBoxes.length > 0) {
      const currentFileBox = sivState.fileBoxes[sivState.currentFileBox]
      const nextPath = navigateImages(direction, currentImg, currentFileBox.pathsList)
      setImage(nextPath, this.props.store.dispatch)
    }
    // This logic is here, and not in a NAVIGATE_TO_IMG reducer
    // because setImage is async.
  },
  render () {
    const sivState = this.props.store.getState()
    const sivDispatch = this.props.store.dispatch

    const renderLayers = () => {
      return sivState.layers.map((Layer, index) => {
        const extStore = sivState.extStores[Layer.extId]
        return (
          h(Layer, {
            key: index,
            zIndex: index + 1,
            sivState: sivState,
            sivDispatch: sivDispatch,
            extState: extStore ? extStore.getState() : undefined,
            extDispatch: extStore ? extStore.dispatch : undefined
          })
        )
      })
    }

    const activeLayer = sivState.layers[sivState.layers.length - 1]
    const downloadedExts = sivState.downloadedExts

    const renderExtButtons = () => {
      if (downloadedExts.length > 0) {
        return downloadedExts.map((extInfo, index) => {
          const openExtension = () => {
            if (sivState.openedExts.indexOf(extInfo.id) === -1) {
              const ext = require(extInfo.path)
              const extStore = (() => {
                if (ext.reducer) {
                  const newStore = Redux.createStore(ext.reducer)
                  newStore.subscribe(this.forceUpdate.bind(this))
                  return newStore
                }
                return undefined
              })()
              sivDispatch({
                type: 'REGISTER_NEW_EXTENSION',
                id: extInfo.id,
                controls: ext.Controls,
                layer: ext.Layer,
                store: extStore
              })
            } else {
              sivDispatch({
                type: 'ACTIVATE_LAYER',
                extId: extInfo.id
              })
            }
          }
          return (
            h(Btn, {
              key: index,
              btnType: 'regular',
              btnName: extInfo.name,
              onClick: openExtension,
              active: activeLayer.extId === extInfo.id
            })
          )
        })
      } else {
        return ''
      }
    }
    const hideShowPathInput = () => {
      this.setState({ pathInputShown: !this.state.pathInputShown })
    }
    return (
      h('div.siv', [
        h(Sidebar, {
          sivState: sivState,
          sivDispatch: sivDispatch,
          extControls: sivState.extControls,
          viewerDimensions: sivState.viewerDimensions,
          fileBoxes: sivState.fileBoxes,
          currentImg: sivState.currentImg,
          extStores: sivState.extStores,
          filesShown: sivState.filesShown
        }),
        h('div.Viewer', { ref: 'viewerNode' }, [
          h('div#PathInput-control', {
            className: this.state.pathInputShown ? 'open' : '',
            role: 'button',
            onClick: hideShowPathInput
          }, [
            h('img', { src: 'icons/ic_expand_more_black_24px.svg' })
          ]),
          h(PathInput, {
            pathInputShown: this.state.pathInputShown,
            sivState: sivState,
            sivDispatch: sivDispatch
          }),
          h('div.LayerContainer', renderLayers())
        ]),
        h('div.Toolbar', [
          h('div.Toolbar-section.FileNav', [
            h(Btn, {
              btnType: 'blue', btnName: 'prev', onClick: this.navigateToImg.bind(null, 'prev')
            }),
            h(Btn, {
              btnType: 'blue', btnName: 'next', onClick: this.navigateToImg.bind(null, 'next')
            })
          ]),
          h('div.Toolbar-section.ExtensionsNav', renderExtButtons())
        ])
      ])
    )
  }
})

const sivComponent = h(SIV, { store: Redux.createStore(sivReducer) })
ReactDOM.render(sivComponent, document.getElementById('siv'))
