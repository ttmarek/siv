const ipcRenderer = require('electron').ipcRenderer;
const React = require('react');
const ReactDOM = require('react-dom');
const Redux = require('redux');
const Sidebar = require('./sidebar');
const PathInput = require('./path-input');
const sivReducer = require('./siv-reducer');
const sivEvents = require('./siv-events');
const images = require('./images');
const SIV = React.createClass({
  getInitialState() {
    return {
      keyFound: true,
      pathInputShown: false,
      imagesLoading: false,
    };
  },
  componentWillMount() {
    ipcRenderer.on('save-image', (event, filePath) => {
      const sivState = this.props.store.getState();
      const canvasElements = sivState.canvasRefs;
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.height = sivState.viewerDimensions.height;
      combinedCanvas.width = sivState.viewerDimensions.width;
      const ctx = combinedCanvas.getContext('2d');
      canvasElements.forEach(element => {
        ctx.drawImage(element, 0, 0);
      });
      const dataURL = combinedCanvas.toDataURL();
      const imageData = dataURL.replace('data:image/png;base64,', '');
      ipcRenderer.send('write-image-to-filesystem', {
        filePath,
        imageData,
      });
    });
    ipcRenderer.on('file-paths-prepared', (event, {filePaths, currentImg}) => {
      this.setState({imagesLoading: true});
      images.loadMany(filePaths.pathsList)
        .then(images => {
          this.setState({imagesLoading: false});
          this.props.store.dispatch(
            sivEvents.imagesLoaded(images)
          );
          this.props.store.dispatch(
            sivEvents.setFilePaths(filePaths)
          );
          if (currentImg) {
            this.props.store.dispatch(
              sivEvents.setCurrentImg(currentImg)
            );
          } else {
            this.props.store.dispatch(
              sivEvents.setCurrentImg(filePaths.pathsList[0])
            );
          }
        });
    });
    ipcRenderer.on('extensions-downloaded', (event, downloadedExts) => {
      this.props.store.dispatch(
        sivEvents.extsDownloaded(downloadedExts)
      );
    });
    ipcRenderer.on('access-key-checked', (event, keyFound) => {
      if (keyFound != this.state.keyFound) {
        this.setState({keyFound});
      }
    });
  },
  componentDidMount() {
    this.props.store.subscribe(() => {this.forceUpdate()});
    const setDimensions = () => {
      const viewerDimensions = this.refs.viewerNode.getBoundingClientRect();
      this.props.store.dispatch(
        sivEvents.setViewerDimensions(viewerDimensions)
      );
    };
    setDimensions();
    // Set the viewerSize once the window finishes resizing.
    // I initially wrote:
    // window.addEventListener('resize', this.setViewerDimensions)
    // But there was a noticeable amount of image flickering during a
    // window resize. Now, the image stretches with the window, then
    // fits into place once the window is done resizing.
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setDimensions();
      }, 50);
    });
    window.addEventListener('keydown', keyPress => {
      keyPress.preventDefault();
      const keyIdentifier = {
        Right: this.moveToNextImg,
        Left: this.moveToPrevImg,
      };
      const shortcut = keyIdentifier[keyPress.keyIdentifier];
      if (shortcut) shortcut();
    });
  },
  moveToNextImg() {
    this.props.store.dispatch(sivEvents.moveToNextImg());
  },
  moveToPrevImg() {
    this.props.store.dispatch(sivEvents.moveToPrevImg());
  },
  render() {
    const sivState = this.props.store.getState();
    const sivDispatch = this.props.store.dispatch;
    const renderKeyNotFoundMsg = () => {
      const msg = `The key used to open SIV can no longer be detected.
          If you'd like to continue using SIV, shut it down from the
          notifications tray and reopen it as a guest.`;
      return (
        <div className="key-not-found">
          {msg}
        </div>
      );
    };
    const renderLayers = () => {
      return sivState.layers.map((Layer, index) => {
        const extStore = sivState.extStores[Layer.extId];
        return (
          <Layer
             key={index}
             zIndex={index + 1}
             sivState={sivState}
             sivDispatch={sivDispatch}
             extState={extStore ? extStore.getState() : undefined}
             extDispatch={extStore ? extStore.dispatch : undefined}/>
        );
      });
    };
    const activeLayer = sivState.layers[sivState.layers.length - 1];
    const downloadedExts = sivState.downloadedExts;
    const renderExtButtons = () => {
      if (downloadedExts.length > 0) {
        return downloadedExts.map((extInfo, index) => {
          const openExtension = () => {
            if (sivState.openedExts.indexOf(extInfo.id) === -1) {
              const ext = require(extInfo.path);
              const extStore = (() => {
                if (ext.reducer) {
                  const newStore = Redux.createStore(ext.reducer);
                  newStore.subscribe(this.forceUpdate.bind(this));
                  return newStore;
                }
                return undefined;
              })();
              sivDispatch(
                sivEvents.newExtOpened({
                  id: extInfo.id,
                  controls: ext.Controls,
                  layer: ext.Layer,
                  store: extStore,
                })
              );
            } else {
              sivDispatch(
                sivEvents.activateLayerRequested(extInfo.id)
              );
            }
          };
          const className = (() => {
            if (activeLayer.extId === extInfo.id) {
              return 'btn btn-default btn-active';
            }
            return 'btn btn-default';
          })();
          return (
            <div key={index}
                 role="button"
                 onClick={openExtension}
                 className={className}>
              {extInfo.name}
            </div>
          );
        });
      } else {
        return '';
      }
    };
    return (
      <div className="siv">
        {this.state.keyFound ? '' : renderKeyNotFoundMsg()}
        <Sidebar imagesLoading={this.state.imagesLoading}
                 sivState={sivState}
                 sivDispatch={sivDispatch}/>
        <div className="Viewer"
             ref="viewerNode">
          <div id="PathInput-control"
               className={this.state.pathInputShown ? 'open' : ''}
               role="button"
               onClick={() => this.setState({pathInputShown: !this.state.pathInputShown})}>
            <img src="icons/ic_expand_more_black_24px.svg"/>
          </div>
          <PathInput
             pathInputShown={this.state.pathInputShown}
             sivState={sivState}
             sivDispatch={sivDispatch}/>
          <div className="LayerContainer">
            {renderLayers()}
          </div>
        </div>
        <div className="Toolbar">
          <div className="Toolbar-section FileNav">
            <div role="button" className="btn btn-blue" onClick={this.moveToPrevImg}>prev</div>
            <div role="button" className="btn btn-blue" onClick={this.moveToNextImg}>next</div>
          </div>
          <div className="Toolbar-section ExtensionsNav">
            {renderExtButtons()}
          </div>
        </div>
      </div>
    );
  }
});
ReactDOM.render(<SIV store={Redux.createStore(sivReducer)}/>,
                document.getElementById('siv'));
