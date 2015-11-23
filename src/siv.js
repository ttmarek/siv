const ipcRenderer = require('electron').ipcRenderer;
const React = require('react');
const ReactDOM = require('react-dom');
const Layers = require('./layers');
const Image = require('./image');
const Files = require('./files');
const PathInput = require('./path-input');
const FileNav = require('./file-nav');
const ExtButton = require('./extButton');

const SIV = React.createClass({
  getInitialState() {    
    return {
      filesShown: true,
      layers: [],
      extensions: [],
      currentImg: '',
      viewerSize: null,
      user: null,
      extFiles: [],
      keyNotFound: false,
      paths: {hierarchy: [], list: []},
    };
  },

  componentWillMount() {
    ipcRenderer.on('file-paths-message', (event, filePaths) => {
      this.setState({paths: filePaths});
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
    window.addEventListener('keydown', this.shortcuts);
    this.setViewerSize();
    // Set the viewerSize once the window finishes resizing.
    // I initially wrote:
    // window.addEventListener('resize', this.setViewerSize)
    // But there was a noticeable amount of image flickering during a
    // window resize. Now, the image stretches with the window, then
    // fits into place once the window is done resizing.
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.setViewerSize();
      }, 100);
    });
  },

  setViewerSize() {
    const node = document.querySelector('.Viewer');
    this.setState({viewerSize: node.getBoundingClientRect()});
  },
  
  shortcuts(keyPress) {
    const keyIdentifier = {
      Right: FileNav.goTo.bind(this, 'next'),
      Left: FileNav.goTo.bind(this, 'prev'),
    };
    
    const shortcut = keyIdentifier[keyPress.keyIdentifier];

    if (shortcut) shortcut();
  },
  
  render() {
    const renderKeyNotFoundMsg = () => {
      const msg = `The key used to open SIV can no longer be detected.
          If you'd like to continue using SIV as a guest, please close
          all SIV windows and reopen it.`;
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
             onFirstRun={Files.Component.setCurrentImg.bind(this)}
             onFileClick={Files.File.setCurrentImg.bind(this)}/>
        );
      } else {
        return '';
      }
    };

    const renderLayers = () => {
      return this.state.layers.map((layer, index) => {
        return (
          <Layers.Component
             zIndex={index + 1}
             hidden={layer.hidden}
             onRender={layer.onRender}
             viewerState={{
               currentImg: this.state.currentImg,
               size: this.state.viewerSize,
             }}/>
        );
      });
    };

    const renderExtButtons = () => {
      if (this.state.user && this.state.user.extensions.length > 0) {
        return this.state.user.extensions.map(ext => {
          return (
            <ExtButton
               extName={ext.name}
               onClick={ExtButton.openExt.bind(this, ext.id)}/>
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
              {this.state.extensions}
            </div>
          </div>
        </div>
        <div className="Viewer">
          <PathInput
             currentImg={this.state.currentImg}
             onInputKeyUp={PathInput.setCurrentImgOnEnter.bind(this)}/>
          <div className="LayerContainer">
            {renderLayers()}
          </div>
        </div>
        <div className="Toolbar">
          <FileNav
             onPrevClick={FileNav.goTo.bind(this, 'prev')}
             onNextClick={FileNav.goTo.bind(this, 'next')}
             />          
          <div className="Toolbar-section ExtensionsNav">
            {renderExtButtons()}
          </div>
          <div className="Toolbar-section UserDisplay">
            User: {this.state.user ? this.state.user.id : ''}
          </div>
        </div>            
      </div>
    );
  }
});

ReactDOM.render(<SIV/>,
                document.getElementById('siv'));
