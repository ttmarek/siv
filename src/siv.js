const ipcRenderer = require('electron').ipcRenderer;
const React = require('react');
const ReactDOM = require('react-dom');
const Files = require('./files');
const FileNav = require('./file-nav');
const ExtButton = require('./extButton');
const PathInput = require('./path-input');
const ImageLayer = require('./image');

const SIV = React.createClass({
  getInitialState() {    
    return {
      filesShown: true,
      layers: [ImageLayer],
      extControls: [],
      extStores: {},
      loadedExts: [],
      currentImg: '',
      user: null,
      extFiles: [],
      keyNotFound: false,
      paths: {hierarchy: [], list: []},
      viewerDimensions: {width: 0, height: 0, top: 0, left: 0},
    };
  },

  componentWillMount() {
    ipcRenderer.on('file-paths-message', (event, filePaths) => {
      this.setState({
        paths: filePaths,
        currentImg: filePaths.list[0],
      });
    });

    ipcRenderer.on('user-obj-message', (event, userObj) => {
      this.setState({user: userObj});
    });

    ipcRenderer.on('ext-files-message', (event, extFiles) => {
      this.setState({extFiles: extFiles});
    });

    ipcRenderer.on('key-not-found', () => {
      this.setState({keyNotFound: true});
    });
  },

  componentDidMount() {
    const setDimensions = () => {
      this.setState({
        viewerDimensions: this.refs.viewerNode.getBoundingClientRect(),
      });
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
      const keyIdentifier = {
        Right: FileNav.goTo.bind(this, 'next'),
        Left: FileNav.goTo.bind(this, 'prev'),
      };
      
      const shortcut = keyIdentifier[keyPress.keyIdentifier];

      if (shortcut) shortcut();
    });
  },

  render() {
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
    
    const renderFiles = () => {
      if (this.state.paths.list.length > 0) {
        return (
          <Files.Component
             pathsList={this.state.paths.list}
             pathsHierarchy={this.state.paths.hierarchy}
             currentImg={this.state.currentImg}
             onFileClick={Files.File.setCurrentImg.bind(this)}/>
        );
      } else {
        return '';
      }
    };

    const renderLayers = () => {
      return this.state.layers.map((Layer, index) => {
        return (
          <Layer
             key={index}
             zIndex={index + 1}
             currentImg={this.state.currentImg}
             viewerDimensions={this.state.viewerDimensions}
             extStore={this.state.extStores[Layer.extId]}/>
        );
      });
    };
    
    const renderExtButtons = () => {
      if (this.state.user && this.state.user.extensions.length > 0) {
        return this.state.user.extensions.map((ext, index) => {
          return (
            <ExtButton
               key={index}
               extName={ext.name}
               onClick={ExtButton.onClick.bind(this, ext.id)}/>
          );
        });
      } else {
        return '';
      }
    };

    const renderExtControls = () => {
      if (this.state.extControls.length > 0) {
        return this.state.extControls.map((Controls, index) => {
          return (
            <Controls key={index}
                      onClose={ExtButton.handleClose.bind(this, Controls.extId)}
                      extStore={this.state.extStores[Controls.extId]}/>
          );
        });
      } else {
        return '';
      }
    };
    
    return (
      <div className="siv">
        {this.state.keyNotFound ? renderKeyNotFoundMsg() : ''}
        <div className="Sidebar">
          <div className="Sidebar-msgs"></div>
          <div className="Sidebar-content">
            <div className="Sidebar-toggle-container"
                 onClick={() => this.setState({filesShown: !this.state.filesShown})}>
              <div className="Sidebar-toggle-icon">
                <img className={this.state.filesShown ? '' : 'rotate'}
                     src="icons/ic_chevron_left_black_24px.svg"/>
              </div>
              <div className="Sidebar-toggle-title">
                files
              </div>
            </div>        
            <div className={['files-container', this.state.filesShown ? 'visible' : ''].join(' ')}>
              {renderFiles()}
            </div>
            <div className={['extensions-container', this.state.filesShown ? '' : 'visible'].join(' ')}>
              {renderExtControls()}
            </div>
          </div>
        </div>
        <div className="Viewer"
             ref="viewerNode">
          <PathInput currentImg={this.state.currentImg}
                     onInputKeyUp={PathInput.setCurrentImgOnEnter.bind(this)} />
          <div className="LayerContainer">
            {renderLayers()}
          </div>
        </div>
        <div className="Toolbar">
          <FileNav
             onPrevClick={FileNav.goTo.bind(this, 'prev')}
             onNextClick={FileNav.goTo.bind(this, 'next')}/>          
          <div className="Toolbar-section ExtensionsNav">
            {renderExtButtons()}
          </div>
        </div>            
      </div>
    );
  }
});

ReactDOM.render(<SIV/>,
                document.getElementById('siv'));
